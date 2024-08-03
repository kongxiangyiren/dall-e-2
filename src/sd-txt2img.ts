import axios, { AxiosInstance } from 'axios';

export type SamplerName =
  | 'Euler a'
  | 'Euler'
  | 'LMS'
  | 'Heun'
  | 'DPM2'
  | 'DPM2 a'
  | 'DPM++ 2S a'
  | 'DPM++ 2M'
  | 'DPM++ SDE'
  | 'DPM fast'
  | 'DPM adaptive'
  | 'LMS Karras'
  | 'DPM2 Karras'
  | 'DPM2 a Karras'
  | 'DPM++ 2S a Karras'
  | 'DPM++ 2M Karras'
  | 'DPM++ SDE Karras'
  | 'DDIM'
  | 'PLMS'
  | 'UniPC';
export type HiResUpscalerName =
  | 'None'
  | 'Latent'
  | 'Latent (antialiased)'
  | 'Latent (bicubic)'
  | 'Latent (bicubic antialiased)'
  | 'Latent (nearist)'
  | 'Latent (nearist-exact)'
  | 'Lanczos'
  | 'Nearest'
  | 'ESRGAN_4x'
  | 'LDSR'
  | 'ScuNET GAN'
  | 'ScuNET PSNR'
  | 'SwinIR 4x';

export type Txt2ImgOptions = {
  prompt?: string;
  negative_prompt?: string;
  styles?: string[];
  seed?: number;
  subseed?: number;
  subseed_strength?: number;
  seed_resize_from_h?: number;
  seed_resize_from_w?: number;
  scheduler?: schedulerName;
  enable_hr?: boolean;
  hr_scale?: number;
  hr_upscaler?: HiResUpscalerName;
  hr_second_pass_steps?: number;
  hr_resize_x?: number;
  hr_resize_y?: number;
  denoising_strength?: number;
  firstphase_width?: number;
  firstphase_height?: number;

  batch_size?: number;
  n_iter?: number;
  steps?: number;
  cfg_scale?: number;
  width?: number;
  height?: number;
  restore_faces?: boolean;
  tiling?: boolean;
  do_not_save_samples?: boolean;
  do_not_save_grid?: boolean;

  eta?: number;
  s_churn?: number;
  s_tmax?: number;
  s_tmin?: number;
  s_noise?: number;
  override_settings?: Record<string, unknown>;
  override_settings_restore_afterwards?: boolean;
  script_args?: unknown[];
  script_name?: string;
  send_images?: boolean;
  save_images?: boolean;
  alwayson_scripts?: Record<string, unknown>;

  sampler_name?: SamplerName;
};

export default class StableDiffusionApi {
  private baseUrl: string;
  private timeout: number;
  private defaultSampler: SamplerName;
  private defaultStepCount: number;
  private axios: AxiosInstance;
  constructor(options: {
    baseUrl: string;
    timeout?: number;
    defaultSampler?: SamplerName;
    defaultStepCount?: number;
  }) {
    this.baseUrl = options.baseUrl;
    this.timeout = options.timeout ?? 1 * 60 * 1000;
    this.defaultSampler = options.defaultSampler ?? 'Euler a';
    this.defaultStepCount = options.defaultStepCount ?? 20;
    this.axios = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
    });
  }

  txt2img(options: Txt2ImgOptions): Promise<{
    images: string[];
    parameters: Txt2ImgOptions;
    info: string;
  }> {
    options.sampler_name = options.sampler_name ?? this.defaultSampler;
    options.steps = options.steps ?? this.defaultStepCount;

    return this.axios
      .post('/sdapi/v1/txt2img', options)
      .then((response: any) => {
        return response.data;
      });
  }
}

export type schedulerName =
  | 'Automatic'
  | 'Uniform'
  | 'Karras'
  | 'Exponential'
  | 'Polyexponential'
  | 'SGM Uniform'
  | 'KL Optimal'
  | 'Align Your Steps'
  | 'Simple'
  | 'Normal'
  | 'DDIM'
  | 'Beta';
