import { gql } from 'apollo-server-koa';
import vendors from './vendors';
import members from './members';
import promos from './promos';
import promoEnrollments from './promo-enrollments';

const base = gql`
  type Query
  type Mutation
`;

const typeDefs = gql`
  ${base}
  ${vendors}
  ${members}
  ${promos}
  ${promoEnrollments}
`;

export default typeDefs;
