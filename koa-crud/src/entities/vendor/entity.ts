import { MissingVendorInformationError } from '../../custom-errors';
import { Vendor } from '../../lib/mongoose/models/vendor';

type Input = {
  name: Vendor['name'];
  type: Vendor['type'];
};

type Output = {
  name: Vendor['name'];
  type: Vendor['type'];
};

export type VendorEntity = (input: Input) => Promise<Output>;

const entity = (): VendorEntity => {
  return async function vendor({ name, type }) {
    if (!name) {
      throw new MissingVendorInformationError(`Please input name`);
    }

    if (!type) {
      throw new MissingVendorInformationError(`Please input type`);
    }

    return {
      name,
      type,
    };
  };
};

export default entity;
