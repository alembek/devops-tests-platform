FROM node:18


WORKDIR /app


COPY . .


RUN npm install

RUN npm install react-router-dom axios

RUN npm run build


RUN npm install -g serve


EXPOSE 5173


CMD ["serve", "-s", "dist"]

