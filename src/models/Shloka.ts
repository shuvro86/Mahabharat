import { Schema, model, Document } from "mongoose";

export interface IShloka extends Document {
  chapter: number;
  verse: number;
  chapterName: string;
  sanskrit: string;
  transliteration: string;
  translation: string;
  translationHindi?: string;
  translationBengali?: string;
  explanation: string;
  explanationHindi?: string;
  explanationBengali?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShlokaSchema = new Schema<IShloka>(
  {
    chapter: {
      type: Number,
      required: true,
    },
    verse: {
      type: Number,
      required: true,
    },
    chapterName: {
      type: String,
      required: true,
      trim: true,
    },
    sanskrit: {
      type: String,
      required: true,
      trim: true,
    },
    transliteration: {
      type: String,
      required: true,
      trim: true,
    },
    translation: {
      type: String,
      required: true,
      trim: true,
    },
    translationHindi: {
      type: String,
      default: "",
      trim: true,
    },
    translationBengali: {
      type: String,
      default: "",
      trim: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    explanationHindi: {
      type: String,
      default: "",
    },
    explanationBengali: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

ShlokaSchema.index({ chapter: 1, verse: 1 }, { unique: true });

export const Shloka = model<IShloka>("Shloka", ShlokaSchema);
