const Discord = require('discord.js');
const client = new Discord.Client();

const role = process.env.role;
const token = process.env.token;
const appID = process.env.appID;
const perms = process.env.perms;
const ytLink = process.env.ytLink;
const church = process.env.church;
const prefix = process.env.prefix;
const modRole = process.env.modRole;
const duration = process.env.duration;
const guildName = process.env.guildName;

const churchRegex = /c+h+[a|e|i|o|u]+r+c+h+l?e+[s|z]+/gi;
const invLink = `https://discord.com/oauth2/authorize?client_id=${appID}&scope=bot&permissions=${perms}`;
var ourGuild;
var cornerRole;
var disabled = false;

client.on('ready', () => {
    console.log(`${church} Logged in as ${client.user.tag}! Invite link: ${invLink}`);
    client.user.setPresence({ activity: { name: `with ${church}s` }, status: 'online' });
    try {
        // this assumes we're only connected to INVT
        ourGuild = client.guilds.cache.find(g => g.name === guildName);
        cornerRole = ourGuild.roles.cache.find(r => r.name === role);
    } catch(error) {
        console.error("unable to find guild or role");
    }
});

client.login(token);

client.on('message', message => {
	if (message.author.bot) return;
	if (message.content.startsWith(prefix)) handleCommands(message);
        if (churchRegex.test(message.content)) putInCorner(message.member);
});

function handleCommands(message) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'enable':
            if (isMod(message, message.author)) enable();
            break;
        case 'disable':
            if (isMod(message, message.author)) disable();
            break;
        case 'status':
            if (isMod(message, message.author)) status(message);
            break;
    }
}

function putInCorner(member) {
    try {
        member.roles.add(cornerRole);
        member.user.send(ytLink);
    } catch(error) {
        console.error(`Failed to add role: ${error}`)
    }
    console.log(`${member.user.username} is now in the corner for ${duration/1000} seconds!`);
    return setTimeout(setFree, duration, member);
}

function setFree(member) {
    try {
        member.roles.remove(cornerRole);
    } catch(error) {
        console.error(`failed to remove error: ${error}`);
    }
    console.log(`${member.user.username} was set free...`);
}

function isMod(message, user) {
    const member = message.guild.member(user);
    return member && member.roles.cache.some(role => role.name === modRole);
}

function disable() {
    if (disabled) return;
    disabled = true;
    client.user.setPresence({ activity: { name: 'with jellyfish' }, status: 'idle' });
    console.log("bot disabled");
}

function enable() {
    if (!disabled) return;
    disabled = false;
    client.user.setPresence({ activity: { name: `with ${church}s` }, status: 'online' });
    console.log("bot enabled");
}

function status(message) {
    message.channel.send(`Online - disabled? ${disabled}`);
}
