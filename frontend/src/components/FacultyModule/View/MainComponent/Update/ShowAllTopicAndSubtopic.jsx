import React, { useEffect, useState } from "react";
import axios from "axios";
// import ChapterContent from './MainComponent/ExploreMaterial/ChapterContent';
import "../../../Css/ShowAllTopicAndSubtopic.css";

const SelectTopicSubTopic = ({ selectedSubject }) => {
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState({});
  const [subtopics, setSubtopics] = useState({});
  const [selectedSubtopicId, setSelectedSubtopicId] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSubject) return;

      try {
        setLoading(true);
        const chaptersRes = await axios.get(
          `http://localhost:5000/api/chapter/${selectedSubject}`
        );
        setChapters(chaptersRes.data.chapter);

        const topicsData = {};
        for (const chapter of chaptersRes.data.chapter) {
          const topicsRes = await axios.get(
            `http://localhost:5000/api/topics/${chapter.id}`
          );
          topicsData[chapter.id] = topicsRes.data.topics;
        }
        setTopics(topicsData);

        const subtopicsData = {};
        for (const chapter of chaptersRes.data.chapter) {
          for (const topic of topicsData[chapter.id] || []) {
            const subtopicsRes = await axios.get(
              `http://localhost:5000/api/subtopics/${topic.id}`
            );
            subtopicsData[topic.id] = subtopicsRes.data;
          }
        }
        setSubtopics(subtopicsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSubject]);

  

  const groupContentBySubTopicAndLevel = (content) => {
    const grouped = {};
    content.forEach((item) => {
      if (!grouped[item.subTopicId]) {
        grouped[item.subTopicId] = {
          title: `SubTopic: ${item.subTopicId}`,
          levels: { basic: [], medium: [], advanced: [] },
        };
      }
      grouped[item.subTopicId].levels[item.level]?.push(item);
    });
    return grouped;
  };

  const findTopicIdForSubtopic = (subtopicId) => {
    for (const topicId in subtopics) {
      if (subtopics[topicId].some((st) => st.id === subtopicId)) {
        return topicId;
      }
    }
    return null;
  };

  const renderChapterColumns = () => {
    if (loading) return <div className="loading">Loading chapters...</div>;

    return (
      <div className="chapters-grid">
        {chapters.map((chapter, chapterIndex) => (
          <div key={chapter.id} className="chapter-column">
            <h5 className="chapter-title">
              {chapterIndex + 1}. {chapter.chapter}
            </h5>

            {/* Topics for this chapter */}
            <ul className="topics-list">
              {(topics[chapter.id] || []).map((topic, topicIndex) => (
                <li key={topic.id} className="topic-item">
                  <div className="topic-name">
                    {chapterIndex + 1}.{topicIndex + 1} {topic.topic}
                  </div>

                  {/* Subtopics for this topic */}
                  <ul className="subtopics-list">
                    {(subtopics[topic.id] || []).map(
                      (subtopic, subtopicIndex) => (
                        <li key={subtopic.id}>
                          <div style={{
                                padding: "6px 10px",
                                margin: "4px 0",
                                backgroundColor: "#f0f0f0",
                                borderRadius: "4px",
                                fontSize: "14px",
                                color: "#333",
                            }}>
                            {chapterIndex + 1}.{topicIndex + 1}.
                            {subtopicIndex + 1} {subtopic.subTopic}
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const renderContentView = () => {
    const groupedContent = groupContentBySubTopicAndLevel(content);
    const topicId = findTopicIdForSubtopic(selectedSubtopicId);

    return (
      <div className="content-view">
        <button
          className="back-button"
          onClick={() => setSelectedSubtopicId(null)}
        >
          ← Back to Chapters
        </button>
      </div>
    );
  };

  return (
    <div className="explore-container">
      {selectedSubtopicId ? renderContentView() : renderChapterColumns()}
    </div>
  );
};

export default SelectTopicSubTopic;
