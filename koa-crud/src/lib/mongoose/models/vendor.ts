import { Schema, model } from 'mongoose';
import { VendorType, VendorDocument } from '../../../types/index';

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [VendorType.Seamless, VendorType.Transfer],
    required: true,
  },
  dateTimeCreated: { type: Date, default: Date.now },
  dateTimeUpdated: { type: Date, default: Date.now },
});

const Vendor = model<VendorDocument>('Vendor', schema);

export { Vendor };
