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
    minimumBalance: {
      type: Number,
    },
    requiredMemberFields: {
      type: [String],
      enum: RequiredMemberFields,
      default: [],
    },
  },
  { timestamps: true },
);

schema.plugin(mongooseLeanVirtuals);

const Promo = model<PromoDocument>('Promo', schema);

export { Promo };
