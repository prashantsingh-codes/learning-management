// import React, { useState } from "react";
// import { formatPrice } from "@/lib/utils";
// import { Button } from "@/components/ui/button";

// interface SelectedCourseProps {
//   course: Course;
//   handleEnrollNow: (courseId: string) => void;
// }

// const SelectedCourse = ({ course, handleEnrollNow }: SelectedCourseProps) => {
//   const [expandedSections, setExpandedSections] = useState<string[]>([]);

//   const toggleSection = (sectionId: string) => {
//     setExpandedSections((prev) =>
//       prev.includes(sectionId)
//         ? prev.filter((id) => id !== sectionId)
//         : [...prev, sectionId]
//     );
//   };

//   return (
//     <div className="selected-course">
//       <h1 className="selected-course__title">{course.title}</h1>
//       <p className="selected-course__author">
//         By {course.teacherName} |{" "}
//         <span className="selected-course__enrollment-count">
//           {course.enrollments?.length || 0} Enrolled
//         </span>
//       </p>

//       <div className="selected-course__content">
//         <p className="selected-course__description">{course.description}</p>

//         <div className="selected-course__sections">
//           <h3 className="selected-course__sections-title">Course Content</h3>
//           <div className="w-full mt-4">
//             {course.sections?.map((section) => {
//               const isExpanded = expandedSections.includes(section.sectionId);
//               return (
//                 <div key={section.sectionId} className="accordion-section">
//                   <button
//                     onClick={() => toggleSection(section.sectionId)}
//                     className="accordion-section__trigger w-full flex items-center justify-between text-left cursor-pointer"
//                   >
//                     <span className="accordion-section__title text-sm">
//                       {section.sectionTitle}
//                     </span>
//                     <span className="text-gray-400 text-xs">
//                       {isExpanded ? "▲" : "▼"}
//                     </span>
//                   </button>
//                   {isExpanded && (
//                     <div className="accordion-section__content">
//                       <ul className="space-y-2">
//                         {section.chapters?.map((chapter) => (
//                           <li
//                             key={chapter.chapterId}
//                             className="accordion-section__chapter text-sm"
//                           >
//                             {chapter.title}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="selected-course__footer">
//           <span className="selected-course__price">
//             {formatPrice(course.price)}
//           </span>
//           <Button
//             onClick={() => handleEnrollNow(course.courseId)}
//             className="bg-primary-700 hover:bg-primary-600 text-white-100 font-semibold cursor-pointer"
//           >
//             Enroll Now
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SelectedCourse;

import React, { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AccordionSections from "@/components/AccordionSections";


const SelectedCourse = ({ course, handleEnrollNow }: SelectedCourseProps) => {
  return (
    <div className="selected-course">
      <div>
        <h3 className="selected-course__title">{course.title}</h3>
        <p className="selected-course__author">
          By {course.teacherName} |{" "}
          <span className="selected-course__enrollment-count">
            {course.enrollments?.length}
          </span>
        </p>
      </div>
      <div className="selected-course__content">
        <p className="selected-course__description">{course.description}</p>
        <div className="selected-course__sections">
          <h4 className="selected-course__sections-title">Course Content</h4>
          <AccordionSections sections={course.sections} />
        </div>
        <div className="selected-course__footer">
          <span className="selected-course__price">
            {formatPrice(course.price)}
          </span>
          <Button
            onClick={() => handleEnrollNow(course.courseId)}
            className="bg-primary-700 hover:bg-primary-600"
          >
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectedCourse;
