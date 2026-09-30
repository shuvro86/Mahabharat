import { Schema, model, Document } from "mongoose";

export interface IQuizQuestionDetail {
  wordId: Schema.Types.ObjectId;
  word: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface IQuizHistory extends Document {
  userId: Schema.Types.ObjectId;
  score: number;
  totalQuestions: number;
  questions: IQuizQuestionDetail[];
  createdAt: Date;
  updatedAt: Date;
}

const QuizQuestionDetailSchema = new Schema<IQuizQuestionDetail>({
  wordId: {
    type: Schema.Types.ObjectId,
    ref: "Word",
    required: true,
  },
  word: {
    type: String,
    required: true,
  },
  userAnswer: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const QuizHistorySchema = new Schema<IQuizHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    questions: [QuizQuestionDetailSchema],
  },
  {
    timestamps: true,
  }
);

export const QuizHistory = model<IQuizHistory>("QuizHistory", QuizHistorySchema);
