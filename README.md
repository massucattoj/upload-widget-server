# Upload Widget Server

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue.svg)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.2.1-green.svg)](https://www.fastify.io/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933.svg)](https://nodejs.org/)
[![DrizzleORM](https://img.shields.io/badge/DrizzleORM-0.39.1-orange.svg)](https://orm.drizzle.team/)
[![AWS SDK](https://img.shields.io/badge/AWS_SDK-3.x-232F3E.svg)](https://aws.amazon.com/sdk-for-javascript/)
[![pnpm](https://img.shields.io/badge/pnpm-Latest-orange.svg)](https://pnpm.io/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0.4-green.svg)](https://vitest.dev/)

A modern and efficient file upload server built with TypeScript, Fastify, and AWS S3 integration. This project provides a robust API for handling file uploads with features like CSV processing, type safety with Zod, and comprehensive testing.

## 🚀 Features

- **Type-Safe API**: Built with TypeScript and Zod for complete type safety
- **Fast Server**: Powered by Fastify framework
- **Database Integration**: Uses DrizzleORM with PostgreSQL
- **File Storage**: AWS S3 integration for reliable file storage
- **API Documentation**: Swagger/OpenAPI integration
- **Testing**: Comprehensive test suite with Vitest
- **Development Tools**: Biome for linting and formatting
- **Docker Support**: Easy development setup with Docker Compose

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Fastify
- **ORM**: DrizzleORM
- **Database**: PostgreSQL
- **Storage**: Cloudflare R2
- **Testing**: Vitest
- **Documentation**: Swagger/OpenAPI
- **Package Manager**: pnpm
- **Code Quality**: Biome

## 📦 Prerequisites

- Node.js 20.x or higher
- pnpm package manager
- Docker and Docker Compose (for local development)
- AWS account with S3 access (for production)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd upload-widget-server
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the database**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   pnpm db:migrate
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

## 🧪 Testing

Run the test suite:

```bash
# Run tests once
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## 📚 Database Management

```bash
# Generate migration files
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio
```

## 🏗️ Build

To build the project for production:

```bash
pnpm build
```

## 📝 API Documentation

Once the server is running, you can access the Swagger documentation at:
- `/documentation` - Swagger UI
- `/documentation/json` - OpenAPI JSON specification

## 🐳 Docker Support

The project includes Docker support for easy development and deployment:

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down
```

### Development Guidelines

- Write tests for new features
- Update documentation for significant changes
- Follow the code style enforced by Biome
- Keep pull requests focused on a single feature or fix


## 🏛️ Architecture Patterns

The project follows several well-established architectural patterns and principles:

### Clean Architecture

The codebase is organized following Clean Architecture principles with clear separation of concerns:

- **`src/app/`**: Application/Domain Layer
  - Contains business logic and use cases
  - Pure TypeScript implementation, framework-agnostic
  - Houses domain entities and business rules

- **`src/infra/`**: Infrastructure Layer
  - `http/`: HTTP server implementation (Fastify)
  - `db/`: Database implementations (DrizzleORM)
  - `storage/`: File storage implementations (AWS S3)
  - Handles external integrations and technical implementations

- **`src/shared/`**: Shared Utilities
  - Common utilities and helpers
  - Shared types and interfaces
  - Cross-cutting concerns

### Design Patterns

1. **Dependency Injection**
   - Loose coupling between components
   - Improved testability and maintainability
   - Dependencies are explicitly declared

2. **Repository Pattern**
   - Abstraction over data storage
   - Clean separation between business logic and data access
   - Easily swappable implementations (e.g., different storage providers)

3. **Factory Pattern**
   - Used for creating complex objects
   - Encapsulates initialization logic
   - Promotes consistency in object creation

4. **Middleware Pattern**
   - HTTP middleware for cross-cutting concerns
   - Request/Response pipeline processing
   - Authentication, logging, error handling
   
## 👏 Acknowledgments

Special thanks to the amazing open-source projects that make this possible:

- [Fastify](https://www.fastify.io/) - For providing an incredibly fast and low overhead web framework
- [DrizzleORM](https://orm.drizzle.team/) - For the excellent TypeScript ORM
- [AWS SDK](https://aws.amazon.com/sdk-for-javascript/) - For reliable cloud storage integration
- [Zod](https://zod.dev/) - For runtime type safety
- [Vitest](https://vitest.dev/) - For the modern testing framework
- [Biome](https://biomejs.dev/) - For maintaining code quality
- The entire open-source community for their continuous inspiration and support

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Made with ❤️ using TypeScript and Fastify
