import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import {
  PromoTemplate,
  PromoStatus,
  PromoDocument,
  RequiredMemberFields,
} from '../../../types/index';

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
    template: {
      type: String,
      enum: [PromoTemplate.Deposit, PromoTemplate.SignUp],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [PromoStatus.Active, PromoStatus.Inactive, PromoStatus.Draft],
      default: PromoStatus.Draft,
    },
    submitted: {
      type: Boolean,
      default: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    minimumBalance: {
      type: Number,
    },
    requiredMemberFields: {
      type: [String],
      enum: RequiredMemberFields,
      default: [],
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

const Promo = model<PromoDocument>('Promo', schema);

export { Promo };
