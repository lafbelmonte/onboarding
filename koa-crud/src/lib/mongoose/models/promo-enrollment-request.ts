import { Schema, model, Document } from 'mongoose';
import { nanoid } from 'nanoid';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export enum PromoEnrollmentRequestStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Processing = 'PROCESSING',
  Approved = 'APPROVED',
}

export type PromoEnrollmentRequest = {
  _id: string;
  promo: string;
  member: string;
  status: PromoEnrollmentRequestStatus;
  cursorBuffer: Buffer;
  cursor: Buffer;
};

export type PromoEnrollmentRequestDocument = PromoEnrollmentRequest & Document;

const schema: Schema = new Schema(
  {
    _id: {
      type: String,
      default() {
        return nanoid();
      },
    },
    promo: {
      type: String,
      required: true,
      ref: 'Promo',
    },
    status: {
      type: String,
      enum: [
        PromoEnrollmentRequestStatus.Approved,
        PromoEnrollmentRequestStatus.Pending,
        PromoEnrollmentRequestStatus.Processing,
        PromoEnrollmentRequestStatus.Rejected,
      ],
      required: true,
      default: PromoEnrollmentRequestStatus.Pending,
    },
    member: {
      type: String,
      required: true,
      ref: 'Member',
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

const PromoEnrollmentRequest = model<PromoEnrollmentRequestDocument>(
  'PromoEnrollmentRequest',
  schema,
);

export default PromoEnrollmentRequest;
