const fs = require('fs');
const dirname = global.dirname;

const istream = (str) => {
	return str.replace(/\s+/g, ' ').trim().split(' ');
}

const consume = (arr) => {
	while (arr.length > 0 && arr[0].length === 0) arr.shift();
	if (arr.length > 0) return arr.shift();
	else return null;
}

const timestampToDate = (timestamp, mode, penalty) => {
	let date = new Date(timestamp + penalty);
	let year = date.getFullYear();
	let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	let fullMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let monthIdx = date.getMonth();
	let day = ('0' + date.getDate()).slice(-2);
	let hours = ('0' + date.getHours()).slice(-2);
	let minutes = ('0' + date.getMinutes()).slice(-2);
	let seconds = ('0' + date.getSeconds()).slice(-2);
	if (mode == 'short')
		return `${year}-${month[monthIdx]}-${day}_${hours}-${minutes}-${seconds}`;
	else
		return `${year} ${fullMonth[monthIdx]} ${day} - ${hours}:${minutes}:${seconds}`;
}

const args_logging = (args, quote) => {
	const lang = require('./configAPI.js').loadLanguage();
	let res = ' ';
	if (args) args.forEach((e, i, a) => {
		res += (quote ? `\`${e}\`` : `${e}`);
		if (i === a.length - 1)
			res += ' ';
		else if (i === a.length - 2)
			res += ` ${lang.and} `
		else res += ', '
	});
	return res;
}

const serverTimezone = () => {
	let now = new Date();
	let timezoneOffset = (now.getTimezoneOffset()) / -60;
	return timezoneOffset;
}

const numberFormat = (num) => {
	if (num >= 0) return `+${num}`;
	else return `${num}`;
}

const clockBasedRandom = (l, h) => {
	let x = Math.floor(Math.random() * Math.random() * Date.now());
	return l + x % (h - l + 1);
}

const deliverMsg = (MsgContent, status, channelID) => {
	const defaultLang = require('./configAPI.js').loadDefaultLanguage();

	// This is the configuration file (server.json), NOT the Discord.server object
	const server = require('./serverAPI.js').loadRawData();

	// The variable 'guild' is referenced from Discord.server
	const guild = client.guilds.get(server.host);

	let channel = guild.channels.get(channelID);
	if (!channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
	channel.send({
		embed: {
			description: MsgContent,
			color: parseInt(defaultLang.status[status], 16)
		}
	});
}

const prefixChecker = (arr, str) => {
	const tmpStr = str.toLowerCase();
	for (subArr of arr)
		if (tmpStr.startsWith(subArr.toLowerCase()))
			return true;
	return false;
}

const objectToID = (obj) => {
	if (obj.endsWith(">")) {
		if (obj.startsWith("<@&")) return obj.substring(3, obj.length - 1);
		else if (obj.startsWith("<@")) return obj.substring(2, obj.length - 1);
		else if (obj.startsWith("<#")) return obj.substring(2, obj.length - 1);
		else return obj;
	}
	else return obj;
}

const log = (content, filename) => {
	const path = dirname + '/logs/' + filename + '.log'
	fs.appendFile(path, content + '\n', (err) => {
		if (err) throw err;
	});
}

const isNum = (n) => {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports.istream = istream;
module.exports.consume = consume;
module.exports.timestampToDate = timestampToDate;
module.exports.args_logging = args_logging;
module.exports.serverTimezone = serverTimezone;
module.exports.numberFormat = numberFormat;
module.exports.clockBasedRandom = clockBasedRandom;
module.exports.deliverMsg = deliverMsg;
module.exports.prefixChecker = prefixChecker;
module.exports.objectToID = objectToID;
module.exports.log = log;
module.exports.isNum = isNum;