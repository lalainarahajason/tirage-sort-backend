# Backend Guidelines

## Repository

**GitHub Repository**: `git@github.com:lalainarahajason/tirage-sort-backend.git`

## Architecture

This backend follows Clean Architecture principles with the following structure:
- `domain/` - Business entities and repository interfaces
- `application/` - Use cases and business logic
- `infrastructure/` - External implementations (Prisma, services)
- `interface/` - HTTP routes, controllers, and middlewares

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: Zod (planned)

## Development

```bash
# Install dependencies
npm install

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## API Documentation

See `/docs/API.md` for complete API specification.
