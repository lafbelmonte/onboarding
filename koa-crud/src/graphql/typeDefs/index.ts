import { gql } from 'apollo-server-koa';
import vendors from './vendors';
import members from './members';
import promos from './promos';

const base = gql`
  type Query
  type Mutation
`;

const typeDefs = gql`
  ${base}
  ${vendors}
  ${members}
  ${promos}
`;

export default typeDefs;
