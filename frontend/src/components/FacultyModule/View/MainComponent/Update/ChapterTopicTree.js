// ChapterTopicTree.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './SelectTopicSubTopic.css'; // reuse existing styles

const ChapterTopicTree = ({ selectedSubject, onSubtopicClick }) => {
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState({});
  const [subtopics, setSubtopics] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSubject) return;
      try {
        setLoading(true);
        const chaptersRes = await axios.get(`http://localhost:5000/api/chapter/${selectedSubject}`);
        setChapters(chaptersRes.data.chapter);

        const topicsData = {};
        const subtopicsData = {};

        for (const chapter of chaptersRes.data.chapter) {
          const topicsRes = await axios.get(`http://localhost:5000/api/topics/${chapter.id}`);
          topicsData[chapter.id] = topicsRes.data.topics;

          for (const topic of topicsRes.data.topics) {
            const subtopicsRes = await axios.get(`http://localhost:5000/api/subtopics/${topic.id}`);
            subtopicsData[topic.id] = subtopicsRes.data;
          }
        }

        setTopics(topicsData);
        setSubtopics(subtopicsData);
      } catch (err) {
        console.error('Failed to load chapter/topic/subtopic data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSubject]);

  if (loading) return <div className="loading">Loading chapter list...</div>;

  return (
    <div className="chapters-grid">
      {chapters.map((chapter, chapterIndex) => (
        <div key={chapter.id} className="chapter-column">
          <h5 className="chapter-title">
            {chapterIndex + 1}. {chapter.chapter}
          </h5>
          <ul className="topics-list">
            {(topics[chapter.id] || []).map((topic, topicIndex) => (
              <li key={topic.id} className="topic-item">
                <div className="topic-name">
                  {chapterIndex + 1}.{topicIndex + 1} {topic.topic}
                </div>
                <ul className="subtopics-list">
                  {(subtopics[topic.id] || []).map((subtopic, subtopicIndex) => (
                    <li key={subtopic.id}>
                      <button
                        className="subtopic-button"
                        onClick={() => onSubtopicClick?.(chapter.id, topic.id, subtopic.id)}
                      >
                        {chapterIndex + 1}.{topicIndex + 1}.{subtopicIndex + 1} {subtopic.subTopic}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ChapterTopicTree;
