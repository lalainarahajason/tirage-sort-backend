# tirage-sort-backend

Backend API for lottery/draw system (tirage au sort).

## Features

- Add participants to lottery
- Remove participants
- Perform random draws
- View winners
- Reset lottery

## Installation

```bash
npm install
```

## Usage

### Start the server

```bash
npm start
```

The server will run on port 3000 by default.

### Run tests

```bash
npm test
```

## API Endpoints

### Health Check
- **GET /** - Returns API status

### Participants
- **GET /participants** - Get all participants
- **POST /participants** - Add a new participant
  - Body: `{ "name": "John Doe", "email": "john@example.com" }`
- **DELETE /participants/:id** - Remove a participant by ID

### Draw
- **POST /draw** - Perform a lottery draw
  - Body (optional): `{ "count": 2 }` (number of winners, default: 1)
- **GET /winners** - Get current winners

### Reset
- **POST /reset** - Reset the lottery (clear all participants and winners)

## Example Usage

```bash
# Add participants
curl -X POST http://localhost:3000/participants -H "Content-Type: application/json" -d '{"name":"Alice"}'
curl -X POST http://localhost:3000/participants -H "Content-Type: application/json" -d '{"name":"Bob"}'
curl -X POST http://localhost:3000/participants -H "Content-Type: application/json" -d '{"name":"Charlie"}'

# Get all participants
curl http://localhost:3000/participants

# Draw a winner
curl -X POST http://localhost:3000/draw

# Get winners
curl http://localhost:3000/winners

# Reset lottery
curl -X POST http://localhost:3000/reset
```

## License

ISC