const axios = require('axios')

/**
 * The original Wordle keeps a hard-coded master list of acceptable input and solution words.
 * Diskordle offloads solution words to players themselves (choose a word for another player to guess) and input words
 * to api.dictionaryapi.dev for validation
 *
 * Funnily enough, some words that are classics in Wordle don't count as valid words by the API. (For example, 'Ouija'!)
 *
 * @author Alex Carney
 * @param word English word to validate
 * @returns {Promise<boolean>}
 */
module.exports = async function validateWord(word) {
    try {
        const payload = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        return true
    } catch(e) {
        return false

    }
}
