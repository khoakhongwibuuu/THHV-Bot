const fs = require('node:fs');
const path = require('node:path');

const dirname = global.dirname;

String.prototype.logToFile = function () {
	fs.appendFile(dirname + '/logs/' + global.BotStartTime.replace(/:/g, "") + '.log', this + '\n', (err) => {
		if (err) throw err;
	});
}

String.prototype.logOffline = function () {
	const content = JSON.stringify(this)
	console.log(content.substring(1, content.length - 1));
	content.substring(1, content.length - 1).logToFile();
}

const clearCache = (sessionId) => {
	fs.readdir(path.join(dirname, '/logs'), (err, files) => {
		files.forEach(file => {
			const filePath = path.join(dirname, 'logs', file);
			if (file !== `${sessionId}.log`) {
				fs.unlink(filePath, err => {
					if (err) {
						console.error(err);
					}
				});
			}
		});
	});
}

module.exports.clearCache = clearCache;
