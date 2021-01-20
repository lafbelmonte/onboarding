import { gql } from 'apollo-server-koa';

export default gql`
  enum PromoEnrollmentRequestStatus {
    PENDING
    REJECTED
    APPROVED
    PROCESSING
  }

  type PromoEnrollmentRequest {
    id: ID!
    promo: Promo!
    member: Member!
    status: PromoEnrollmentRequestStatus!
    createdAt: String!
    updatedAt: String!
  }

  type PromoEnrollmentRequestsConnectionEdge {
    node: PromoEnrollmentRequest
    cursor: String
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
  }

  type PromoEnrollmentRequestsConnection {
    totalCount: Int
    edges: [PromoEnrollmentRequestsConnectionEdge]
    pageInfo: PageInfo
  }

  extend type Mutation {
    enrollToPromo(promo: ID!): Boolean
    processPromoEnrollmentRequest(id: ID!): Boolean!
    approvePromoEnrollmentRequest(id: ID!): Boolean!
    rejectPromoEnrollmentRequest(id: ID!): Boolean!
  }

  extend type Query {
    promoEnrollmentRequest(id: ID!): PromoEnrollmentRequest
    promoEnrollmentRequests: PromoEnrollmentRequestsConnection
  }
`;
