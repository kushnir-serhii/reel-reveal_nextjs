import mongoose, { Schema } from "mongoose";

export interface IAiUsage {
  key: string;
  day: string;
  count: number;
  tokens: number;
  expireAt: Date;
}

/**
 * AI requests made per user (or per hashed guest IP) per UTC day.
 */
const aiUsageSchema = new Schema<IAiUsage>(
  {
    key: { type: String, required: true },
    day: { type: String, required: true },
    count: { type: Number, default: 0 },
    tokens: { type: Number, default: 0 },
    expireAt: { type: Date, required: true },
  },
  { versionKey: false }
);

// The unique index is what makes the daily limit atomic, see consumeAiRequest.
aiUsageSchema.index({ key: 1, day: 1 }, { unique: true });
aiUsageSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default (mongoose.models.AiUsage as mongoose.Model<IAiUsage>) ||
  mongoose.model<IAiUsage>("AiUsage", aiUsageSchema);
