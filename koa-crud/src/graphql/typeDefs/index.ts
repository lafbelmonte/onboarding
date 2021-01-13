import { gql } from 'apollo-server-koa';
import vendors from './vendors';
import members from './members';

const base = gql`
  type Query
  type Mutation
`;

const typeDefs = gql`
  ${base}
  ${vendors}
  ${members}
`;

export default typeDefs;
