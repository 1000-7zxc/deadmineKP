require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    
    // Укажи ID канала куда отправить кнопку
    const channelId = process.env.TICKET_CHANNEL_ID || 'УКАЖИ_ID_КАНАЛА_ЗДЕСЬ';
    
    const channel = client.channels.cache.get(channelId);
    
    if (!channel) {
        console.error('❌ Канал не найден! Проверь TICKET_CHANNEL_ID');
        process.exit(1);
    }
    
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎫 Система тикетов')
        .setDescription(
            '**Добро пожаловать в систему тикетов!**\n\n' +
            'Нажмите на кнопку ниже, чтобы создать тикет.'
        )
        .setFooter({ text: 'DeadMine Support System' })
        .setTimestamp();
    
    const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('create_ticket')
                .setLabel('📩 Создать тикет')
                .setStyle(ButtonStyle.Primary)
        );
    
    await channel.send({
        embeds: [embed],
        components: [button]
    });
    
    console.log('✅ Сообщение с кнопкой отправлено!');
    process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);
