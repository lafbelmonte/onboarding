import { gql } from 'apollo-server-koa';

export default gql`
  extend type Query {
    vendors(first: Int!, after: String!): VendorConnection
    vendor(id: ID!): Vendor
  }
  extend type Mutation {
    createVendor(input: CreateVendorInput!): Boolean!
    updateVendor(input: UpdateVendorInput!): Boolean!
    deleteVendor(id: ID!): Boolean!
  }

  enum VendorType {
    SEAMLESS
    TRANSFER
  }

  type VendorConnectionEdge {
    node: Vendor
    cursor: String
  }

  type VendorConnection {
    totalCount: Int
    edges: [VendorConnectionEdge]
    pageInfo: PageInfo
  }

  input CreateVendorInput {
    name: String!
    type: VendorType!
  }

  input UpdateVendorInput {
    id: ID!
    name: String!
    type: VendorType!
  }

  type Vendor {
    id: ID!
    name: String
    type: String
    createdAt: String!
    updatedAt: String!
  }
`;
