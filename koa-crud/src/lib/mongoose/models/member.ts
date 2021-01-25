import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { MemberDocument } from '../../../types/index';

const schema = new Schema(
  {
    _id: {
      type: String,
      default() {
        return nanoid();
      },
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
    },
    email: {
      type: String,
    },
    bankAccount: {
      type: String,
    },
    realName: String,
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

const Member = model<MemberDocument>('Member', schema);

export { Member };
