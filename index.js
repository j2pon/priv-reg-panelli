const { Client, GatewayIntentBits, ActivityType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { token, Aktivite, AktiviteURL, prefix, kayitsiz, ucube, denetimlog, kayitli, rexstaff } = require('./config.json');
const ayarMenu = require('./commands/ayarmenu.js');
const { BanList, UcubeList } = require('./models'); // Sequelize modelleri
const { sequelize, BotState } = require('./models'); // Sequelize bağlantısı ve BotState modeli
require('./dashboard/app.js');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Sunucuya bağlanmadan önce bot açık mı kontrol et
async function checkBotStatus() {
    try {
        await sequelize.authenticate();
        console.log('MySQL bağlantısı başarılı.');
        const botState = await BotState.findOne({ where: { key: 'bot_active' } });
        if (!botState || botState.value !== 'true') {
            console.log('⚠️ Bot kapalı durumda! Web panelden aktif etmeniz gerekiyor.');
            return false;
        }
        return true;
    } catch (error) {
        console.error('MySQL bağlantısı hatası:', error);
        return false;
    }
}

client.once('ready', () => {
    console.log(`${client.user.tag} olarak giriş yapıldı!`);

    client.user.setPresence({
        activities: [{
            name: Aktivite,
            type: ActivityType.Streaming,
            url: AktiviteURL
        }],
        status: 'dnd',
    });
});

client.commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Komutlar
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (!command) return;
    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Komut çalıştırılırken bir hata oluştu.');
    }
});

// Kayıtsız ve ucube rol atamaları
client.on('guildMemberAdd', async (member) => {
    const unregRole = member.guild.roles.cache.get(kayitsiz);
    if (unregRole) {
        await member.roles.add(unregRole).catch(console.error);
    }

    const isUcube = await UcubeList.findOne({ where: { userId: member.user.id } });
    if (isUcube) {
        const ucubeRole = member.guild.roles.cache.get(ucube);
        if (ucubeRole) {
            await member.roles.add(ucubeRole).catch(console.error);
        }
    }
});

// Denetim kaydı
client.on('guildAuditLogEntryCreate', async (auditLog) => {
    const logChannel = client.channels.cache.get(denetimlog);
    if (!logChannel) return;

    const { action, executor, target, createdAt, reason } = auditLog;
    const logEmbed = new EmbedBuilder()
        .setColor(0xffa500)
        .setTitle('Denetim Kaydı Olayı')
        .addFields(
            { name: 'Eylem', value: action || 'Bilinmiyor', inline: true },
            { name: 'Yapan', value: executor?.tag || 'Bilinmiyor', inline: true },
            { name: 'Hedef', value: target?.tag || 'Bilinmiyor', inline: true },
            { name: 'Sebep', value: reason || 'Belirtilmemiş', inline: true }
        )
        .setTimestamp(createdAt)
        .setFooter({ text: `${executor.username} tarafından gerçekleştirildi.` });

    logChannel.send({ embeds: [logEmbed] });
});

// Ban koruma
client.on('guildBanRemove', async (ban) => {
    const isBanned = await BanList.findOne({ where: { userId: ban.user.id } });
    if (isBanned) {
        await ban.guild.members.ban(ban.user.id, { reason: 'Yasaklı listesinde.' }).catch(console.error);
    }
});

// Kayıt mesajı gönderme
client.on('messageCreate', async message => {
    if (!message.member.permissions.has(rexstaff)) return;
    if (message.content === '-kayitx') {
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Kayıt Ol')
            .setImage('https://sadecerex.com/hello.gif')
            .setThumbnail('https://sadecerex.com/keloglus.jpeg')
            .setDescription('Kayıt Ol Butonuna Tıklayarak Sunucuya Kayıt Olabilirsiniz.');

        const buton = new ButtonBuilder()
            .setCustomId('kayit_ol_buton')
            .setLabel('Kayıt Ol')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(buton);

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});

// Kayıt butonu işlemi
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'kayit_ol_buton') {
        const roleId = kayitli;
        const member = interaction.member;
        const kayitsizRole = kayitsiz;
        const rol = interaction.guild.roles.cache.get(roleId);

        if (member.roles.cache.size === 2) {
            await member.roles.add(rol);
            await member.roles.remove(kayitsizRole);
            await interaction.reply({ content: 'Kayıt Edildin!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Zaten bir rolün var!', ephemeral: true });
        }
    }
});

// Bot başlat
(async () => {
    const status = await checkBotStatus();
    if (status) {
        client.login(token);
    }
})();
