FROM oven/bun:latest

WORKDIR /app

# Copy package files first for layer caching
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy the rest of the source (volume mount overrides this in dev)
COPY . .

# Expose the Vite dev server port
EXPOSE 3000

# Start the development server with hot reload
CMD ["bun", "run", "dev"]
