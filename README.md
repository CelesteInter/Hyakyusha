# Katalyste's Personal Discord Bot Project

## Features:

### Commands:
- /ping - replies with "pong!"
- /server - replies with server information
- /user - replies with your information

## Setup and running:

### Setup dev environment
1. Ensure you have Node.js installed (brew install node for macOS, Node.js website for windows)
2. Run `node init` and fill in the requested information
3. Run `npm install discord.js`
4. Ensure `config.json` has...
```
{
	"token": "discord bot token here",
    "clientId": "the client ID of the application",
	"guildId": "ID of server for testing commands"
}
```

### Additional dependencies
2/3/2026: Uses fuse.js
2/4/2026: Now using chokidar to allow for hot reloading of search commands

Dependencies should be installed via packagelock from npm

### Running the bot
1. To run the bot, use `node index.js` or `node .` if `"main": "index.js"` specified in `package.json`
2. To update new commands for testing server, run `node deploy-commands.js`
3. To update commands for global publishing (all servers), run `node deploy-commands-global.js`
