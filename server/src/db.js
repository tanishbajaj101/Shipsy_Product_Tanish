const mongoose = require('mongoose');

async function connectDatabase(uri) {
	const connectionUri = uri || process.env.MONGO_URI;
	if (!connectionUri) throw new Error('MONGO_URI is not set');
	if (mongoose.connection.readyState === 1) return mongoose.connection;
	await mongoose.connect(connectionUri);
	return mongoose.connection;
}

async function disconnectDatabase() {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.connection.close();
	}
}

module.exports = { connectDatabase, disconnectDatabase };


