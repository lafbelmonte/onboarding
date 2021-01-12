import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { VendorType, VendorDocument } from '../../../types/index';

const schema = new Schema(
  {
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
  },
  { timestamps: true },
);

schema.plugin(mongooseLeanVirtuals);

const Vendor = model<VendorDocument>('Vendor', schema);

export { Vendor };
