const { gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`

  type Location{
    lat: Float,
    lng: Float
  }

  type Address {
    street: String,
    suite: String,
    city: String,
    zipcode: String,
    geo: Location
  }

  type Company {
    name: String,
    catchPhrase: String,
    bs: String
  }

  type User {
    id: ID!,
    name: String,
    username: String,
    email: String,
    phone: String,
    website: String
    company: Company
    address: Address
  }

  type Channel {
    id: ID!
    messages: [Message!]!
    name: String!
  }
  input MessageInput {
    channelId: ID!
    text: String!
  }
  type Message {
    id: ID!
    text: String!
  }
  type Query {
    channels: [Channel!]!
    channel(id: ID!): Channel
    getUsers: [User]
  }
  type Mutation {
    addChannel(name: String!): Channel
    addMessage(message: MessageInput!): Message
  }
  type Subscription {
    messageAdded(channelId: ID!): Message
    channelAdded: Channel
  }
`;

module.exports = typeDefs;
