import { VendorStore } from '@data-access/mongoose/vendors/actions';
import { Vendor } from '@lib/mongoose/models/vendor';
import { VendorEntity } from '@entities/vendor/entity';
import { ExistingVendorError } from '@custom-errors';
import { UseCase } from '@types';

type InsertVendorUseCaseInput = {
  id?: string;
  info: Pick<Vendor, 'name' | 'type'>;
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type InsertVendorUseCaseOutput = boolean;

export type InsertVendorUseCase = UseCase<
  InsertVendorUseCaseInput,
  InsertVendorUseCaseOutput
>;

const insertVendor = ({
  vendorStore,
  vendorEntity,
}: {
  vendorStore: VendorStore;
  vendorEntity: VendorEntity;
}): InsertVendorUseCase => {
  return async function ({ info }) {
    const vendor = await vendorEntity(info);

    const vendorExists = await vendorStore.vendorExistsByFilter({
      name: vendor.name,
    });

    if (vendorExists) {
      throw new ExistingVendorError(`Vendor already exists`);
    }

    await vendorStore.insertOneVendor(vendor);

    return true;
  };
};

export default insertVendor;
