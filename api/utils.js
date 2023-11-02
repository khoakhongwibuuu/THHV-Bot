const fs = require('fs');
// Basic
const Config = global.Config;
const Lang = global.Lang;
const Base_Lang = global.Base_Lang;
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
	let full_month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let month_index = date.getMonth();
	let day = ('0' + date.getDate()).slice(-2);
	let hours = ('0' + date.getHours()).slice(-2);
	let minutes = ('0' + date.getMinutes()).slice(-2);
	let seconds = ('0' + date.getSeconds()).slice(-2);
	if (mode == 'short')
		return `${year}-${month[month_index]}-${day}_${hours}-${minutes}-${seconds}`;
	else
		return `${year} ${full_month[month_index]} ${day} - ${hours}:${minutes}:${seconds}`;
}

const format = (core, prefix, suffix) => {
	return `<${prefix}${core}${suffix}>`;
}

const args_logging = (args, quote) => {
	let r = ' ';
	if (args) args.forEach((e, i, a) => {
		r += (quote ? `\`${e}\`` : `${e}`);
		if (i === a.length - 1)
			r += ' ';
		else if (i === a.length - 2)
			r += ` ${Lang.and} `
		else r += ', '
	});
	return r;
}

const server_timezone = () => {
	let now = new Date();
	let timezoneOffset = (now.getTimezoneOffset()) / -60;
	return timezoneOffset;
}

const number_format = (num) => {
	if (num >= 0) return `+${num}`;
	else return `${num}`;
}

const clockBasedRandom = (l, h) => {
	let x = Math.floor(Math.random() * Math.random() * Date.now());
	return l + x % (h - l + 1);
}

const deliverMsg = (MsgContent, status, channelID) => {
	client.guilds.array().forEach(guild => {
		let channel = guild.channels.get(channelID);
		if (!channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
		channel.send({
			embed: {
				description: MsgContent,
				color: parseInt(Base_Lang.status[status], 16)
			}
		});
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
module.exports.format = format;
module.exports.args_logging = args_logging;
module.exports.server_timezone = server_timezone;
module.exports.number_format = number_format;
module.exports.clockBasedRandom = clockBasedRandom;
module.exports.deliverMsg = deliverMsg;
module.exports.prefixChecker = prefixChecker;
module.exports.objectToID = objectToID;
module.exports.log = log;
module.exports.isNum = isNum;