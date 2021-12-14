// import { ApolloServer } from "apollo-server-express";
const {ApolloServer} = require("apollo-server-express")
// import { createServer } from "http";
const {createServer} = require("http")
// import { execute, subscribe } from "graphql";
const { execute, subscribe } = require("graphql")
// import { SubscriptionServer } from "subscriptions-transport-ws";
const {SubscriptionServer} = require("@graphql-tools/schema")
// import { makeExecutableSchema } from "@graphql-tools/schema";
const {makeExecutableSchema} = require("@graphql-tools/schema")
// import express from "express";
const app = require("express")
// import {resolvers} from "./data/resolvers.js";
// import {typeDefs} from "./data/schema.js";
// const UserAPI = require("./data/datasource");
const typeDefs = require("./data/schema");
const resolvers = require("./data/resolvers");

(async function () {
    // const app = express();
  
    const httpServer = createServer(app);
  
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   dataSources: () => ({ usersAPI: new UserAPI() })
// });

// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });
const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: '/graphql' }
  );

  const server = new ApolloServer({
    schema,
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          }
        };
      }
    }],
  });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
})();