import { Schema, model, Document } from 'mongoose';
import { nanoid } from 'nanoid';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export enum VendorType {
  Seamless = 'SEAMLESS',
  Transfer = 'TRANSFER',
}

export type Vendor = {
  _id: string;
  name: string;
  type: VendorType;
  cursorBuffer: Buffer;
  cursor: Buffer;
};

export type VendorDocument = Vendor & Document;

const schema: Schema = new Schema(
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
        return Buffer.from(new Date());
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

export default Vendor;
