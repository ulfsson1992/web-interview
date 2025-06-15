import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import { MongoMemoryServer } from 'mongodb-memory-server'

import typeDefs from './schema/typeDefs.js'
import resolvers from './schema/resolvers.js'

dotenv.config()

const startApp = async () => {
    const app = express()
    
    app.use(cors())
    app.use(express.json())

    let mongoUri = process.env.MONGO_URL;
    let mongoServer;
    if (process.env.USE_INMEMEORY_DB) {
        mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
    }

    await mongoose.connect(mongoUri);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({
            headers: req.headers,
        }),
    });
    await server.start();

    server.applyMiddleware({ app, path: '/graphql' });
    
    const PORT = process.env.PORT || 3001;
    
    app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

    const shutdown = async () => {
        console.log('Shutting down...');
        await server.stop();
        await mongoose.disconnect();
        if (mongoServer) {
            await mongoServer.stop();
            console.log('In-memory MongoDB stopped.');
        }
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}

startApp().catch(err => {
    console.error('Error starting the application:', err);
    process.exit(1);
});