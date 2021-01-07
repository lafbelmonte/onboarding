import { Vendor as VendorModel } from '../../../lib/mongoose/models/vendor';

import { VendorDocument } from '../../../types/index';

const actions = ({ Vendor }: { Vendor: typeof VendorModel }) => {
  async function insertOneVendor(
    info: typeof VendorModel,
  ): Promise<VendorDocument> {
    return Vendor.create({
      ...info,
    });
  }

  async function vendorExistsByFilter(
    filters: Pick<VendorDocument, '_id' | 'name' | 'type'>,
  ): Promise<boolean> {
    return Vendor.exists(filters);
  }

  async function selectAllVendors(): Promise<VendorDocument[]> {
    return Vendor.find().lean();
  }

  async function selectOneVendorByFilters(
    filters: Pick<VendorDocument, '_id' | 'name' | 'type'>,
  ): Promise<VendorDocument> {
    return Vendor.findOne({ ...filters });
  }

  async function updateVendorByFilters(
    filters: Pick<VendorDocument, '_id' | 'name' | 'type'>,
    info: typeof VendorModel,
  ): Promise<VendorDocument> {
    return Vendor.findOneAndUpdate(
      { ...filters },
      { ...info },
      { new: true, runValidators: true },
    );
  }

  async function deleteOneVendor(
    filters: Pick<VendorDocument, '_id' | 'name' | 'type'>,
  ): Promise<boolean> {
    const vendor = await Vendor.deleteOne({ ...filters });

    const isDeleted = !!(vendor.ok === 1 && vendor.deletedCount === 1);

    return isDeleted;
  }

  return {
    insertOneVendor,
    vendorExistsByFilter,
    selectAllVendors,
    selectOneVendorByFilters,
    updateVendorByFilters,
    deleteOneVendor,
  };
};

export default actions;
