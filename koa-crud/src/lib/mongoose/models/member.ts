import { Schema, model, Document } from 'mongoose';
import { nanoid } from 'nanoid';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export type Member = {
  _id: string;
  username: string;
  password: string;
  realName?: string;
  email?: string;
  bankAccount?: string;
  balance?: number;
  cursor: Buffer;
  cursorBuffer: Buffer;
};

export type MemberDocument = Member & Document;

const schema: Schema = new Schema(
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

const Member = model<MemberDocument>('Member', schema);

export default Member;
