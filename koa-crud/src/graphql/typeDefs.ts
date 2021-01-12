import { gql } from 'apollo-server-koa';

export default gql`
  type Query {
    vendors: [Vendor]
    vendor(id: ID!): Vendor
  }
  type Mutation {
    createVendor(name: String, type: String): Boolean
    updateVendor(id: ID!, name: String, type: String): Boolean
    deleteVendor(id: ID!): Boolean
  }

  type Vendor {
    id: ID!
    name: String
    type: String
    dateTimeCreated: String
    dateTimeUpdated: String
  }
`;
