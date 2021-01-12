import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';
import { VendorType, VendorDocument } from '../../../types/index';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'

const schema = new Schema({
  _id: {
    type: String,
    default() {
      return nanoid();
    },
  },
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

schema.plugin(mongooseLeanVirtuals)

const Vendor = model<VendorDocument>('Vendor', schema);

export { Vendor };
