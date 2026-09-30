import { Schema, model, Document } from "mongoose";

export interface IExample {
  arabicText: string;
  sanskritText?: string; // Virtual alias
  translationText: string;
  surah: number;
  chapter?: number;      // Virtual alias
  ayah: number;
  verse?: number;        // Virtual alias
}

export interface IWord extends Document {
  arabic: string;
  sanskrit?: string;     // Virtual alias
  transliteration: string;
  translation: string;
  rootWord?: string;
  meaning: string;
  difficulty: "easy" | "medium" | "hard";
  occurrences: number;
  grammarSegment: string;
  examples: IExample[];
  createdAt: Date;
  updatedAt: Date;
}

const ExampleSchema = new Schema<IExample>(
  {
    arabicText: { type: String, required: true },
    translationText: { type: String, required: true },
    surah: { type: Number, required: true },
    ayah: { type: Number, required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ExampleSchema.virtual("sanskritText")
  .get(function (this: any) {
    return this.arabicText;
  })
  .set(function (this: any, val: string) {
    this.arabicText = val;
  });

ExampleSchema.virtual("chapter")
  .get(function (this: any) {
    return this.surah;
  })
  .set(function (this: any, val: number) {
    this.surah = val;
  });

ExampleSchema.virtual("verse")
  .get(function (this: any) {
    return this.ayah;
  })
  .set(function (this: any, val: number) {
    this.ayah = val;
  });

const WordSchema = new Schema<IWord>(
  {
    arabic: {
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
    rootWord: {
      type: String,
      trim: true,
    },
    meaning: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    occurrences: {
      type: Number,
      default: 0,
    },
    grammarSegment: {
      type: String,
      required: true,
    },
    examples: [ExampleSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

WordSchema.virtual("sanskrit")
  .get(function (this: any) {
    return this.arabic;
  })
  .set(function (this: any, val: string) {
    this.arabic = val;
  });

export const Word = model<IWord>("Word", WordSchema);
