import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import "./ChapterContents.css"; // Assuming you have a CSS file for styles
const ChapterContents = ({
  chapters,
  chapterInputs,
  topicInputs,
  subtopicInputs,
  topics,
  subtopics,
  editingChapterId,
  editingTopicId,
  editingSubtopicId,
  editedChapterTitle,
  editedTopicTitle,
  editedSubtopicTitle,
  setEditedChapterTitle,
  loading,
  selectedSubtopicId,
  handleEditChapter,
  handleDeleteChapter,
  handleSaveChapterEdit,
  setEditingChapterId,
  handleChapterInputChange,
  handleAddChapter,
  handleTopicInputChange,
  handleAddTopic,
  handleEditTopic,
  handleDeleteTopic,
  handleSaveTopicEdit,
  setEditingTopicId,
  handleSubtopicInputChange,
  handleAddSubtopic,
  handleEditSubtopic,
  handleDeleteSubtopic,
  handleSaveSubtopicEdit,
  setEditingSubtopicId,
  setSelectedSubtopicId,
  setEditedTopicTitle,
  setEditedSubtopicTitle,
}) => {
  // State for reordering
  const [localChapters, setLocalChapters] = useState(chapters);
  const [localTopics, setLocalTopics] = useState(topics);
  const [localSubtopics, setLocalSubtopics] = useState(subtopics);

  // Update local state when props change
  React.useEffect(() => {
    setLocalChapters(chapters);
  }, [chapters]);

  React.useEffect(() => {
    setLocalTopics(topics);
  }, [topics]);

  React.useEffect(() => {
    setLocalSubtopics(subtopics);
  }, [subtopics]);

  // Handle drag end for all levels
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    // Chapter reordering
    if (type === "CHAPTER") {
      const reorderedChapters = Array.from(localChapters);
      const [removed] = reorderedChapters.splice(source.index, 1);
      reorderedChapters.splice(destination.index, 0, removed);
      setLocalChapters(reorderedChapters);

      // Update order in backend
      try {
        await axios.post("http://localhost:5000/api/drag-and-drop/reorder-chapters", {
          chapterIds: reorderedChapters.map(ch => ch.id)
        });
      } catch (error) {
        console.error("Error reordering chapters:", error);
      }
      return;
    }

    // Topic reordering
    if (type.startsWith("TOPIC-")) {
      const chapterId = type.split("-")[1];
      const reorderedTopics = Array.from(localTopics[chapterId] || []);
      const [removed] = reorderedTopics.splice(source.index, 1);
      reorderedTopics.splice(destination.index, 0, removed);
      
      setLocalTopics({
        ...localTopics,
        [chapterId]: reorderedTopics
      });

      // Update order in backend
      try {
        await axios.post("http://localhost:5000/api/drag-and-drop/reorder-topics", {
          topicIds: reorderedTopics.map(t => t.id)
        });
      } catch (error) {
        console.error("Error reordering topics:", error);
      }
      return;
    }

    // Subtopic reordering
    if (type.startsWith("SUBTOPIC-")) {
      const topicId = type.split("-")[1];
      const reorderedSubtopics = Array.from(localSubtopics[topicId] || []);
      const [removed] = reorderedSubtopics.splice(source.index, 1);
      reorderedSubtopics.splice(destination.index, 0, removed);
      
      setLocalSubtopics({
        ...localSubtopics,
        [topicId]: reorderedSubtopics
      });

      // Update order in backend
      try {
        await axios.post("http://localhost:5000/api/drag-and-drop/reorder-subtopics", {
          subtopicIds: reorderedSubtopics.map(st => st.id)
        });
      } catch (error) {
        console.error("Error reordering subtopics:", error);
      }
      return;
    }
  };

  if (loading) return <div className="loading">Loading chapters...</div>;

  return (
   <DragDropContext onDragEnd={handleDragEnd}>
      <div className="horizontal-chapters-container">
        <Droppable 
          droppableId="chapters" 
          type="CHAPTER"
          direction="horizontal"
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="horizontal-chapters-list"
            >
              {localChapters.map((chapter, chapterIndex) => (
                <Draggable
                  key={chapter.id}
                  draggableId={`chapter-${chapter.id}`}
                  index={chapterIndex}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`chapter-card ${snapshot.isDragging ? 'dragging' : ''}`}
                    >
                      {/* Chapter Header */}
                      <div className="chapter-header">
                        {editingChapterId === chapter.id ? (
                          <>
                            <input
                              type="text"
                              value={editedChapterTitle}
                              onChange={(e) => setEditedChapterTitle(e.target.value)}
                              className="edit-input"
                            />
                            <button
                              className="save-btn"
                              onClick={() => handleSaveChapterEdit(chapter.id)}
                            >
                              ✅
                            </button>
                            <button
                              className="cancel-btn"
                              onClick={() => setEditingChapterId(null)}
                            >
                              ✖
                            </button>
                          </>
                        ) : (
                          <>
                            <h5 className="chapter-title">
                              Chapter {chapterIndex + 1}: {chapter.chapter}
                            </h5>
                            <div className="chapter-actions">
                              <button
                                className="edit-btn"
                                onClick={() => handleEditChapter(chapter)}
                              >
                                ✎
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => handleDeleteChapter(chapter.id)}
                              >
                                ×
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                       {/* Add Topic */}
                      <div className="add-section">
                        <input
                          type="text"
                          value={topicInputs[chapter.id] || ""}
                          onChange={(e) =>
                            handleTopicInputChange(chapter.id, e.target.value)
                          }
                          placeholder="New Topic Name"
                          className="add-input"
                        />
                        <button
                          className="add-btn"
                          onClick={() => handleAddTopic(chapter.id)}
                        >
                          +
                        </button>
                      </div>

                      {/* Topics */}
                      <Droppable
                        droppableId={`topics-${chapter.id}`}
                        type={`TOPIC-${chapter.id}`}
                      >
                        {(provided) => (
                          <ul
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="topics-list"
                          >
                            {(localTopics[chapter.id] || []).map((topic, topicIndex) => (
                              <Draggable
                                key={topic.id}
                                draggableId={`topic-${topic.id}`}
                                index={topicIndex}
                              >
                                {(provided) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="topic-item"
                                  >
                                    <div className="topic-header">
                                      <div {...provided.dragHandleProps} className="drag-handle">
                                        ☰
                                      </div>
                                            {editingTopicId === topic.id ? (
                                        <>
                                          <input
                                            type="text"
                                            value={editedTopicTitle}
                                            onChange={(e) => setEditedTopicTitle(e.target.value)}
                                            className="edit-input"
                                          />
                                          <button
                                            className="save-btn"
                                            onClick={() =>
                                              handleSaveTopicEdit(chapter.id, topic.id)
                                            }
                                          >
                                            ✅
                                          </button>
                                          <button
                                            className="cancel-btn"
                                            onClick={() => setEditingTopicId(null)}
                                          >
                                            ✖
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <div className="topic-name">
                                            {chapterIndex + 1}.{topicIndex + 1} {topic.topic}
                                          </div>
                                          <div className="topic-actions">
                                            <button
                                              className="edit-btn"
                                              onClick={() => handleEditTopic(topic.id, topic.topic)}
                                            >
                                              ✎
                                            </button>
                                            <button
                                              className="delete-btn"
                                              onClick={() =>
                                                handleDeleteTopic(chapter.id, topic.id)
                                              }
                                            >
                                              ×
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </div>

                                    {/* Add Subtopic */}
                                    <div className="add-section">
                                      <input
                                        type="text"
                                        value={subtopicInputs[topic.id] || ""}
                                        onChange={(e) =>
                                          handleSubtopicInputChange(topic.id, e.target.value)
                                        }
                                        placeholder="New Subtopic Name"
                                        className="add-input"
                                      />
                                      <button
                                        className="add-btn"
                                        onClick={() => handleAddSubtopic(topic.id)}
                                      >
                                        +
                                      </button>
                                    </div>

                                    {/* Subtopics */}
                                     <Droppable
                                      droppableId={`subtopics-${topic.id}`}
                                      type={`SUBTOPIC-${topic.id}`}
                                    >
                                      {(provided) => (
                                        <ul
                                          ref={provided.innerRef}
                                          {...provided.droppableProps}
                                          className="subtopics-lists"
                                        >
                                          {(localSubtopics[topic.id] || []).map(
                                            (subtopic, subtopicIndex) => (
                                              <Draggable
                                                key={subtopic.id}
                                                draggableId={`subtopic-${subtopic.id}`}
                                                index={subtopicIndex}
                                              >
                                                {(provided) => (
                                                  <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className="subtopic-item"
                                                  >
                                                    <div className="subtopic-header">
                                                      <div {...provided.dragHandleProps} className="drag-handle">
                                                        ☰
                                                      </div>
                                                      {editingSubtopicId === subtopic.id ? (
                                                        <>
                                                          <input
                                                            type="text"
                                                            value={editedSubtopicTitle}
                                                            onChange={(e) =>
                                                              setEditedSubtopicTitle(e.target.value)
                                                            }
                                                            className="edit-input"
                                                          />
                                                          <button
                                                            className="save-btn"
                                                            onClick={() =>
                                                              handleSaveSubtopicEdit(topic.id, subtopic.id)
                                                            }
                                                          >
                                                            ✅
                                                          </button>
                                                          <button
                                                            className="cancel-btn"
                                                            onClick={() => setEditingSubtopicId(null)}
                                                          >
                                                            ✖
                                                          </button>
                                                        </>
                                                      ) : (
                                                        <>
                                                          <div
                                                            onClick={() =>
                                                              setSelectedSubtopicId(subtopic.id)
                                                            }
                                                            className="subtopic-name"
                                                          >
                                                            {chapterIndex + 1}.{topicIndex + 1}.
                                                            {subtopicIndex + 1} {subtopic.subTopic}
                                                          </div>
                                                          <div className="subtopic-actions">
                                                            <button
                                                              className="edit-btn"
                                                              onClick={() =>
                                                                handleEditSubtopic(
                                                                  subtopic.id,
                                                                  subtopic.subTopic
                                                                )
                                                              }
                                                            >
                                                              ✎
                                                            </button>
                                                            <button
                                                              className="delete-btn"
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteSubtopic(topic.id, subtopic.id);
                                                              }}
                                                            >
                                                              ×
                                                            </button>
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  </li>
                                                )}
                                              </Draggable>
                                            )
                                          )}
                                          {provided.placeholder}
                                        </ul>
                                      )}
                                    </Droppable>
                                  </li>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </ul>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Add Chapter */}
        <div className="add-chapter-section">
          <input
            type="text"
            value={chapterInputs["new"] || ""}
            onChange={(e) => handleChapterInputChange(e.target.value)}
            placeholder="New Chapter Name"
            className="add-input"
          />
          <button className="add-btn" onClick={handleAddChapter}>
            +
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default ChapterContents;