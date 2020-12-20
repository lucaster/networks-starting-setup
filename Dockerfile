FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

CMD node app.js

#docker build . -t favorites-node

#docker run --name mongo -d --rm mongo
#docker run --name favorites -d --rm -p 3000:3000 favorites-node

#docker stop favorites mongo