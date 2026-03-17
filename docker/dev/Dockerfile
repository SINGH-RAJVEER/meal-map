FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

EXPOSE 3000

CMD ["bun", "--bun", "run", "vite", "dev", "--host", "0.0.0.0", "--port", "3000"]
