const fs = require('node:fs');
const path = require('node:path');
const aes256 = require('aes256');

const trueRnd = (l, h) => {
	return l + Math.floor(Math.random() * (h - l + 1));
}

const shuffle = (array) => {
	for (let idx = 0; idx < (array.length) * (array.length); idx++) {
		let i = trueRnd(0, array.length - 1);
		let j = trueRnd(0, array.length - 1);
		[array[i], array[j]] = [array[j], array[i]];
	}
}

const randomEvent = (offset) => {
	// 1 in offset cases returns true
	return trueRnd(1, offset) === trueRnd(1, offset);
}

const randomPercent = (offset) => {
	// offset% cases returns true
	return Math.random() * 100 < offset;
}

const simple_encrypt = (DATA, ENCRYPTION_KEY) => {
	const cipher = aes256.createCipher(ENCRYPTION_KEY);
	const data = cipher.encrypt(DATA);
	return data;
}

const simple_decrypt = (DATA, DECRYPTION_KEY) => {
	const cipher = aes256.createCipher(DECRYPTION_KEY);
	const data = cipher.decrypt(DATA);
	return data;
}

module.exports = {
	trueRnd,
	shuffle,
	randomEvent,
	randomPercent,
	simple_encrypt,
	simple_encrypt
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

Array.prototype.argList = function (mode) {
	let res = "";
	this.forEach((e, i, a) => {
		if (mode === "mention")
			res += `<@${e}>`;
		else if (mode === "role-mention")
			res += `<@&${e}>`;
		else if (mode === "shaded")
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

Array.prototype.firstValue = function () {
	return this[0];
}

Array.prototype.randomValue = function () {
	return this[trueRnd(0, this.length - 1)];
}
