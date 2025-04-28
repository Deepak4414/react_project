import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChapterContent from '../MainComponent/ExploreMaterial/ChapterContent';
import '../../Css/TwoColumnPage.css';
import './SelectTopicSubTopic.css';

const SelectTopicSubTopic = ({ selectedSubject, username, onSubtopicSelect }) => {
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
        const chaptersRes = await axios.get(`http://localhost:5000/api/chapter/${selectedSubject}`);
        setChapters(chaptersRes.data.chapter);
        
        const topicsData = {};
        for (const chapter of chaptersRes.data.chapter) {
          const topicsRes = await axios.get(`http://localhost:5000/api/topics/${chapter.id}`);
          topicsData[chapter.id] = topicsRes.data.topics;
        }
        setTopics(topicsData);
        
        const subtopicsData = {};
        for (const chapter of chaptersRes.data.chapter) {
          for (const topic of topicsData[chapter.id] || []) {
            const subtopicsRes = await axios.get(`http://localhost:5000/api/subtopics/${topic.id}`);
            subtopicsData[topic.id] = subtopicsRes.data;
          }
        }
        setSubtopics(subtopicsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedSubject]);

  const handleSubtopicSelect = async (subtopic) => {
    if (onSubtopicSelect) {
      // Find the chapter and topic for this subtopic
      let chapterId, topicId;
      for (const chapter of chapters) {
        for (const topic of topics[chapter.id] || []) {
          if (subtopics[topic.id]?.some(st => st.id === subtopic.id)) {
            chapterId = chapter.id;
            topicId = topic.id;
            break;
          }
        }
        if (chapterId) break;
      }
      
      onSubtopicSelect(chapterId, topicId, subtopic.id);
      return;
    }
    
    setLoading(true);
    setSelectedSubtopicId(subtopic.id);
    try {
      const response = await axios.get(`http://localhost:5000/api/content/${subtopic.id}`);
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupContentBySubTopicAndLevel = (content) => {
    const grouped = {};
    content.forEach(item => {
      if (!grouped[item.subTopicId]) {
        grouped[item.subTopicId] = {
          title: `SubTopic: ${item.subTopicId}`,
          levels: { basic: [], medium: [], advanced: [] }
        };
      }
      grouped[item.subTopicId].levels[item.level]?.push(item);
    });
    return grouped;
  };

  const findTopicIdForSubtopic = (subtopicId) => {
    for (const topicId in subtopics) {
      if (subtopics[topicId].some(st => st.id === subtopicId)) {
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
                    {(subtopics[topic.id] || []).map((subtopic, subtopicIndex) => (
                      <li key={subtopic.id}>
                        <button
                          onClick={() => handleSubtopicSelect(subtopic)}
                          className="subtopic-button"
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
        
        {loading ? (
          <div className="loading">Loading content...</div>
        ) : Object.keys(groupedContent).length > 0 ? (
          Object.entries(groupedContent).map(([subTopicId, subTopicData]) => (
            <ChapterContent
              key={subTopicId}
              subTopicData={subTopicData}
              username={username}
              id={subTopicId}
              topicId={topicId}
            />
          ))
        ) : (
          <div className="no-content">No content available for this subtopic</div>
        )}
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