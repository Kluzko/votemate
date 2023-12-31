# 🗳️ Votemate - real-time voting application 

| [Tech Stack](#-tech-stack) | [Features](#-features) |[Getting started](#-getting-started) |[Flow](#-flow)  | [App Preview](#-app-demonstration)  | [Design](#-design) | [Packages](#-custom-local-packages) | [Scripts](#-scripts) | 
| ---------------------------------------- | ---------------------- |------------------------------------ |--------------- | ----------------------------------------- | ------------------ | ----------------------------------- | -------------------- | 

## 🔧 Tech Stack

![TypeScript](https://img.shields.io/badge/-TypeScript-%23007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/-React-%2320232a?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/-Redux-%23593d88?style=for-the-badge&logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)
![React Hook Form](https://img.shields.io/badge/-React%20Hook%20Form-%23EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)

![Node.js](https://img.shields.io/badge/-Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Fastify](https://img.shields.io/badge/-Fastify-23007ACC?style=for-the-badge&logo=fastify&logoColor=white)
![Prisma](https://img.shields.io/badge/-Prisma-23007ACC?style=for-the-badge&logo=prisma&logoColor=white)
![Inversify](https://img.shields.io/badge/-Inversify-FFA500?style=for-the-badge&logo=inversify&logoColor=white)
![Socket.io](https://img.shields.io/badge/-Socket.io-23007ACC?style=for-the-badge&logo=socket.io&logoColor=white)
![Zod](https://img.shields.io/badge/-Zod-ADFF2F?style=for-the-badge&logo=zod&logoColor=white)
[![Vitest](https://img.shields.io/badge/Vitest-%2314151B.svg?style=for-the-badge&logo=vitest&logoColor=white&color=green)](https://vitest.dev/)

![Vite](https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)
![Turborepo](https://img.shields.io/badge/-Turborepo-EF4444?style=for-the-badge&logo=Turborepo&logoColor=white)
![Render](https://img.shields.io/badge/-Render-%46E3B7?style=for-the-badge&logo=render&logoColor=white)
![CircleCI](https://img.shields.io/badge/-CircleCI-%23161616?style=for-the-badge&logo=circleci&logoColor=white)
![Figma](https://img.shields.io/badge/-Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-%232496ED?style=for-the-badge&logo=Docker&logoColor=white)
![PlanetScale](https://img.shields.io/badge/-PlanetScale-131415?style=for-the-badge)

## 💡 Features

- Realtime voting system
- Passwordless magic link authentication
- Private pools [ in development ]
- Voting data visualistation
- Responsive design
- Time-limited pools
- Guests can vote as well, and it is protected to ensure users can vote only once for particular answers
- User-friendly interface for creating and managing pools
- Anonymous voting to protect user privacy

## 🚀 Getting Started 

### ⚠️ Prerequisites 

Ensure you have Docker 🐳 installed on your machine, as it is necessary for creating a MySQL server instance. 

Additionally, you need to provide valid values for environment variables. Two environment files, [`.env`](https://github.com/Kluzko/votemate/blob/main/apps/server/.env-example) and [`.env.test`](https://github.com/Kluzko/votemate/blob/main/apps/server/.env.test-example), are required and these are located inside the `apps/server` directory.

### ⚙️ Setup 

1. **Install dependencies**: Run the following command to install the necessary dependencies:

    ```
    pnpm install
    ```

2. **Launch Docker container**: The following command creates a MySQL server instance:

    ```
    pnpm run db:up
    ```

3. **Generate and push Prisma schema**: The following command is necessary for setting up the database:

    ```
    pnpm run prisma:gp
    ```

4. **Generate and push test Prisma schema**: Execute the following command to setup the testing database:

    ```
    pnpm run prisma:gp:test
    ```

5. **Start the server**: Finally, run the following command to start the server:

    ```
    pnpm start
    ```
You should now have the Votemate server up and running locally on your machine.


## 📊 Flow

```mermaid
graph TB;

subgraph Application Layer
    apps((Apps)) 
    turborepo((Turborepo)) --> apps;
end

subgraph DevOps
    devops((DevOps)) --> server[Server];
    Docker --> devops;
    circleci[CircleCI] --> devops;
    apps --> devops;
end

subgraph Database
    db((Database)) --> server;
    mysql[MySQL] --> db;
    prisma[Prisma] --> db;
    planetscale[Planetscale] --> db;
end

subgraph Backend
    node[Node.js] --> fastify[Fastify];
    architecture((Architecture)) --> fastify;
    fastify --> socket[Socket.io];
    cqrs[CQRS] --> architecture;
    ddd[DDD / Clean Architecture] --> architecture;
    dependency[Dependency Injection] --> inversify[Inversify];
    inversify --> architecture;
    jwt[JWT] --> authorization((Authorization));
    authorization --> server;
    apps --> node;
end

subgraph Frontend
    apps --> web[Web];
    vite[Vite] --> react[React];
    react --> web;
    web --> redux[Redux];
    web --> reactquery[React Query];
    web --> tailwind[TailwindCSS];
    socket[Socket.io] --> web;
end

subgraph Testing
    Vitest[Vitest]
    unit[Unit Tests] --> Vitest;
    integration[Integration Tests] --> Vitest;
    e2e[E2E Tests] --> Vitest;
    apps --> Vitest;
end

```
## 📺 App demonstration

![Votemate GIF](https://github.com/Kluzko/votemate/blob/main/votemate.gif)

## 🎨 Design

The user interface and visual design of Votemate have been created using Figma. You can view the design by clicking the link below:

[Figma Design](https://www.figma.com/file/UhMvmdRwR6pnhJy9YkCC8E/Votemate?type=design&node-id=39%3A166&mode=design&t=E6auyLTlJxHyEJA8-1)

Feel free to explore the design to get an overview of the app's layout, color scheme, and other visual elements.


## 📦 Custom local packages

| @votemate/tsconfig     | @votemate/eslint-config|
| ---------------------- | -------------------- |
| shared tsconfig config | shared eslint config |

## 📜 Scripts

| Command Name     | Description                          | Type           |
|------------------|--------------------------------------|----------------|
| `start`          | Start the server in production mode  | Server, Global |
| `dev`            | Start the server in development mode | Server, Web, Global |
| `lint`           | Lint the code                        | Server, Web, Global |
| `lint:fix`       | Fix linting issues                   | Server, Web, Global |
| `ts:check`       | Check TypeScript code                | Server, Web, Global |
| `check`          | Run lint and ts:check                | Server, Web, Global |
| `test:unit`      | Run unit tests                       | Server         |
| `test:integration` | Run integration tests             | Server         |
| `test:e2e`       | Run end-to-end tests                 | Server         |
| `test:all`       | Run all tests                        | Server         |
| `build`          | Build the project                    | Server, Web, Global |
| `prisma`         | Generate Prisma client               | Server, Global |
| `prisma:push`    | Push Prisma schema changes           | Server, Global |
| `prisma:studio`  | Start Prisma Studio                  | Server, Global |
| `prisma:gp`      | Generate and push Prisma schema      | Server, Global |
| `prisma:gp:test` | Generate and push test Prisma schema | Server, Global |
| `db:up`          |Launch Docker container with MySQL server instance| Server, Global |
| `db:down`        | Stop and remove Docker container with MySQL server instance | Server, Global |
| `test:coverage`  | Shows test coverage for server         | Server, Global   |

