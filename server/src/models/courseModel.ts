import { Schema, model } from "dynamoose";
import { Item } from "dynamoose/dist/Item";

export interface Comment {
  commentId: string;
  userId: string;
  text: string;
  timestamp: string;
}

export interface Chapter {
  chapterId: string;
  type: "Text" | "Quiz" | "Video";
  title: string;
  content: string;
  comments?: Comment[];
  video?: string;
}

export interface Section {
  sectionId: string;
  sectionTitle: string;
  sectionDescription?: string;
  chapters: Chapter[];
}

export interface Enrollment {
  userId: string;
}

export class CourseClass extends Item {
  courseId!: string;
  teacherId!: string;
  teacherName!: string;
  title!: string;
  description?: string;
  category!: string;
  image?: string;
  price?: number;
  level!: "Beginner" | "Intermediate" | "Advanced";
  status!: "Draft" | "Published";
  sections!: Section[];
  enrollments!: Enrollment[];
}

const commentSchema = new Schema({
  commentId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

const chapterSchema = new Schema({
  chapterId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Text", "Quiz", "Video"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  comments: {
    type: Array,
    schema: [commentSchema],
  },
  video: {
    type: String,
  },
});

const sectionSchema = new Schema({
  sectionId: {
    type: String,
    required: true,
  },
  sectionTitle: {
    type: String,
    required: true,
  },
  sectionDescription: {
    type: String,
  },
  chapters: {
    type: Array,
    schema: [chapterSchema],
  },
});

const courseSchema = new Schema(
  {
    courseId: {
      type: String,
      hashKey: true,
      required: true,
    },
    teacherId: {
      type: String,
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
    },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Draft", "Published"],
    },
    sections: {
      type: Array,
      schema: [sectionSchema],
    },
    enrollments: {
      type: Array,
      schema: [
        new Schema({
          userId: {
            type: String,
            required: true,
          },
        }),
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Course = model<CourseClass>("Course", courseSchema);
export default Course;
