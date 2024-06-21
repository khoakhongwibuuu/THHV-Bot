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

String.prototype.logToFile = function () {
	const content = JSON.stringify(this);
	console.log(content.substring(1, content.length - 1));
	fs.appendFile(dirname + '/logs/' + global.BotStartTime.replace(/:/g, "") + '.log', content.substring(1, content.length - 1) + '\n', (err) => {
		if (err) throw err;
	});
}

String.prototype.URLdecode = function () {
	return decodeURIComponent(this);
}

String.prototype.logE = function () {
	const content = JSON.stringify(this)
	content.substring(1, content.length - 1).logToFile();
}
