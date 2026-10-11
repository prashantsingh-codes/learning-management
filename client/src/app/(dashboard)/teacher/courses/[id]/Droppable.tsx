"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus, GripVertical } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import {
  setSections,
  deleteSection,
  deleteChapter,
  openSectionModal,
  openChapterModal,
} from "@/state";

export default function DroppableComponent() {
  const dispatch = useAppDispatch();
  const { sections } = useAppSelector((state) => state.global.courseEditor);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === "section" || source.droppableId === "sections") {
      const updatedSections = [...sections];
      const [reorderedSection] = updatedSections.splice(source.index, 1);
      updatedSections.splice(destination.index, 0, reorderedSection);
      dispatch(setSections(updatedSections));
      return;
    }

    if (source.droppableId.startsWith("chapters-")) {
      const sectionId = source.droppableId.replace("chapters-", "");
      const sectionIndex = sections.findIndex((s) => s.sectionId === sectionId);
      if (sectionIndex === -1) return;

      const updatedSections = [...sections];
      const updatedChapters = [...updatedSections[sectionIndex].chapters];
      const [reorderedChapter] = updatedChapters.splice(source.index, 1);
      updatedChapters.splice(destination.index, 0, reorderedChapter);
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        chapters: updatedChapters,
      };
      dispatch(setSections(updatedSections));
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sections" type="section">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {sections.map((section: Section, sectionIndex: number) => (
              <Draggable
                key={section.sectionId}
                draggableId={section.sectionId}
                index={sectionIndex}
              >
                {(draggableProvider) => (
                  <div
                    ref={draggableProvider.innerRef}
                    {...draggableProvider.draggableProps}
                    className={`droppable-section ${
                      sectionIndex % 2 === 0
                        ? "droppable-section--even"
                        : "droppable-section--odd"
                    }`}
                  >
                    <SectionHeader
                      section={section}
                      sectionIndex={sectionIndex}
                      dragHandleProps={draggableProvider.dragHandleProps}
                    />

                    <Droppable droppableId={`chapters-${section.sectionId}`} type="chapter">
                      {(droppableProvider) => (
                        <div
                          ref={droppableProvider.innerRef}
                          {...droppableProvider.droppableProps}
                        >
                          {section.chapters.map(
                            (chapter: Chapter, chapterIndex: number) => (
                              <Draggable
                                key={chapter.chapterId}
                                draggableId={chapter.chapterId}
                                index={chapterIndex}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`droppable-chapter ${
                                      chapterIndex % 2 === 1
                                        ? "droppable-chapter--odd"
                                        : "droppable-chapter--even"
                                    }`}
                                  >
                                    <div className="droppable-chapter__title">
                                      <GripVertical className="h-4 w-4 mb-[2px]" />
                                      <p className="text-sm">{`${chapterIndex + 1}. ${chapter.title}`}</p>
                                    </div>
                                    <div className="droppable-chapter__actions">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="droppable-chapter__button"
                                        onClick={() =>
                                          dispatch(
                                            openChapterModal({
                                              sectionIndex,
                                              chapterIndex,
                                            })
                                          )
                                        }
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="droppable-chapter__button"
                                        onClick={() =>
                                          dispatch(
                                            deleteChapter({
                                              sectionIndex,
                                              chapterIndex,
                                            })
                                          )
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            )
                          )}
                          {droppableProvider.placeholder}
                        </div>
                      )}
                    </Droppable>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        dispatch(
                          openChapterModal({
                            sectionIndex,
                            chapterIndex: null,
                          })
                        )
                      }
                      className="add-chapter-button group"
                    >
                      <Plus className="add-chapter-button__icon" />
                      <span className="add-chapter-button__text">
                        Add Chapter
                      </span>
                    </Button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

const SectionHeader = ({
  section,
  sectionIndex,
  dragHandleProps,
}: {
  section: Section;
  sectionIndex: number;
  dragHandleProps: any;
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="droppable-section__header" {...dragHandleProps}>
      <div className="droppable-section__title-wrapper">
        <div className="droppable-section__title-container">
          <div className="droppable-section__title">
            <GripVertical className="h-6 w-6 mb-1" />
            <h3 className="text-lg font-medium">{section.sectionTitle}</h3>
          </div>
          <div className="droppable-chapter__actions">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-0"
              onClick={() => dispatch(openSectionModal({ sectionIndex }))}
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-0"
              onClick={() => dispatch(deleteSection(sectionIndex))}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {section.sectionDescription && (
          <p className="droppable-section__description">
            {section.sectionDescription}
          </p>
        )}
      </div>
    </div>
  );
};
