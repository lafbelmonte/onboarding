import { gql } from 'apollo-server-koa';

export default gql`
  extend type Query {
    promos: [Promo]
    promo(id: ID!): Promo
  }

  extend type Mutation {
    createPromo(input: CreatePromoInput!): Boolean
    updatePromo(input: UpdatePromoInput!): Boolean
    deletePromo(id: ID!): Boolean
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

  enum PromoStatus {
    DRAFT
    ACTIVE
    INACTIVE
  }

  interface Promo {
    id: ID!
    name: String!
    template: PromoTemplate!
    status: String!
    title: String!
    description: String!
    createdAt: String!
    updatedAt: String!
    submitted: Boolean!
    enabled: Boolean!
  }

  type DepositPromo implements Promo {
    minimumBalance: Float!
  }

  type SignUpPromo implements Promo {
    requiredMemberFields: [RequiredMemberFieldsInput]!
  }

  input CreatePromoInput {
    name: String!
    template: PromoTemplate!
    title: String!
    description: String!
    minimumBalance: Float
    requiredMemberFields: [RequiredMemberFieldsInput]
  }

  input UpdatePromoInput {
    id: ID!
    name: String!
    template: PromoTemplate!
    title: String!
    description: String!
    minimumBalance: Float
    requiredMemberFields: [RequiredMemberFieldsInput]
    submitted: Boolean
    enabled: Boolean
    status: PromoStatus
  }
`;
