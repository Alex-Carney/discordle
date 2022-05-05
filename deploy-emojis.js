const fs = require('node:fs')
const { Client, Intents } = require('discord.js');
const { token, guildId } = require('./config.json')
const wait = require('node:timers/promises').setTimeout

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.login(token)
client.once("ready", () => {
    console.log(`Logged in as  ${client.user.tag} with the sole purpose to deploy emojis`)


    const filePath = 'assets/svgtopng'
    const emojiFiles = fs.readdirSync(filePath)
        .filter(file => file.endsWith('.png'))

    for(const file of emojiFiles) {
        console.log(file.split('.')[0])
        client.guilds.cache.get(guildId).emojis.create(`assets/svgtopng/${file}`, file.split('.')[0])
            .then(emoji => console.log(`Created new emoji with name ${emoji.name}`))
            .catch(console.error)
    }

})





