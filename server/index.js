const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers } = require('./module');

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen(4000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
