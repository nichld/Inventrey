# frontend/Dockerfile

# Build Stage
FROM node:18 AS builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Production Stage
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy the build output from the builder stage
COPY --from=builder /usr/src/app ./

# Install only production dependencies
RUN npm install --production

# Expose the frontend port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]