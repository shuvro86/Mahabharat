import { Schema, model, Document } from "mongoose";

export interface ISearchHistory extends Document {
  userId: Schema.Types.ObjectId;
  query: string;
  createdAt: Date;
  updatedAt: Date;
}

const SearchHistorySchema = new Schema<ISearchHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    query: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SearchHistory = model<ISearchHistory>("SearchHistory", SearchHistorySchema);
