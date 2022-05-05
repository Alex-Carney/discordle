const LobbyRegistry = require('../common/lobby-registry')
const DiskordleGame = require("../common/diskordle-game");
const GameRegistry = require('../common/game-registry')
const wait = require('node:timers/promises').setTimeout

/**
 * Handler for pressing buttons attached to interactions.
 * The buttons defined in this project include 'join game', 'start game', 'end game',
 * which are handled by this module
 *
 * @author Alex Carney
 * @type {{execute(*=): Promise<void>}}
 */
module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if(!interaction.isButton()) {
            return
        }
        // Interaction refers to pressing the button. interaction.message.interaction is the parent
        const parentInteraction = interaction.message.interaction
        // Unfortunately, there wasn't an easy way to append data to interactions, only to overwrite them entirely
        // Therefore, the syntax for adding a new player one by one is a bit complicated
        const baseContent = interaction.message.content.split('\n')[0]
        const players = LobbyRegistry.get(parentInteraction.id)

        switch (interaction.customId) {
            case 'join':
                players.add(interaction.user.username)
                // Must update entire interaction at once, didn't find a way to append
                interaction.update({content: baseContent + `\nPlayers: ${" " + [...players].map(p => p.toString())}`})
                break
            case 'start':
                if(interaction.user.username !== parentInteraction.user.username) {
                    await interaction.update({content: interaction.message.content})
                    await interaction.followUp({content: 'Only the host can start this game', ephemeral: true})
                } else {
                    await new DiskordleGame(interaction, parentInteraction).setupGame()
                }
                break
            case 'end':
                const gameToEnd = GameRegistry.get(parentInteraction.id)
                const gameOverMessages = await gameToEnd.endGame()
                await interaction.reply({content: "GAME RESULTS \n"})
                for(const message of gameOverMessages) {
                    await interaction.followUp({content: message})
                    await wait(250) //avoid rate limiting
                }
        }
    }
}
