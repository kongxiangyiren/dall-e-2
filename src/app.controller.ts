import {
  Body,
  Controller,
  Get,
  Post,
  // Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import StableDiffusionApi, {
  HiResUpscalerName,
  SamplerName,
  schedulerName,
} from './sd-txt2img';
import { Request, Response } from 'express';
let api: StableDiffusionApi;
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/v1/images/generations')
  async images(
    @Body()
    body: {
      prompt: string;
      n: number;
      size: string;
    },
    // @Req() req: Request,
  ) {
    try {
      if (!api) {
        api = new StableDiffusionApi({
          baseUrl: process.env.baseUrl || 'http://127.0.0.1:7860',
          timeout: isNaN(Number(process.env.timeout))
            ? 2 * 60 * 1000
            : Number(process.env.timeout),
          defaultSampler:
            (process.env.defaultSampler as SamplerName) || 'Euler a',
          defaultStepCount: isNaN(Number(process.env.defaultStepCount))
            ? 20
            : Number(process.env.defaultStepCount),
        });
      }
      // 密钥
      // const token = req.headers.authorization;
      // console.log(token);

      // 图片大小
      const size = process.env.size?.split('x') ||
        body.size?.split('x') || ['512', '512'];

      const result = await api.txt2img({
        width: isNaN(Number(size[0])) ? 512 : Number(size[0]),
        height: isNaN(Number(size[1])) ? 512 : Number(size[1]),
        enable_hr: process.env.enable_hr === 'true' ? true : false,
        denoising_strength: isNaN(Number(process.env.denoising_strength))
          ? 0.7
          : Number(process.env.denoising_strength),
        hr_scale: isNaN(Number(process.env.hr_scale))
          ? 2
          : Number(process.env.hr_scale),
        hr_upscaler: (process.env.hr_upscaler as HiResUpscalerName) || 'Latent',
        hr_second_pass_steps: isNaN(Number(process.env.hr_second_pass_steps))
          ? 0
          : Number(process.env.hr_second_pass_steps),
        prompt: body.prompt + ',' + process.env.basePrompt,
        negative_prompt: process.env.negative_prompt || '',
        batch_size: isNaN(Number(process.env.batch_size))
          ? body.n || 1
          : Number(process.env.batch_size),
        seed: -1,
        cfg_scale: isNaN(Number(process.env.cfg_scale))
          ? 7
          : Number(process.env.cfg_scale),
        scheduler: (process.env.scheduler as schedulerName) || 'Automatic',
      });

      if (result instanceof Error) {
        return result;
      }

      const res = {
        created: +new Date(),
        data: [] as Array<{
          revised_prompt: string;
          url: string;
        }>,
      };

      result.images.forEach((image) => {
        if (image) {
          res.data.push({
            revised_prompt: body.prompt,
            url: 'data:image/jpeg;base64,' + image,
          });
        }
      });
      return res;
    } catch (error) {
      return error;
    }
  }

  @Post('/v1/chat/completions')
  test(@Body() body: any, @Res() res: Response) {
    // console.log(body);

    return res.status(200).json({
      model: body.model,
      object: 'chat.completion',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: 'Hello!',
          },
          finish_reason: 'stop',
        },
      ],
      usage: { prompt_tokens: 9, completion_tokens: 10, total_tokens: 19 },
    });
  }
}
