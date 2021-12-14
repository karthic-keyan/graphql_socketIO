const { ApolloServer } = require("apollo-server");
const app = require("express")
const {createServer} = require('http')
const {SubscriptionServer} = require("subscriptions-transport-ws")
const typeDefs = require("./data/schema");
const resolvers = require("./data/resolvers");
const { execute, subscribe } = require("graphql");
const { makeExecutableSchema } = require("@graphql-tools/schema");
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });


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
//   dataSources: () => ({ usersAPI: new UserAPI() })
});

// (async function () {
//   await server.start();
//   server.applyMiddleware({ app });
// }())


// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });

const PORT = 3000;
server.listen(PORT, () =>
  console.log(`Server is now running on http://localhost:${PORT}/graphql`)
);