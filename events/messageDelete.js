const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'messageDelete',
    async execute(message, client) {
        // Skip bot messages
        if (message.author?.bot) return;
        
        const channel = client.channels.cache.get(config.chatLogChannel);
        if (!channel) {
            console.error('Chat log channel not found!');
            return;
        }

        try {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('🗑️ Сообщение удалено')
                .setTimestamp();

            // Add author info if available
            if (message.author) {
                embed.addFields(
                    { name: 'Автор', value: `${message.author.tag} (${message.author.id})`, inline: true }
                );
                embed.setThumbnail(message.author.displayAvatarURL());
            } else {
                embed.addFields(
                    { name: 'Автор', value: 'Неизвестно (сообщение не в кеше)', inline: true }
                );
            }

            // Add channel info
            embed.addFields(
                { name: 'Канал', value: `<#${message.channelId}>`, inline: true }
            );

            // Add content if available
            if (message.content) {
                const content = message.content.length > 1024 
                    ? message.content.substring(0, 1021) + '...' 
                    : message.content;
                embed.addFields({ name: 'Содержание', value: content });
            } else {
                embed.addFields({ name: 'Содержание', value: '*Нет текста или сообщение не в кеше*' });
            }

            // Add attachments info
            if (message.attachments && message.attachments.size > 0) {
                const attachmentList = message.attachments.map(att => att.name || att.url).join('\n');
                embed.addFields({ name: 'Вложения', value: attachmentList });
            }

            await channel.send({ embeds: [embed] });
            console.log(`✅ Logged message deletion in channel ${message.channelId}`);
        } catch (error) {
            console.error('Error logging message deletion:', error);
        }
    }
};
