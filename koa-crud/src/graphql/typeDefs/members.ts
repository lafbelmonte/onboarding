import { gql } from 'apollo-server-koa';

export default gql`
  extend type Query {
    members: [Member]
    member(id: ID!): Member
  }

  extend type Mutation {
    createMember(input: CreateMemberInput!): Boolean
    updateMember(input: UpdateMemberInput!): Boolean
  }

  input UpdateMemberInput {
    id: ID
    username: String!
    realName: String
    password: String!
  }

  input CreateMemberInput {
    username: String!
    password: String!
    realName: String
  }

  type Member {
    id: ID!
    username: String!
    realName: String
    createdAt: String!
    updatedAt: String!
  }
`;
