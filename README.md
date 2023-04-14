# concordServer

A mock Ethereum JSON-RPC and WebSocket server backed by a PostgreSQL database. This server supports a subset of Ethereum JSON-RPC methods, Chainlink Direct Request Jobs, and WebSocket subscriptions for events.

## Prerequisites

- Docker
- Docker Compose

## Directory Structure

```
concordServer/
│
├── app
│   ├── api
│   │   ├── getBalance.js
│   │   ├── getBlockByNumber.js
│   │   ├── getLogs.js
│   │   ├── oracles.js
│   │   ├── requests.js
│   │   ├── responses.js
│   │   └── users.js
│   ├── database
│   │   └── schema.sql
│   ├── index.js
│   └── websocket
│       └── websocket.js
├── docker-compose.yml
├── Dockerfile
├── LICENSE
├── package.json
├── public
│   ├── app.js
│   └── index.html
└── README.md
```


## Setup

1. Clone the repository:

```git clone https://github.com/DexTrac-Devlin/concordServer.git```

2. Navigate to the project directory:

```cd concordServer```

3. Create a `.env` file in the root directory of the project using the `.env.example` file as a reference:

```cp .env.example .env```

4. Update the `.env` file with any required configuration values.

5. Start the server using Docker Compose:

```docker-compose up --build```

This command will build the Docker images for the Node.js application and the PostgreSQL database, and then start the containers. The PostgreSQL container will automatically import the schema from the `app/database/schema.sql` file.

## Usage

The server will be running on the specified port (default is 3000). You can access the web frontend by navigating to `http://localhost:3000` in your browser.

The server exposes the following API endpoints:

- `/api/users`: Manage users
- `/api/oracles`: Manage oracles
- `/api/requests`: Manage requests
- `/api/responses`: Manage responses
- `/api/balance`: Get account balance
- `/api/block`: Retrieve block header
- `/api/logs`: Read logs

It also supports WebSocket connections and a subset of Ethereum JSON-RPC methods.

## License

[GPLv3](LICENSE)
