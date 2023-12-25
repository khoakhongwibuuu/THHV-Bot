const fs = require('node:fs');
const dirname = global.dirname;

Date.prototype.getFullMonth = function () {
	const obj = this.getMonth()
	if (obj == 0) { return "January" };
	if (obj == 1) { return "February" };
	if (obj == 2) { return "March" };
	if (obj == 3) { return "April" };
	if (obj == 4) { return "May" };
	if (obj == 5) { return "June" };
	if (obj == 6) { return "July" };
	if (obj == 7) { return "August" };
	if (obj == 8) { return "September" };
	if (obj == 9) { return "October" };
	if (obj == 10) { return "November" };
	if (obj == 11) { return "December" };
}

Date.prototype.getDayOfWeek = function () {
	const obj = this.getDay();
	if (obj == 0) { return "Sunday" };
	if (obj == 1) { return "Monday" };
	if (obj == 2) { return "Tuesday" };
	if (obj == 3) { return "Wednesday" };
	if (obj == 4) { return "Thursday" };
	if (obj == 5) { return "Friday" };
	if (obj == 6) { return "Saturday" };
}

Array.prototype.argList = function (mode) {
	let res = "";
	this.forEach((e, i, a) => {
		if (mode === "mention")
			res += `<@${e}>`;
		else if (mode === "quote")
			res += `\`${e}\``;
		else res += e;
		if (i < a.length - 1)
			res += ', '
	});
	return res;
}

Array.prototype.lastValue = function () {
	return this[this.length - 1];
}

Object.prototype.isNumber = function () {
	return typeof this === 'number';
}

Number.prototype.numFormat = function () {
	return (this > 0) ? "+" + JSON.stringify(this) : JSON.stringify(this);
}

String.prototype.prefixChecker = function (arr) {
	const tempString = this.toLowerCase();
	for (i of arr)
		if (tempString.startsWith(i.toLowerCase()))
			return true;
	return false;
}

String.prototype.logToFile = function (filename) {
	const content = this;
	fs.appendFile(dirname + '/logs/' + global.BotStartTime.replace(/:/g, "") + '.log', content + '\n', (err) => {
		if (err) throw err;
	});
}

String.prototype.logToChannel = function () {
	const serverLib = require('./server.js');
	const guild = global.client.guilds.cache.get(serverLib.load().guildID);
	if (serverLib.load().log !== "") {
		const channel = guild.channels.cache.get(serverLib.load().log);
		channel.send(`\`${this}\``);
	}
}

String.prototype.URLdecode = function () {
	return decodeURIComponent(this);
}

String.prototype.logE = function () {
	const content = JSON.stringify(this)
	content.substring(1, content.length - 1).logToChannel();
	content.substring(1, content.length - 1).logToFile();
	console.log(content.substring(1, content.length - 1))
}

const serverTimezone = () => {
	let now = new Date();
	let timezoneOffset = (now.getTimezoneOffset()) / -60;
	return timezoneOffset;
}

const clockBasedRandom = (l, h) => {
	let x = Math.floor(Math.random() * Math.random() * Date.now());
	return l + x % (h - l + 1);
}

const shuffle = (array) => {
	for (let x = 0; x < (array.length) * (array.length); x++) {
		let i = clockBasedRandom(0, array.length - 1);
		let j = clockBasedRandom(0, array.length - 1);
		[array[i], array[j]] = [array[j], array[i]];
	}
}

module.exports.serverTimezone = serverTimezone;
module.exports.clockBasedRandom = clockBasedRandom;
module.exports.shuffle = shuffle;