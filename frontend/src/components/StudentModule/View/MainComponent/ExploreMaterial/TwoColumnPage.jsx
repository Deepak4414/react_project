import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../Css/TwoColumnPage.css";
import ChapterContent from "./ChapterContent";
import PageNotFound from "../../SubComponent/PageNotFound";
import SelectTopicSubTopic from "../../SubComponent/SelectTopicSubTopic";

const TwoColumnPage = ({ selectedSubject, username }) => {
  const [chapters, setChapters] = useState([]);
  const [chapterTopics, setChapterTopics] = useState({});
  const [topicSubtopics, setTopicSubtopics] = useState({});
  const [selectedSubtopicId, setSelectedSubtopicId] = useState(null);
  const [content, setContent] = useState([]);
  const [forceExpandState, setForceExpandState] = useState({
    chapterId: null,
    topicId: null,
    subtopicId: null,
  });
  const [expandedChapters, setExpandedChapters] = useState({});
  // Initialize all chapters as expanded when data loads
  useEffect(() => {
    if (chapters.length > 0 && Object.keys(expandedChapters).length === 0) {
      const initialExpanded = {};
      chapters.forEach((chapter) => {
        initialExpanded[chapter.id] = true; // Start with all chapters expanded
      });
      setExpandedChapters(initialExpanded);

      // Load topics for all chapters initially
      chapters.forEach((chapter) => {
        fetchTopicsForChapter(chapter.id);
      });
    }
  }, [chapters]);
  // Fetch chapters and their topics when the subject changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const chaptersResponse = await axios.get(
          `http://localhost:5000/api/chapter/${selectedSubject}`
        );
        setChapters(chaptersResponse.data.chapter);

        setChapterTopics({});
        setTopicSubtopics({});
        setSelectedSubtopicId(null);
        setContent([]);
        setExpandedChapters({});
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (selectedSubject) fetchData();
  }, [selectedSubject]);

  // Handle forced expansion from SelectTopicSubTopic
  useEffect(() => {
    if (forceExpandState.subtopicId) {
      const { chapterId, topicId, subtopicId } = forceExpandState;

      // First expand the chapter if not already expanded
      if (!chapterTopics[chapterId]) {
        fetchTopicsForChapter(chapterId);
      }

      // Then expand the topic if not already expanded
      if (!topicSubtopics[topicId]) {
        fetchSubtopicsForTopic(topicId);
      }

      // Finally select the subtopic
      handleSubtopicSelect(subtopicId);

      // Reset force state
      setForceExpandState({ chapterId: null, topicId: null, subtopicId: null });
    }
  }, [forceExpandState, chapterTopics, topicSubtopics]);

  const fetchTopicsForChapter = async (chapterId) => {
    try {
      const topicsResponse = await axios.get(
        `http://localhost:5000/api/topics/${chapterId}`
      );
      setChapterTopics((prev) => ({
        ...prev,
        [chapterId]: topicsResponse.data.topics,
      }));
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };
  const fetchSubtopicsForTopic = async (topicId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/subtopics/${topicId}`
      );
      setTopicSubtopics((prev) => ({
        ...prev,
        [topicId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching subtopics:", error);
    }
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleTopicClick = async (topicId) => {
    try {
      if (topicSubtopics[topicId]) {
        setTopicSubtopics((prev) => {
          const newState = { ...prev };
          delete newState[topicId];
          return newState;
        });
      } else {
        await fetchSubtopicsForTopic(topicId);
      }
      setSelectedSubtopicId(null);
      setContent([]);
    } catch (error) {
      console.error("Error fetching subtopics:", error);
    }
  };

  const handleSubtopicSelect = async (subtopicId) => {
    setSelectedSubtopicId(subtopicId);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/content/${subtopicId}`
      );
      setContent(response.data);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const handleSubtopicSelectFromGrid = (chapterId, topicId, subtopicId) => {
    setForceExpandState({ chapterId, topicId, subtopicId });
  };

  const groupContentBySubTopicAndLevel = (content) => {
    const groupedContent = {};
    content.forEach((item) => {
      const { id, subTopicId, level, title, description, link, rating } = item;
      if (!groupedContent[subTopicId]) {
        groupedContent[subTopicId] = {
          title: `SubTopic: ${subTopicId}`,
          levels: { basic: [], medium: [], advanced: [] },
        };
      }
      groupedContent[subTopicId].levels[level]?.push({
        id,
        title,
        description,
        link,
        rating,
      });
    });
    return groupedContent;
  };
  const groupedContent = groupContentBySubTopicAndLevel(content);

  return (
    <div className="two-column-page">
      <div className="left-column">
        <h2>Contents</h2>
        {chapters.map((chapter, chapterIndex) => (
          <div key={chapter.id} className="chapter-section">
            <h5
              className="chapter-heading"
              onClick={() => toggleChapter(chapter.id)}
            >
              <span>
                {chapterIndex + 1}. {chapter.chapter}
              </span>
              <span className="toggle-icon">
                {expandedChapters[chapter.id] ? "−" : "+"}
              </span>
            </h5>

            {expandedChapters[chapter.id] &&
              chapterTopics[chapter.id]?.map((topic, topicIndex) => (
                <div key={topic.id} className="topic-section">
                  <button
                    onClick={() => handleTopicClick(topic.id)}
                    className="topic-button"
                  >
                    {chapterIndex + 1}.{topicIndex + 1} {topic.topic}
                  </button>

                  {topicSubtopics[topic.id] && (
                    <ul className="subtopics-list">
                      {topicSubtopics[topic.id].map(
                        (subtopic, subtopicIndex) => (
                          <li key={subtopic.id}>
                            <button
                              onClick={() => handleSubtopicSelect(subtopic.id)}
                              className={
                                subtopic.id === selectedSubtopicId
                                  ? "active"
                                  : ""
                              }
                            >
                              {chapterIndex + 1}.{topicIndex + 1}.
                              {subtopicIndex + 1} {subtopic.subTopic}
                            </button>
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="right-column">
        {selectedSubtopicId ? (
          Object.keys(groupedContent).length > 0 ? (
            Object.entries(groupedContent).map(([subTopicId, subTopicData]) => {
              // Find the current subtopic details
              const currentSubTopic = Object.values(topicSubtopics)
                .flat()
                .find(subtopic => subtopic.id === selectedSubtopicId);
              
              return (
                <div key={subTopicId}>
                  <ChapterContent
                    subTopicData={subTopicData}
                    username={username}
                    id={subTopicId}
                    topicId={Object.keys(topicSubtopics).find((topicId) =>
                      topicSubtopics[topicId].some(
                        (st) => st.id === selectedSubtopicId
                      )
                    )}
                    subject={selectedSubject}
                    subTopicName={currentSubTopic?.subTopic || "Untitled Subtopic"} // Pass the subtopic name
                  />
                </div>
              );
            })
          ) : (
            <PageNotFound message="No content available for this subtopic" />
          )
        ) : (
          <SelectTopicSubTopic
            selectedSubject={selectedSubject}
            username={username}
            onSubtopicSelect={handleSubtopicSelectFromGrid}
          />
        )}
      </div>
    </div>
  );
};


export default TwoColumnPage;
