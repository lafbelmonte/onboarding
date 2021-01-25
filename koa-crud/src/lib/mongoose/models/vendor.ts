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
    dateTimeCreated: { type: Date, default: Date.now },
    cursor: {
      type: Buffer,
      default(this) {
        return Buffer.from(this.dateTimeCreated);
      },
    },
  },
  { timestamps: true },
);

schema.plugin(mongooseLeanVirtuals);

schema.virtual('cursorBuffer').get(function () {
  return this.cursor.buffer;
});

const Vendor = model<VendorDocument>('Vendor', schema);

export { Vendor };
