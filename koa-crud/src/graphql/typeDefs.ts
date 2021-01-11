import { gql } from 'apollo-server-koa';

export default gql`
  type Query {
    vendors: ArrayOfVendorReturn
    vendor(id: String): VendorReturn
  }
  type Mutation {
    createVendor(name: String, type: String): VendorReturn
    updateVendor(id: String, name: String, type: String): VendorReturn
    deleteVendor(id: String): DeleteVendorReturn
  }
  type DeleteVendorReturn {
    message: String
  }
  type ArrayOfVendorReturn {
    message: String
    data: [Vendor]
  }
  type VendorReturn {
    message: String
    data: Vendor
  }
  type Vendor {
    _id: ID!
    name: String
    type: String
    dateTimeCreated: String
    dateTimeUpdated: String
  }
`;
