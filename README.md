# 🔐 Authentication Service

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT"/>
  <img src="https://sonarcloud.io/api/project_badges/measure?project=YOUR_PROJECT_KEY&metric=alert_status" alt="SonarCloud Status"/>
</div>

A robust authentication microservice built with TypeScript, Express, and TypeORM, featuring JWT-based authentication and comprehensive user management.

## 📋 Table of Contents
- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Docker Setup](#-docker-setup)
- [Supabase for Cloud DB Testing](#supabase-for-cloud-db-testing)
- [SonarCloud Code Quality](#sonarcloud-code-quality)
- [API Documentation](#-api-documentation)
- [Development](#-development)

## ✨ Features
<div align="center">
  <table>
    <tr>
      <td align="center">🔐</td>
      <td>JWT-based authentication</td>
      <td align="center">👤</td>
      <td>User management (CRUD)</td>
    </tr>
    <tr>
      <td align="center">🔒</td>
      <td>Role-based access control</td>
      <td align="center">📝</td>
      <td>Request validation</td>
    </tr>
    <tr>
      <td align="center">🐳</td>
      <td>Docker support</td>
      <td align="center">📊</td>
      <td>PostgreSQL database</td>
    </tr>
    <tr>
      <td align="center">🧪</td>
      <td>Unit testing with Jest</td>
      <td align="center">🔍</td>
      <td>Request logging</td>
    </tr>
  </table>
</div>

## 🏗️ Architecture

### System Overview
```mermaid
graph TD
    A[Client] -->|HTTP Request| B[Auth Service]
    B -->|Validate| C[JWT Middleware]
    C -->|Query| D[PostgreSQL (Local/Cloud: Supabase)]
    B -->|Generate| E[JWT Token]
    B -->|Store| F[User Data]
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style D fill:#dfd,stroke:#333,stroke-width:2px
```

### Data Flow
```mermaid
flowchart LR
    subgraph Client
        A[Web App] --> B[Mobile App]
        B --> C[Desktop App]
    end
    
    subgraph Auth Service
        D[API Gateway] --> E[Auth Controller]
        E --> F[User Service]
        F --> G[Database Service]
    end
    
    subgraph Database
        H[(PostgreSQL (Local/Cloud: Supabase))]
    end
    
    Client --> D
    G --> H
```

## 📦 Prerequisites
<div align="center">
  <table>
    <tr>
      <td align="center">⚡</td>
      <td>Node.js (v18 or higher)</td>
    </tr>
    <tr>
      <td align="center">🐘</td>
      <td>PostgreSQL</td>
    </tr>
    <tr>
      <td align="center">🐳</td>
      <td>Docker (optional)</td>
    </tr>
    <tr>
      <td align="center">📦</td>
      <td>npm or yarn</td>
    </tr>
  </table>
</div>

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone <repository-url>
cd auth-service
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure environment variables
Create a `.env` file in the root directory:
```env
PORT=5501
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=auth_db
JWT_SECRET=your_jwt_secret
```

### 4️⃣ Start the service
```bash
npm run dev
```

## 🐳 Docker Setup

### Development Environment

#### 1️⃣ Build the Docker image
```bash
docker build -t auth-service:dev -f docker/dev/Dockerfile .
```

#### 2️⃣ Run the container
```bash
# For PowerShell
docker run --rm -it -v ${PWD}:/usr/src/app -v /usr/src/app/node_modules --env-file ${PWD}/.env.dev -p 5501:5501 -e NODE_ENV=development auth-service:dev

# For Command Prompt
docker run --rm -it -v %cd%:/usr/src/app -v /usr/src/app/node_modules --env-file %cd%/.env.dev -p 5501:5501 -e NODE_ENV=development auth-service:dev
```

### Database Setup

#### 1️⃣ Create a persistent volume
```bash
docker volume create mernpgdata
```

#### 2️⃣ Run PostgreSQL container
```bash
docker run --rm --name mernpg-container \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=root \
  -v mernpgdata:/var/lib/postgresql/data \
  -p 5432:5432 \
  -d postgres
```


#### 2️⃣ Generate migration
#### 2️⃣ add this command to the script of package.json
  "scripts": {
      "dev": "cross-env NODE_ENV=dev nodemon --legacy-watch src/server.ts",
      "test": "jest --watch --runInBand",
      "start": "ts-node src/index.ts",
      "migration:generate": "typeorm-ts-node-commonjs migration:generate -d src/config/data-source.ts",
      "migration:run": "typeorm-ts-node-commonjs migration:run",
      "migration:create": "typeorm-ts-node-commonjs migration:create",
      "docker:pg": "docker run --rm --name mernpg-container -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v mernpgdata:/var/lib/postgresql/data -p 5432:5432 -d postgres",
      "docker:express": "docker run --rm -it -v %cd%:/usr/src/app -v /usr/src/app/node_modules --env-file %cd%\\.env.dev -p 5501:5501 -e NODE_ENV=development auth-service:dev",
      "docker:up": "npm run docker:pg && npm run docker:express"
   },

#### 2️⃣ Run this command in terminal to generate the migration file inside the migrations folder 
```bash
npm run migration:generate -- src/migration/rename_tables
```

#### 2️⃣ Run this command in terminal to run the migration file generated inside the migrations folder 
```bash
npm run migration:run -- -d src/config/data-source.ts
```


## 🧪 Supabase for Cloud DB Testing

You can use [Supabase](https://supabase.com/) as a managed PostgreSQL database for running tests in CI or locally. This is useful for cloud-based pipelines or when you want a consistent, isolated DB for test runs.

### Setup
1. Create a free project on [Supabase](https://app.supabase.com/).
2. Get your Supabase DB connection string from the project settings.
3. Create a `.env.test` file in your project root:

```env
DB_HOST=your-supabase-host.supabase.co
DB_PORT=5432
DB_USERNAME=your-supabase-username
DB_PASSWORD=your-supabase-password
DB_DATABASE=postgres
```

4. Update your test scripts to use `.env.test` or override env vars in your CI pipeline.

### Example (package.json script)
```json
"scripts": {
  "test:cloud": "cross-env NODE_ENV=test dotenv -e .env.test -- jest --runInBand"
}
```

## 🛡️ SonarCloud Code Quality

[SonarCloud](https://sonarcloud.io/) is used for static code analysis and code review automation.

### Setup
1. Sign up at [SonarCloud](https://sonarcloud.io/) and link your repository.
2. Add a `sonar-project.properties` file to your repo root:

```
sonar.organization=your-org
sonar.projectKey=your-project-key
sonar.sources=src
sonar.tests=tests
sonar.test.inclusions=**/*.spec.ts
sonar.typescript.lcov.reportPaths=coverage/lcov.info
```

3. Add SonarCloud to your CI pipeline (see [SonarCloud Docs](https://docs.sonarcloud.io/ci-integration/)).
4. Add the SonarCloud badge to the top of this README (replace `YOUR_PROJECT_KEY`).

### Example GitHub Actions step
```yaml
- name: SonarCloud Scan
  uses: SonarSource/sonarcloud-github-action@master
  with:
    projectKey: your-project-key
    organization: your-org
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

## 📚 API Documentation

### Authentication Flow
```