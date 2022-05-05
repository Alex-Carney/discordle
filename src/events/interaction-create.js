/**
 * Main handler for executing commands
 * @author DiscordJS documentation, modified by Alex Carney
 */
module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if(!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if(!command) return;

        try {
            await command.execute(interaction)
        } catch (e) {
            console.error(e)
            await interaction.reply({content: 'Error executing command', ephemeral: true})
        }
    }
}
