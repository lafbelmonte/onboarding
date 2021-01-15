import { gql } from 'apollo-server-koa';

export default gql`
  extend type Mutation {
    createPromo(input: CreatePromoInput!): Boolean
  }

  enum PromoTemplate {
    DEPOSIT
    SIGN_UP
  }

  input RequiredMemberFieldsInput {
    realName: String!
    email: String!
    bankAccount: String!
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
