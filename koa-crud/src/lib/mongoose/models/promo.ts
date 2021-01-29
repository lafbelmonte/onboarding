import { Schema, model, Document } from 'mongoose';
import { nanoid } from 'nanoid';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export enum PromoTemplate {
  Deposit = 'DEPOSIT',
  SignUp = 'SIGN_UP',
}

export enum PromoStatus {
  Draft = 'DRAFT',
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export enum RequiredMemberFields {
  Email = 'EMAIL',
  Realname = 'REAL_NAME',
  BankAccount = 'BANK_ACCOUNT',
}

export type Promo = {
  _id: string;
  name: string;
  template: PromoTemplate;
  title: string;
  description: string;
  status?: PromoStatus;
  minimumBalance?: number;
  requiredMemberFields?: RequiredMemberFields[];
  submitted?: boolean;
  enabled?: boolean;
  cursorBuffer: Buffer;
  cursor: Buffer;
};

export type PromoDocument = Promo & Document;

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

const Promo = model<PromoDocument>('Promo', schema);

export default Promo;
