# TRZ- BACKEND

## Install dependencies
- Install [node](https://nodejs.org/en/download/). Optional [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable).
- Optional [docker](https://docs.docker.com/get-docker/).
- Run `npm i` or `yarn`

## Run project
- Before run, config db, create a file like [.env.example](./.env.example) with your variables with name .env
- Case docker , run `docker-compose up -d --build`, [config file](./docker-compose.yml)
- Run `npm run dev:server` or `yarn dev:server`

## Run Tests

- Run `npm run test` or `yarn test`

## Routes

- Install [insonmia](https://insomnia.rest/download/) and import file [routes.json](./routes.json)
- Insonmia have all routes and examples

