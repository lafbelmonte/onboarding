import { VendorNotFoundError } from '@custom-errors';
import { VendorEntity } from '@entities/vendor/entity';
import { VendorStore } from '@data-access/mongoose/vendors/actions';
import { Vendor } from '@lib/mongoose/models/vendor';
import { UseCase } from '@types';

type UpdateVendorUseCaseInput = {
  id: string;
  info: Pick<Vendor, 'name' | 'type'>;
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type UpdateVendorUseCaseOutput = boolean;

export type UpdateVendorUseCase = UseCase<
  UpdateVendorUseCaseInput,
  UpdateVendorUseCaseOutput
>;

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
