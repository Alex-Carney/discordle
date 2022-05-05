const { Client, Intents, Collection } = require('discord.js');
const fs = require('node:fs')
const { token } = require('../config.json')

/**
 * Main function for starting the Diskordle bot. Much of the code in this file is project setup, and taken from
 * the DiscordJS 'getting started' documentation
 * @author DiscordJS documentation, modified by Alex Carney
 */
function bootstrap() {
    // Create a new client instance. Must include necessary intents for bot to work
    const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

    // Login. Log to console if successful
    client.login(token)
    client.once("ready", () => {
        console.log(`Logged in as  ${client.user.tag}`)
    })

    // COMMAND SETUP

    // attach a commands property to the client to access in other files
    client.commands = new Collection();
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`)
        //Each key in the commands collection is the command name.
        //Each value in the commands collection is the exported command module
        client.commands.set(command.data.name, command);
    }

    // EVENT HANDLING SETUP

    // manually register each listener by reading files in 'events' directory
    const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }

    }

}

bootstrap();

console.log('Setup Complete')




