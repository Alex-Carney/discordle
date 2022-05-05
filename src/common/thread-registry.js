const {Collection} = require("discord.js");
/**
 * Singleton registry for mapping a Thread ID to the necessary information about the game
 * being interacted with in that thread.
 *
 * @keys The numerical ID of the thread
 * @values A custom object of type: {game: DiskordleGame, gameBoard: GameBoard}
 */
module.exports = new Collection()
