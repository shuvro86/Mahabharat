import { Schema, model, Document } from "mongoose";

export interface ICharacter extends Document {
  name: string;
  alliance: string; // e.g. "Pandavas", "Kauravas", "Neutral", "Divine"
  role: string;
  description: string;
  keyAttributes: string[];
  weapons: string[];
  avatar?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CharacterSchema = new Schema<ICharacter>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    alliance: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    keyAttributes: {
      type: [String],
      default: [],
    },
    weapons: {
      type: [String],
      default: [],
    },
    avatar: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

CharacterSchema.index({ name: 1 }, { unique: true });

export const Character = model<ICharacter>("Character", CharacterSchema);
