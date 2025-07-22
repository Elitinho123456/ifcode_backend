FROM node:20-slim

WORKDIR /app

COPY package*.json ./

# Install all dependencies (including devDependencies for TypeScript)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code (if you have a build script)
# RUN npm run build

EXPOSE 5001

# Start with ts-node (change src/app.ts to your entrypoint)
CMD ["npm", "run", "dev"]
