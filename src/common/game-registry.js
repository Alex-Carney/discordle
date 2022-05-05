const {Collection} = require("discord.js");
/**
 * Singleton registry for mapping an interaction representing a DiskordleGame message to the
 * DiskordleGame object containing its information. When the host clicks 'new game' on a lobby,
 * that lobby is transformed into a game message
 *
 * I could probably do away with this global data, it is not as necessary as the other registries
 * @keys The numerical ID of the interaction that used to be a lobby message, and is now a game message
 * @values The DiskordleGame object containing information about the game
 */
module.exports = new Collection()
