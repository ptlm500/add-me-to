FROM node:16

WORKDIR /usr/app

# Only copy the package.json file to work directory
COPY package.json .
# Install all Packages
RUN npm install -g typescript
RUN npm install --production

# Copy all other source code to work directory
COPY . .
# Compile
RUN npm run build

# Start
CMD [ "node", "./dist/index.js" ]
