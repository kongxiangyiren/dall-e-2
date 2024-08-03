# 打包
FROM node:22.2.0-alpine AS buildstage 

WORKDIR /app
COPY ./ ./
RUN npm i --registry=https://registry.npmmirror.com

RUN npm run build

# ======================== 上：打包  下：运行 ========================

# 设置基础镜像
FROM node:22.2.0-alpine

# 设置工作目录
WORKDIR /app
# 复制依赖文件
COPY --from=buildstage /app/dist ./dist
COPY --from=buildstage /app/package.json ./package.json
COPY --from=buildstage /app/package-lock.json ./package-lock.json
COPY --from=buildstage /app/.env ./.env
COPY --from=buildstage /app/public ./public

# # # 安装依赖
# RUN npm ci --production --registry=https://registry.npmmirror.com

# 设置环境
ENV NODE_ENV=production
# 暴露端口
EXPOSE 7860

# 运行项目
CMD ["npm", "run", "start:docker"]