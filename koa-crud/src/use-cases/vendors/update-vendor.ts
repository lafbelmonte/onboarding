import { VendorNotFoundError } from '../../custom-errors';
import { VendorEntity } from '../../entities/vendor/entity';
import { VendorStore } from '../../data-access/mongoose/vendors/actions';
import { Vendor } from '../../lib/mongoose/models/vendor';

type Input = {
  id: string;
  info: {
    name: Vendor['name'];
    type: Vendor['type'];
  };
  source?;
};

type Output = boolean;

export type UpdateVendorUseCase = (input: Input) => Promise<Output>;

const updateVendor = ({
  vendorStore,
  vendorEntity,
  R,
}: {
  vendorStore: VendorStore;
  vendorEntity: VendorEntity;
  R;
}): UpdateVendorUseCase => {
  return async function ({ id, info }) {
    const vendorExists = await vendorStore.vendorExistsByFilter({
      _id: id,
    });

    if (!vendorExists) {
      throw new VendorNotFoundError(`Vendor with ID: ${id} doesn't exists`);
    }

    const vendor = await vendorEntity(info);

    await vendorStore.updateVendorByFilters(
      { _id: id },
      R.omit(['dateTimeCreated'], vendor),
    );

    return true;
  };
};

export default updateVendor;
