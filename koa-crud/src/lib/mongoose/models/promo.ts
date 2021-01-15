import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import {
  PromoTemplate,
  PromoStatus,
  PromoDocument,
} from '../../../types/index';

const RequiredMemberFieldsSchema = new Schema({
  _id: {
    type: String,
    default() {
      return nanoid();
    },
  },
  realName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  bankAccount: {
    type: String,
    required: true,
  },
});

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
    minimumBalance: {
      type: Number,
    },
    requiredMemberFields: [RequiredMemberFieldsSchema],
  },
  { timestamps: true },
);

schema.plugin(mongooseLeanVirtuals);

const Promo = model<PromoDocument>('Promo', schema);

export { Promo };
