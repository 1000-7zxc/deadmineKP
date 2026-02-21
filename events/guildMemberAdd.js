const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        try {
            // Track who invited this member
            const cachedInvites = client.invites.get(member.guild.id);
            const newInvites = await member.guild.invites.fetch();
            
            const usedInvite = newInvites.find(inv => {
                const cached = cachedInvites?.get(inv.code);
                return cached && inv.uses > cached.uses;
            });
            
            if (usedInvite && usedInvite.inviter) {
                const inviterId = usedInvite.inviter.id;
                const guildTracking = client.inviteTracking.get(member.guild.id) || new Map();
                const currentCount = guildTracking.get(inviterId) || 0;
                guildTracking.set(inviterId, currentCount + 1);
                client.inviteTracking.set(member.guild.id, guildTracking);
                
                console.log(`📊 ${usedInvite.inviter.tag} invited ${member.user.tag} (total: ${currentCount + 1})`);
            }
            
            // Update cached invites
            client.invites.set(member.guild.id, new Map(newInvites.map(inv => [inv.code, inv])));
            
            // Auto-assign role
            const autoRoleId = process.env.AUTO_ROLE_ID;
            if (autoRoleId) {
                const role = member.guild.roles.cache.get(autoRoleId);
                if (role) {
                    await member.roles.add(role);
                    console.log(`✅ Auto-assigned role ${role.name} to ${member.user.tag}`);
                }
            }
        } catch (error) {
            console.error('Error in guildMemberAdd:', error);
        }
    }
};
