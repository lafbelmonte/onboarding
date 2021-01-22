import { Vendor } from '../../types/index';
import { MissingVendorInformationError } from '../../custom-errors';

const entity = () => {
  return async function vendor({ name, type }: Vendor): Promise<Vendor> {
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
