const { MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders')
const GameConfig = require('../config/game-config')
const LobbyRegistry = require('../common/lobby-registry')

/**
 * The command handler for the /newgame command.
 * Starts a new game lobby
 *
 * @author Alex Carney
 * @type {{data: SlashCommandBuilder, execute(*): Promise<void>}}
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('newgame')
        .setDescription('Starts a new Diskordle Lobby'),
    async execute(interaction) {

        const startGame = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('start')
                    .setLabel('Start Game')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('join')
                    .setLabel('Join Game')
                    .setStyle('PRIMARY')
            );

        // Add to global registry of all open lobbies
        LobbyRegistry.set(interaction.id, new Set())

        await interaction.reply({ content: GameConfig.welcomeMessage, components: [startGame]});
    }
}
