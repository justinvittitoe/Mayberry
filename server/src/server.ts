import express from 'express';
import db from './config/connection.js';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import cors from 'cors';


//import the apolloSever class
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

//import the two parts of a GraphQL schema
import { typeDefs, resolvers } from './schemas/index.js';
import { getUserFromToken } from './services/auth.js'

// import blob storage
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001

const startApolloServer = async () => {

  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})]
  });

  await server.start();
  await db();

  
  // const PORT = process.env.PORT || 3001;
  const corsOptions = {
    origin: ['http://localhost:4000', 'http://localhost:4001'],
    credentials: true,
  };

  app.use(cors(corsOptions));

  app.use(express.urlencoded({ extended: true, limit: '50mb'}));
  app.use(express.json({ limit: '50mb' }));

  app.use('/graphql', graphqlUploadExpress({
    maxFileSize: 100000000,
    maxFiles: 10
  }));

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => ({
      user: getUserFromToken(req),
    }),
  }))

  app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'dist', 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`🌍 Now listening on http://localhost:${PORT}`)
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`)
    console.log(`Blob storage endpoint at http://localhost:${PORT}/api/upload`);
  });
};

//Call the async function to start the server
startApolloServer().catch((error) => {
  console.error('Server startup failed', error);
  process.exit(1);
});



