const app = require('./index');
const { connectDatabase } = require('./db');

const port = process.env.PORT || 10000;

connectDatabase()
	.then(() => {
		app.listen(port, () => {
			console.log(`API listening on ${port}`);
		});
	})
	.catch((err) => {
		console.error('Failed to connect to database', err);
		process.exit(1);
	});


