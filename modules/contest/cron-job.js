const codeforcesApi = require('#modules/contest/api/codeforces.api.js');

const CLOCK_INTERVAL_MINUTES = 5;
const DEBUG_MODE = (process.env.DEBUG_MODE === 'true');

if (DEBUG_MODE) {
	console.log(`[${new Date().toISOString()}] [INFO] module/contest/cron-job: Running cron-job with DEBUG_MODE set to true.`);
}

let hasStarted = false;

const runClock = async () => {
	if (!hasStarted) {
		console.log(`[${new Date().toISOString()}] [INFO] module/contest/cron-job: Clock started.`);
		hasStarted = true;
	}

	await Promise.all([
		codeforcesApi.checkContests().catch(err => console.error(err))
	]);

	scheduleNextRun();
};

const scheduleNextRun = () => {
	const delay = CLOCK_INTERVAL_MINUTES * 60 * 1000 - new Date().getMilliseconds();
	setTimeout(runClock, delay);
};

const getInitialDelay = () => {
	const now = new Date();
	let minutes = CLOCK_INTERVAL_MINUTES * (Math.floor(now.getMinutes() / CLOCK_INTERVAL_MINUTES) + 1) - now.getMinutes();
	let seconds = 0;
	let ms = 0;

	if (now.getSeconds() !== 0) {
		minutes--;
		seconds = 60 - now.getSeconds();
	}
	if (now.getMilliseconds() !== 0) {
		seconds--;
		ms = 1000 - now.getMilliseconds();
		if (seconds === -1) {
			seconds = 59;
			minutes--;
		}
	}

	return minutes * 60000 + seconds * 1000 + ms;
};

setTimeout(() => {
	const delay = DEBUG_MODE ? 1000 : getInitialDelay();
	const readableDelay = DEBUG_MODE
		? "0m-1s-0ms"
		: `${Math.floor(delay / 60000)}m-${Math.floor((delay % 60000) / 1000)}s-${delay % 1000}ms`;

	console.log(`[${new Date().toISOString()}] [INFO] module/contest/cron-job: Clock will start in ${readableDelay}.`);
	setTimeout(runClock, delay);
}, 1000);
