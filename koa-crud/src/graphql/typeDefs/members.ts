import { gql } from 'apollo-server-koa';

export default gql`
  extend type Mutation {
    createMember(input: CreateMemberInput!): Boolean
  }

  input CreateMemberInput {
    username: String!
    password: String!
  }

  type Member {
    id: ID!
    username: String!
    realName: String
    createdAt: String!
    updatedAt: String!
  }
`;
