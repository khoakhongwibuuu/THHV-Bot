/**
 * Generates a random integer between the specified range.
 * @param {number} l - The lower bound (inclusive).
 * @param {number} h - The upper bound (inclusive).
 * @returns {number} A random integer between l and h.
 */
const trueRnd = (l, h) => {
	return l + Math.floor(Math.random() * (h - l + 1));
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {void} The array is shuffled in place.
 */
const shuffle = (array) => {
	for (let idx = 0; idx < (array.length) * (array.length); idx++) {
		let i = trueRnd(0, array.length - 1);
		let j = trueRnd(0, array.length - 1);
		[array[i], array[j]] = [array[j], array[i]];
	}
}

/**
 * Checks if a random event occurs based on the given offset.
 * @param {number} offset - The offset value.
 * @returns {boolean} True if the event occurs, false otherwise.
 */
const randomEvent = (offset) => {
	return trueRnd(1, offset) === trueRnd(1, offset);
}

/**
 * Generates a random percentage based on the given offset.
 * @param {number} offset - The offset percentage.
 * @returns {boolean} True if the random percentage is less than the offset, false otherwise.
 */
const randomPercent = (offset) => {
	// offset% cases returns true
	return Math.random() * 100 < offset;
}

/**
 * Formats a string with the given format and arguments.
 * @param {string} format - The format string containing placeholders.
 * @param {...*} args - The arguments to replace the placeholders in the format string.
 * @returns {string} The formatted string with placeholders replaced by the provided arguments.
 */
const formatString = (format, ...args) => {
	let i = 0;
	return format.replace(/%([-+]?[0-9]*\.?[0-9]*[sdifoxXeEc])/g, match => {
		if (i >= args.length) return match;
		let value = args[i++];

		switch (match[match.length - 1]) {
			case 's': return String(value);
			case 'd':
			case 'i': return parseInt(value, 10);
			case 'f': return parseFloat(value).toFixed(match.includes('.') ? match.split('.')[1].length : 6);
			case 'o': return '0' + parseInt(value, 10).toString(8);
			case 'x': return parseInt(value, 10).toString(16);
			case 'X': return parseInt(value, 10).toString(16).toUpperCase();
			case 'e': return parseFloat(value).toExponential();
			case 'E': return parseFloat(value).toExponential().toUpperCase();
			case 'c': return String.fromCharCode(value);
			default: return match;
		}
	});
}

module.exports = {
	trueRnd,
	shuffle,
	randomEvent,
	randomPercent,
	formatString
}

String.prototype.URLdecode = function () {
	return decodeURIComponent(this);
}

String.prototype.hasWhiteSpace = function () {
	return (/\s/.test(this));
}

String.prototype.englishOnly = function () {
	return (/^[a-zA-Z]+$/.test(this));
}

String.prototype.lastDigit = function () {
	return this[this.length - 1];
}

String.prototype.firstDigit = function () {
	return this[0];
}

String.prototype.keyReverse = function () {
	let newString = "";
	for (let i = this.length - 1; i >= 0; i--)
		newString += this[i];
	return newString;
}

String.prototype.sanitise = function () {
	return this.replace(/[`"']/g, "");
}

String.prototype.tokenise = function () {
	return this.split(/[\s,]+/).filter(Boolean);
}

String.prototype.tokeniseV2 = function () {
	return this.split(/[,]+/).filter(Boolean);
}

String.prototype.hidden = function () {
	return `||${this}||`;
}

String.prototype.codeChunk = function () {
	return `\`\`\`\n${this}\n\`\`\``;
}

Array.prototype.listing = function (prefix, suffix, delimiter) {
	let res = "";
	this.forEach((e, i, a) => {
		res += `${prefix}${e}${suffix}`;
		if (i < a.length - 1)
			res += delimiter;
	});
	return res;
}

Array.prototype.noSpaceListing = function (prefix, suffix, delimiter) {
	let res = "";
	this.forEach((e, i, a) => {
		res += `${prefix}${e.trim()}${suffix}`;
		if (i < a.length - 1)
			res += delimiter;
	});
	return res;
}

Array.prototype.linkListing = function (baseURL, delimiter) {
	let res = "";
	this.forEach((e, i, a) => {
		res += `[${e}](${baseURL}${e})`;
		if (i < a.length - 1)
			res += delimiter;
	});
	return res;
}

Array.prototype.lastValue = function () {
	return this[this.length - 1];
}

Array.prototype.firstValue = function () {
	return this[0];
}

Array.prototype.randomValue = function () {
	return this[trueRnd(0, this.length - 1)];
}
