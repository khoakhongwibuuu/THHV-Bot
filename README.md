# THHV-Bot (MVP)

## About this project

THHV-Bot is a Discord bot project developed using Node.js, `discord.js`, `PostgreSQL`, `Redis`, and `Prisma ORM`. It serves as the backend software for the THHV Discord server, offering features such as Codeforces Contest Announcement and quiz games.

This version represents the MVP (Minimum Viable Product) utilizing a modern stack with Docker support for easier deployment and management.

## Prerequisites

Before setting up the bot, ensure you have the following:

-   **Node.js**: Install the latest version from [nodejs.org](https://nodejs.org/).
-   **Docker & Docker Compose**: Recommended for running the bot alongside its databases easily.
-   **Discord Account**: Required to create and manage your bot.
-   **Discord Server**: A server you own or where you moderate to add the bot.
-   **Discord Bot**: A registered bot in the [Discord Developer Portal](https://discord.com/developers/applications).

## Setup Guide

### 1. Clone the Repository

Begin by cloning the repository to your local machine:

```bash
git clone https://github.com/khoakhongwibuuu/THHV-Bot.git
cd THHV-Bot
```

### 2. Configure Environment Variables

1. Copy the provided `.env.example` file to create your own `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and fill in the required variables:
   -   **TOKEN**: The login token of the bot. You **must** treat this as your password.
   -   **CLIENT_ID**: Required to install commands to your bot.
   -   **OWNER_ID**: Your Discord User ID, required to use high-risk commands.
   -   **POSTGRES_DB**, **POSTGRES_USER**, **POSTGRES_PASSWORD**: Credentials for the PostgreSQL database (used by Docker).
   -   **DATABASE_URL**: Used for local development and Prisma CLI connections (leave as `localhost` if running tools locally).
   -   **REDIS_URL**: Used for local Redis connection.

### 3. Setup with Docker

The easiest way to run the bot and its dependencies (PostgreSQL and Redis) is using Docker.

1. Ensure the external Docker network exists (used in `compose.yml`):
   ```bash
   docker network create multi-domain
   ```

2. Start the services:
   ```bash
   docker compose up -d --build
   ```

This will automatically start PostgreSQL, Redis, and the bot itself.

### 4. Configure Privileged Gateway Intents

In the Developer Portal, go to the **Bot** section.
At **Privileged Gateway Intents**, toggle the following on:

-   **Message Content Intent**: Needed for `auto-reactor` and `word-match` modules to work correctly.
-   **Server Members Intent**: Needed for `ticket` module to work correctly.

### 5. Invite Bot to Your Server

Generate an OAuth2 URL to invite the bot:

1. Go to the **OAuth2** section.
2. At **OAuth2 URL Generator**, under **Scopes**, tick `bot` and `applications.commands`.
3. Under **Bot Permissions**, choose this permission `ADMINISTRATOR`.
4. Copy the generated URL and paste it into your browser.
5. Select your server and authorize the bot.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear messages.
4. Push to your branch and create a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

-   [discord.js Guide](https://discordjs.guide/)
-   [Prisma ORM](https://www.prisma.io/)
-   [Open Trivia Database](https://opentdb.com/)
-   [Codeforces API](https://codeforces.com/apiHelp)
