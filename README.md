# add me to

![ci](https://github.com/ptlm500/add-me-to/workflows/ci/badge.svg?branch=main)

A simple Discord role management bot

## Repository setup

1. Open your terminal
2. Navigate to the directory where you want the local copy of the repository to be stored
3. Clone the repository by running `git clone git@github.com:ptlm500/add-me-to.git`
4. Run `cd add-me-to`
5. Run `npm install`

## Setting up PostgreSQL

1. Follow [these steps](https://www.postgresql.org/download/) to configure PostgreSQL
2. Create a new database named `addmeto`

## Setting up a Discord bot

1. Follow [these steps](https://discordjs.guide/preparations/setting-up-a-bot-application.html) to setup a Discord Bot linked to your account. You'll use this bot for testing.
2. [Add a bot to a server you own](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links)

## Configuring the required environment variables

1. Create a new file called `.env` in the root folder of the project
2. Add the following variables to the `.env` file:

```env
DISCORD_TOKEN=<your Discord bot token>
DB_HOST=<your PostgreSQL server host>
DB_PORT=<your PostgreSQL server port>
DB_NAME=addmeto
DB_USERNAME=<your PostgreSQL username>
DB_PASSWORD=<your PostgreSQL password>
```

## Configuring optional environment variables

You can enable logging to Discord channel [Webhooks](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) by adding the following variables to your `.env` file:

```env
DISCORD_NOITCE_WEBHOOK=<webhook url>
DISCORD_ERROR_WEBHOOK=<webhook url>
```

`DISCORD_NOITCE_WEBHOOK` is configured to output logs of level `notice` and above.
`DISCORD_ERROR_WEBHOOK` is configured to output logs of level `error` and above.

## Running the bot

1. Run `npm run start:dev`
