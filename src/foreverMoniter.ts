import forever from 'forever-monitor';

const child = new forever.Monitor('dist/server.js', {
	max: 10,
	silent: false,
	uid: 'index',
});

child.on('exit', function () {
	console.log('app.js has exited after 3 restarts');
});

child.start();
