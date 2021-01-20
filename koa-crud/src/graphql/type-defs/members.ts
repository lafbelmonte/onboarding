import { gql } from 'apollo-server-koa';

export default gql`
  extend type Query {
    members: [Member]
    member(id: ID!): Member
  }

  extend type Mutation {
    createMember(input: CreateMemberInput!): Boolean!
    updateMember(input: UpdateMemberInput!): Boolean!
    deleteMember(id: ID!): Boolean!
  }

  input UpdateMemberInput {
    id: ID!
    username: String!
    realName: String
    email: String
    bankAccount: String
    balance: Float
  }

  input CreateMemberInput {
    username: String!
    password: String!
    realName: String
    email: String
    bankAccount: String
    balance: Float
  }

  type Member {
    id: ID!
    username: String!
    realName: String
    email: String
    bankAccount: String
    balance: Float
    createdAt: String!
    updatedAt: String!
  }
`;
