import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  _id: String,
  name: String,
  type: String,
  dateTimeCreated: { type: Date, default: Date.now },
  dateTimeUpdated: { type: Date, default: Date.now },
});

const Vendor = mongoose.model('Vendor', schema);

export { Vendor };
