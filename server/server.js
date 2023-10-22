const express = require("express");
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const http = require('http');
const cors = require('cors'); // Import the cors library
const { json } = require('body-parser');
const { authMiddleware } = require("./utils/auth");
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const path = require("path");
const socketIo = require('socket.io');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();
const { typeDefs, resolvers } = require("./schemas");

const schema = makeExecutableSchema({ typeDefs, resolvers });
const db = require("./config/connection");
const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
  context: ({ req }) => ({
    authMiddleware: authMiddleware({ req }),
    pubsub
  }),
});

// Use cors middleware before defining the GraphQL endpoint
app.use(cors());

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const serverCleanup = useServer({ schema }, wsServer);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ... Rest of your code

// Start your Apollo Server
const startApolloServer = async (typeDef, resolvers) => {
  await server.start();
  app.use(
    '/graphql',
    json(),
    expressMiddleware(server, {
      context: authMiddleware,
    }),
  );

  db.once("open", () => {
    httpServer.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
  `Use GraphQL at http://localhost:${PORT}/graphql`
      );
    });
  });
};

startApolloServer(typeDefs, resolvers);
