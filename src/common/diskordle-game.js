const LobbyRegistry = require('../common/lobby-registry')
const GameRegistry = require('../common/game-registry')
const ThreadRegistry = require('../common/thread-registry')
const {Collection, MessageActionRow, MessageButton} = require("discord.js");
const wait = require('node:timers/promises').setTimeout
const shuffle = require('../utils/permutation-utils')

/**
 * Class representing an active Diskordle game.
 * @author Alex Carney
 */
module.exports = class DiskordleGame {
    /**
     * @param buttonInteractionInstance The interaction referring to pressing the "start game" button
     * @param lobbyInteractionInstance The interaction referring to the lobby associated with the 'start game' button
     */
    constructor(buttonInteractionInstance, lobbyInteractionInstance) {
        // Necessary data from the interactions from the lobby that started this game.
        this.lobbyInteraction = lobbyInteractionInstance
        this.client = buttonInteractionInstance.client
        this.buttonInteraction = buttonInteractionInstance
        this.players = [...LobbyRegistry.get(lobbyInteractionInstance.id)]
        this.channel = this.client.channels.cache.get(this.buttonInteraction.channelId)
        // New data necessary for game to function
        this.activeThreads = new Collection()
        this.targetWords = new Map()
        this.finalBoardState = new Map()
    }

    /**
     * Void method that performs necessary game setup
     */
    async setupGame() {

        // Replace the lobby with a proper message
        await this._generateInProgressMessage()
        // Create a private thread for each player. This is where they will interact with the game
        for (const player of this.players) {
            await this._registerPlayerThread(player)
            await wait(250) //avoid rate limiting
        }
        // As a part of ensuring all players get a unique word. See getStartingPlayerWord for more detail
        shuffle(this.players)


        LobbyRegistry.delete(this.lobbyInteraction.id)
        GameRegistry.set(this.lobbyInteraction.id, this)
    }

    async _registerPlayerThread(player) {
        const thread = await this.channel.threads.create({
            name: player.toString() + " private thread",
            autoArchiveDuration: 60,
            reason: 'This is where you enter your words'
        });
        thread.send(`Welcome ${player.toString()}, this is where you'll use /w to interact with the game. Use /k to bring up the letters you should use`)

        ThreadRegistry.set(thread.id, {game: this, gameBoard: undefined})
        this.activeThreads.set(thread, player.toString())
    }

    /**
     * Forces caller to wait until all players have submitted their target words.
     *
     * @param playerName
     * @param inputWord
     * @returns {Promise<void>}
     */
    async registerStartingWord(playerName, inputWord) {
        this.targetWords.set(playerName, inputWord)
        while(this.targetWords.size < this.players.length) {
            await wait(2000)
        }
    }

    /**
     * Inspired by this Numberphile video I watched recently about the problems of choosing for
     * secret santa https://www.youtube.com/watch?v=5kC5k5QBqcc&ab_channel=Numberphile
     *
     * We want to make sure no player gets their own target word, which is the same problem!
     *
     * @param playerName
     * @returns startingWord
     */
    async getPlayerTargetWord(playerName) {
        const playerIdx = this.players.findIndex((player => player === playerName))
        // Necessary to ensure a 'derangement', a permutation where no element maps to itself again.
        const secretPlayer = this.players[(playerIdx + 1) % this.players.length]
        return this.targetWords.get(secretPlayer).toLowerCase()
    }

    async _generateInProgressMessage() {
        const inProgressGame = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('end')
                    .setLabel('End Game')
                    .setStyle("DANGER")
            );
        const gameScreen = this.players.reduce((message, player) => {
            return `${message} \n ${player}`
        });
        await this.buttonInteraction.update({content: gameScreen, components: [inProgressGame] })
    }

    /**
     * Performs all the cleanup required for the game to end.
     * Deletes all player-threads, removes all trace of this game from global data.
     * Returns each player's wordle grid to be displayed in the final leaderboard (unless the game was ended early)
     *
     * @returns {Promise<Array<string>>}
     */
    async endGame() {
        GameRegistry.delete(this.buttonInteraction.id)
        this.activeThreads.forEach((value, key) => {
            ThreadRegistry.delete(key.id)
            const thread = this.channel.threads.cache.find((thread) => thread.id === key.id)
            thread.delete()
        });
        const finalLeaderboard = []
        this.finalBoardState.forEach((value, key) => {
            finalLeaderboard.push(`${key}'s final result: \n${value} \n`)
        });
        return finalLeaderboard
    }
}
