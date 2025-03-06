# How to use

## About this project

THHV-Bot is a Discord bot project developed using Node.js and the `discord.js` library. It serves as the backend software for the THHV Discord server, offering features such as Codeforces Contest Announcement and quiz games.

## Prerequisites

Before setting up the bot, ensure you have the following:

-   **Node.js**: Install the latest version from [nodejs.org](https://nodejs.org/).
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

### 2. Install Dependencies

Navigate to the project directory and install the necessary dependencies:

```bash
npm install
```

This command installs all packages listed in the `package.json` file such as `discord.js`.

### 3. Configure Environment Variables

At this point, make sure you have the following things:

-   **TOKEN**: The login token of the bot. You **must** treat this as your password.
-   **Application ID**: Required to install commands to your bot.
-   **Your User ID in Discord**: Required to use high-risk commands.

Run the following command, the file `login.env` will be automatically in `auth` directory.

```bash
node index.js
```

In the created file, provide the following configuration.

```env
TOKEN=<the-login-token-of-the-bot>
CLIENT_ID=<the-application-id>
OWNER_ID=<your-discord-user-id>
```

### 4. Deploy the command

Deploy commands using:

```bash
node deploy.js
```

If `login.env` was configured correctly, the following message should appear.

```bash
Loaded config from login.env
Started refreshing 22 application (/) commands.
Successfully reloaded 22 application (/) commands.
```

### 5. Configure Privileged Gateway Intents

In the Developer Portal, go to the **Bot** section.
At **Privileged Gateway Intents**, toggle the following on:

-   **Message Content Intent**: Needed for `auto-reactor` and `word-match` module to work correctly.


### 6. Invite Bot to Your Server

Generate an OAuth2 URL to invite the bot:

1. Go to the **OAuth2** section.
2. At **OAuth2 URL Generator**, under **Scopes**, tick `bot` and `applications.commands`.
3. Under **Bot Permissions**, choose this permision `ADMINISTRATOR`.
4. Copy the generated URL and paste it into your browser.
5. Select your server and authorise the bot.

### 7. Run the Bot

Start the bot using:

```bash
node index.js
```

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
-   [Open Trivia Database](https://opentdb.com/)
-   [Codeforces API](https://codeforces.com/apiHelp)

For further assistance, refer to the [official documentation](https://discordjs.guide/) or join the Discord.js community.
