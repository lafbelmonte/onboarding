import { Schema, model, Document } from 'mongoose';
import { Vendor } from '../../../types/index';

const schema = new Schema({
  _id: String,
  name: String,
  type: String,
  dateTimeCreated: { type: Date, default: Date.now },
  dateTimeUpdated: { type: Date, default: Date.now },
});

const Vendor = model<Vendor & Document>('Vendor', schema);

export { Vendor };
