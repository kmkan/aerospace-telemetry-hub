# Use official Node image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and install
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 5000

# Start app
CMD ["npm", "run", "dev"]