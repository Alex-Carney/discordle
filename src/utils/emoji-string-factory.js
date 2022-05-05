const { guildId } = require('../../config.json')
const GameConfig = require('../config/game-config')

/**
 * Default discord emojis can be directly referenced by name. Custom emojis (such as the green/red background letters)
 * can only be handled by the bot in a very specific form: <:emojiName:emojiID:>
 *
 * Therefore, the logic for converting custom emojis by name into their usable form is offloaded to this factory method
 *
 * @author Alex Carney
 * @param interaction
 * @param letter
 * @param color
 * @returns {string}
 */
module.exports = function EmojiStringFactory(interaction, letter, color) {
    // There are only 50 custom emoji slots in a discord server. I had to get a little bit creative (52 is too many)
    let emojiName = ""
    switch(color) {
        case GameConfig.letterColorContainedInWord:
            if(letter === 'a') return ':a:'
            if(letter === 'b') return ':b:'
            emojiName = `${letter}_red`
            break;
        case GameConfig.letterColorNotInWord:
            return `:regional_indicator_${letter}:`
        case GameConfig.letterColorKeyboardDontUse:
            return `:black_large_square:`
        case GameConfig.letterColorCorrectSpot:
            emojiName = `${letter}_green`
            break;
        default:
            console.log('Something went wrong in the emoji string factory switch statement')
    }
    const emojiObj = interaction.client.guilds.cache.get(guildId)
        .emojis.cache?.find(emoji => emoji.name === emojiName)
    return `<:${emojiName}:${emojiObj.id}>`
}


