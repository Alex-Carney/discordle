const { SlashCommandBuilder } = require('@discordjs/builders')
const validateWord = require('../utils/validate-word')
const ThreadRegistry = require('../common/thread-registry')
const GameBoard = require('../common/game-board')
const GameConfig = require('../config/game-config')


/**
 * Command handler for /w command.
 * /w is responsible for interacting with an active Diskordle game thread.
 * Importantly, the use of /w changes as the game progresses.
 *
 * Requires a word passed in as an argument
 * @type {{execute(*=): Promise<void>}}
 * @author Alex Carney
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('w')
        .setDescription('Interact with a Diskordle game')
        .addStringOption(option =>
        option.setName('input')
            .setDescription('The word to submit')
            .setRequired(true)),
    async execute(interaction) {
        // Ensure command fired from valid thread
        const threadId = interaction.channelId
        if(!ThreadRegistry.has(threadId)) {
            interaction.reply({content: GameConfig.wordCommandInvalidThread})
            return
        }

        const inputWord = interaction.options.getString('input')
        // short circuit AND to reduce API calls
        if (inputWord.length === 5 && await validateWord(inputWord)) {
            const activeGame = ThreadRegistry.get(threadId)
            const playerName = interaction.user.username
            // If the game hasn't started yet, gameBoardInteraction will be undefined.
            // THIS interaction will become that game board interaction
            if (!activeGame.gameBoard) {
                // Increases the TTL of the interaction to 15 minutes, from 3 seconds
                await interaction.reply({content: GameConfig.wordCommandWaitForPlayers})

                // The current interaction is deferred until ALL players have registered their starting word
                await activeGame.game.registerStartingWord(playerName, inputWord)

                // At this point, all players have registered their target word.
                // Get this player's unique target word, instantiate the game board accordingly
                const startingWord = await activeGame.game.getPlayerTargetWord(playerName)
                activeGame.gameBoard = new GameBoard(interaction, startingWord)

                await interaction.followUp({content: activeGame.gameBoard.renderBoard()})

            } else {
                if (activeGame.gameBoard.playingState === GameBoard.playingStates.IN_PLAY) {
                    // The game board has been initialized, so now /w commands are guesses
                    const gameBoardResponse = activeGame.gameBoard.guessWord(inputWord)
                    await interaction.reply({content: gameBoardResponse})
                    // Handle winning or losing
                    if (activeGame.gameBoard.playingState === GameBoard.playingStates.WON) {
                        // The game was either won or lost. Update accordingly
                        await interaction.followUp({content: GameConfig.gameOverWinMessage})
                        activeGame.game.finalBoardState.set(playerName, gameBoardResponse)
                    }
                    if (activeGame.gameBoard.playingState === GameBoard.playingStates.LOST) {
                        const correctWord = activeGame.gameBoard.targetWord
                        await interaction.followUp({content: GameConfig.gameOverLoseMessage + `Your word was ${correctWord}`})
                        activeGame.game.finalBoardState.set(playerName, gameBoardResponse)
                    }
                } else {
                    await interaction.reply({content: GameConfig.wordCommandInvalidGame})
                }
            }
        } else {
            interaction.reply({content: `${inputWord}` + GameConfig.wordCommandInvalidWord})
        }

    }
}
