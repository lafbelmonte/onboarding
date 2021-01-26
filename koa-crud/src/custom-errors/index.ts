import { ApolloError } from 'apollo-server-koa';

class MissingMemberInformationError extends ApolloError {
  constructor(message: string) {
    super(message, 'MISSING_MEMBER_INFORMATION');
  }
}

class ExistingMemberError extends ApolloError {
  constructor(message: string) {
    super(message, 'EXISTING_MEMBER');
  }
}

class MemberNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, 'MEMBER_NOT_FOUND');
  }
}

class MissingVendorInformationError extends ApolloError {
  constructor(message: string) {
    super(message, 'MISSING_VENDOR_INFORMATION');
  }
}

class ExistingVendorError extends ApolloError {
  constructor(message: string) {
    super(message, 'EXISTING_VENDOR');
  }
}

class VendorNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, 'VENDOR_NOT_FOUND');
  }
}

class MissingPromoInformationError extends ApolloError {
  constructor(message: string) {
    super(message, 'MISSING_PROMO_INFORMATION');
  }
}

class InvalidPromoTemplateError extends ApolloError {
  constructor(message: string) {
    super(message, 'INVALID_PROMO_TEMPLATE');
  }
}

class InvalidPromoRequiredMemberFieldError extends ApolloError {
  constructor(message: string) {
    super(message, 'INVALID_PROMO_REQUIRED_MEMBER_FIELD');
  }
}

class InvalidPromoInformationGivenError extends ApolloError {
  constructor(message: string) {
    super(message, 'INVALID_PROMO_INFORMATION_GIVEN');
  }
}

class PromoNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, 'PROMO_NOT_FOUND');
  }
}

class ActivePromoError extends ApolloError {
  constructor(message: string) {
    super(message, 'ACTIVE_PROMO');
  }
}

class InvalidPromoError extends ApolloError {
  constructor(message: string) {
    super(message, 'INVALID_PROMO');
  }
}

class ExistingEnrollmentError extends ApolloError {
  constructor(message: string) {
    super(message, 'EXISTING_ENROLLMENT');
  }
}

class RequiredMemberFieldsNotMetError extends ApolloError {
  constructor(message: string) {
    super(message, 'REQUIRED_MEMBER_FIELDS_NOT_MET');
  }
}

class NotEnoughBalanceError extends ApolloError {
  constructor(message: string) {
    super(message, 'NOT_ENOUGH_BALANCE');
  }
}

class PromoEnrollmentRequestNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, 'PROMO_ENROLLMENT_REQUEST_NOT_FOUND');
  }
}

class MissingCredentialsError extends ApolloError {
  constructor(message: string) {
    super(message, 'MISSING_CREDENTIALS');
  }
}

class InvalidCredentialsError extends ApolloError {
  constructor(message: string) {
    super(message, 'INVALID_CREDENTIALS');
  }
}

class MissingPromoEnrollmentRequestInformationError extends ApolloError {
  constructor(message: string) {
    super(message, 'MISSING_PROMO_ENROLLMENT_REQUEST_INFORMATION_ERROR');
  }
}

class NotAllowedError extends ApolloError {
  constructor(message: string) {
    super(message, 'NOT_ALLOWED_ERROR');
  }
}

class DatabaseError extends ApolloError {
  constructor(message: string) {
    super(message, 'DATABASE_ERROR');
  }
}

class PaginationInputError extends ApolloError {
  constructor(message: string) {
    super(message, 'PAGINATION_INPUT_ERROR');
  }
}

export {
  MissingMemberInformationError,
  ExistingMemberError,
  MemberNotFoundError,
  MissingVendorInformationError,
  ExistingVendorError,
  VendorNotFoundError,
  MissingPromoInformationError,
  InvalidPromoTemplateError,
  InvalidPromoRequiredMemberFieldError,
  InvalidPromoInformationGivenError,
  PromoNotFoundError,
  ActivePromoError,
  InvalidPromoError,
  ExistingEnrollmentError,
  RequiredMemberFieldsNotMetError,
  NotEnoughBalanceError,
  PromoEnrollmentRequestNotFoundError,
  MissingCredentialsError,
  InvalidCredentialsError,
  MissingPromoEnrollmentRequestInformationError,
  NotAllowedError,
  DatabaseError,
  PaginationInputError,
};
