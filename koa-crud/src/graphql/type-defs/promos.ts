import { gql } from 'apollo-server-koa';

export default gql`
  extend type Query {
    promos(first: Int, after: String): PromoConnection
    promo(id: ID!): Promo
  }

  extend type Mutation {
    createPromo(input: CreatePromoInput!): Boolean!
    updatePromo(input: UpdatePromoInput!): Boolean!
    deletePromo(id: ID!): Boolean!
  }

  enum PromoTemplate {
    DEPOSIT
    SIGN_UP
  }

  enum RequiredMemberFields {
    EMAIL
    REAL_NAME
    BANK_ACCOUNT
  }

  enum PromoStatus {
    DRAFT
    ACTIVE
    INACTIVE
  }

  type PromoConnectionEdge {
    node: Promo
    cursor: String
  }

  type PromoConnection {
    totalCount: Int!
    edges: [PromoConnectionEdge]!
    pageInfo: PageInfo
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
    minimumBalance: Float!
  }

  type SignUpPromo implements Promo {
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
    requiredMemberFields: [RequiredMemberFields]!
  }

  input CreatePromoInput {
    name: String!
    template: PromoTemplate!
    title: String!
    description: String!
    minimumBalance: Float
    requiredMemberFields: [RequiredMemberFields]
  }

  input UpdatePromoInput {
    id: ID!
    name: String!
    template: PromoTemplate!
    title: String!
    description: String!
    minimumBalance: Float
    requiredMemberFields: [RequiredMemberFields]
    submitted: Boolean
    enabled: Boolean
    status: PromoStatus
  }
`;
