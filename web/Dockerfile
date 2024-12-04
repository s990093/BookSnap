FROM node:18-alpine

WORKDIR /app

# 安裝依賴
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 複製源代碼
COPY . .

# 構建應用
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"] 