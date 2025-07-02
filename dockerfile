# Step 1: Build the React app
FROM node:lts AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --force

# Copy source code and env file
COPY . ./

# Default to production env file, override using build args
ARG REACT_APP_ENV_FILE=.env.production
COPY $REACT_APP_ENV_FILE .env

# Build the app
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
