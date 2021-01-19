import { gql } from 'apollo-server-koa';

export default gql`
  extend type Mutation {
    enrollToPromo(input: EnrollToPromoInput!): Boolean
  }

  input EnrollToPromoInput {
    promo: String!
  }
`;
