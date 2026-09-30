import { Schema, model, Document } from "mongoose";

export interface IProgress extends Document {
  userId: Schema.Types.ObjectId;
  wordId: Schema.Types.ObjectId;
  interval: number;       // In days
  repetition: number;     // Repetitions count
  easeFactor: number;     // SM-2 Ease Factor
  nextReviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wordId: {
      type: Schema.Types.ObjectId,
      ref: "Word",
      required: true,
    },
    interval: {
      type: Number,
      default: 1,
    },
    repetition: {
      type: Number,
      default: 0,
    },
    easeFactor: {
      type: Number,
      default: 2.5,
    },
    nextReviewDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Progress = model<IProgress>("Progress", ProgressSchema);
