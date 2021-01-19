import { gql } from 'apollo-server-koa';

export default gql`
  extend type Mutation {
    enrollToPromo(promo: ID!): Boolean
  }
`;
