import { Schema, model } from "dynamoose";
import { Item } from "dynamoose/dist/Item";

export interface ChapterProgress {
  chapterId: string;
  completed: boolean;
}

export interface SectionProgress {
  sectionId: string;
  chapters: ChapterProgress[];
}

export class UserCourseProgressClass extends Item {
  userId!: string;
  courseId!: string;
  enrollmentDate!: string;
  overallProgress!: number;
  sections!: SectionProgress[];
  lastAccessedTimestamp!: string;
}

const chapterProgressSchema = new Schema({
  chapterId: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
});

const sectionProgressSchema = new Schema({
  sectionId: {
    type: String,
    required: true,
  },
  chapters: {
    type: Array,
    schema: [chapterProgressSchema],
  },
});

const userCourseProgressSchema = new Schema(
  {
    userId: {
      type: String,
      hashKey: true,
      required: true,
    },
    courseId: {
      type: String,
      rangeKey: true,
      required: true,
    },
    enrollmentDate: {
      type: String,
      required: true,
    },
    overallProgress: {
      type: Number,
      required: true,
    },
    sections: {
      type: Array,
      schema: [sectionProgressSchema],
    },
    lastAccessedTimestamp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserCourseProgress = model<UserCourseProgressClass>(
  "UserCourseProgress",
  userCourseProgressSchema
);
export default UserCourseProgress;
