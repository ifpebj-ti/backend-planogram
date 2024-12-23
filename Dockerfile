FROM node:18-alpine
    
WORKDIR /usr/appBackend

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./

RUN npm install

RUN npm install -g dotenv-cli

COPY . .

RUN npx prisma generate

EXPOSE 8080

ENV LD_LIBRARY_PATH=/usr/lib/libssl3:/usr/lib

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]
