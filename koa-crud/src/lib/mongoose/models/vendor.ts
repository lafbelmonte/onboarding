import { Schema, model } from 'mongoose';
import { Vendor, VendorType, VendorDocument } from '../../../types/index';

const schema = new Schema({
  name: String,
  type: {
    type: String,
    enum: [VendorType.Seamless, VendorType.Transfer],
  },
  dateTimeCreated: { type: Date, default: Date.now },
  dateTimeUpdated: { type: Date, default: Date.now },
});

const Vendor = model<VendorDocument>('Vendor', schema);

export { Vendor };
