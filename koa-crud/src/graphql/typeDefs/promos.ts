import { gql } from 'apollo-server-koa';

export default gql`
  extend type Query {
    promos: [Promo]
    promo(id: ID!): Promo
  }

  extend type Mutation {
    createPromo(input: CreatePromoInput!): Boolean
  }

  enum PromoTemplate {
    DEPOSIT
    SIGN_UP
  }

  enum RequiredMemberFieldsInput {
    EMAIL
    REAL_NAME
    BANK_ACCOUNT
  }

  type Promo {
    id: ID!
    name: String!
    template: String!
    status: String!
    title: String!
    description: String!
    minimumBalance: Float
    requiredMemberFields: [RequiredMemberFieldsInput]
    createdAt: String!
    updatedAt: String!
    submitted: Boolean!
    enabled: Boolean!
  }

  input CreatePromoInput {
    name: String!
    template: PromoTemplate!
    title: String!
    description: String!
    minimumBalance: Float
    requiredMemberFields: [RequiredMemberFieldsInput]
  }
`;