const Discord = require('discord.js');
const client = new Discord.Client();

const { TOKEN } = require('./auth.json');
const { appID, perms, ytLink, church, prefix, role, modRole } = require('./config.json');
const churchRegex = /c+h+[uv]+r+c+h+e+s+/gi;
const invLink = `https://discord.com/oauth2/authorize?client_id=${appID}&scope=bot&permissions=${perms}`;
var disabled = false;

client.on('ready', () => {
    console.log(`${church} Logged in as ${client.user.tag}! Invite link: ${invLink}`);
    client.user.setPresence({ activity: { name: `with ${church}s` }, status: 'online' });
});

client.login(TOKEN);

client.on('message', message => {
	if (message.author.bot || disabled) return;
	if (message.content.startsWith(prefix)) handleCommands(message);
        if (churchRegex.test(message.content)) message.react(church);
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
            case 'help':
                if (isMod(message, message.author)) sendHelp();
                break;
        }
}

function corner(user) {
    // TODO
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

function sendHelp(message) {
    message.channel.send(`TO THE CORNER.`);
}
