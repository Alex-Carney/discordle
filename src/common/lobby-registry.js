const {Collection} = require("discord.js");
/**
 * Singleton registry for mapping an interaction representing a Lobby to a set of unique players.
 * Once an interaction is created and handled, there is no way to access it later without saving
 * it.
 * @keys The numerical ID of the interaction that represents the actual lobby message in discord
 * @values Set object containing players handled by lobby
 */
module.exports = new Collection()
