const { SlashCommandBuilder } = require('@discordjs/builders')
const ThreadRegistry = require('../common/thread-registry')
const GameConfig = require('../config/game-config')
const EmojiStringFactory = require('../utils/emoji-string-factory')



const keyboard = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '\n', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '\n', 'z', 'x', 'c', 'v', 'b', 'n', 'm']
/**
 * Command handler for /k command
 * Displays a keyboard that makes it easier to see what valid letters you can choose,
 * like in original wordle
 * @author Alex Carney
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('k')
        .setDescription('Display the Wordle keyboard'),

    async execute(interaction) {
        // Ensure command fired from valid thread
        const threadId = interaction.channelId
        if(!ThreadRegistry.has(threadId)) {
            interaction.reply({content: GameConfig.wordCommandInvalidThread})
            return
        }
        const activeGame = ThreadRegistry.get(threadId)
        // Render keyboard
        let keyboardOutput = ""
        keyboard.forEach((letter) => {
            if (letter !== '\n') {
                const color = activeGame.gameBoard.letterColors.get(letter)
                keyboardOutput += EmojiStringFactory(interaction, letter, color)
            } else {
                keyboardOutput += letter
            }
        })
        interaction.reply({content: "Keyboard\n" + keyboardOutput})
    }
}
