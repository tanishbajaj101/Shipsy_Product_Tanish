const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectDatabase, disconnectDatabase } = require('../src/db');

// Ensure test env and JWT secret are set before app/routes are imported by tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

let mongoServer;


beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();
	process.env.MONGO_URI = uri;
	await connectDatabase(uri);
});

afterEach(async () => {
	const collections = await mongoose.connection.db.collections();
	for (const collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await disconnectDatabase();
	if (mongoServer) await mongoServer.stop();
});


