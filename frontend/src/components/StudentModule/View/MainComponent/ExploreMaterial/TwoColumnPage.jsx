import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../Css/TwoColumnPage.css';
import ChapterContent from './ChapterContent';
import PageNotFound from '../../SubComponent/PageNotFound';

const TwoColumnPage = ({ selectedSubject,username }) => {
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState(null);
  const [content, setContent] = useState([]);

  // Fetch topics when the subject changes
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/topics/${selectedSubject}`);
        setTopics(response.data.topics);
        // Reset state when subject changes
        setSubtopics([]);
        setSelectedTopicId(null);
        setSelectedSubtopicId(null);
        setContent([]);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };
    if (selectedSubject) fetchTopics();
  }, [selectedSubject]);

  // Fetch subtopics when a topic is selected
  const handleTopicSelect = async (topicId) => {
    setSelectedTopicId(topicId);
    setSelectedSubtopicId(null);
    setContent([]);

    try {
      const response = await axios.get(`http://localhost:5000/api/subtopics/${topicId}`);
      setSubtopics(response.data);
    } catch (error) {
      console.error('Error fetching subtopics:', error);
    }
  };

  // Fetch content when a subtopic is selected
  const handleSubtopicSelect = async (subtopicId) => {
    setSelectedSubtopicId(subtopicId);
    setContent([]);

    try {
      const response = await axios.get(`http://localhost:5000/api/content/${subtopicId}`);
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };
  const groupContentBySubTopicAndLevel = (content,subTopic) => {
    
    const groupedContent = {};

    content.forEach((item) => {
      const { id,subTopicId, level, title, description, link, rating } = item;

      // Ensure subTopicId exists in the grouping
      if (!groupedContent[subTopicId]) {
        groupedContent[subTopicId] = {
          title: `SubTopic: ${subTopicId}`, // Provide a generic title if none exists
          levels: {
            basic: [],
            medium: [],
            advanced: [],
          },
       
        };
      }

      // Push the content into the appropriate level
      groupedContent[subTopicId].levels[level]?.push({ id,title, description, link, rating });
    });

    return groupedContent;
  };

  const groupedContent = groupContentBySubTopicAndLevel(content,subtopics);
  return (
    <div className="two-column-page">
      {/* Left Column: Topics and Subtopics */}
      <div className="left-column">
        
        <h3>Chapter</h3>
        <ul>
          {topics.map((topic,index) => (
            <li key={topic.id}>
              <button
                onClick={() => handleTopicSelect(topic.id)}
                className={topic.id === selectedTopicId ? 'active' : ''}
              >
                {/* {index+1}: {topic.topic} */}
                Unit {index+1}
              </button>
              {selectedTopicId === topic.id && (
                <ul className="subtopics-list">
                  {subtopics.map((subtopic,subtopicindex) => (
                    <li key={subtopic.id}>
                      <button
                        onClick={() => handleSubtopicSelect(subtopic.id)}
                        className={subtopic.id === selectedSubtopicId ? 'active' : ''}
                      >
                       {index+1}.{subtopicindex+1}:  {subtopic.subTopic}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Column: Grouped Content */}
      <div className="right-column">
  {selectedTopicId ? (
    <div>
      
      {Object.keys(groupedContent).length > 0 ? (
        Object.entries(groupedContent).map(([subTopicId, subTopicData]) => (
          <div key={subTopicId}>
           
            <ChapterContent subTopicData={subTopicData} username={username} id={subTopicId} />
          </div>
        ))
      ) : (
        <PageNotFound message="Please select Subtopics"/>
      )}
    </div>
  ) : (
    <PageNotFound message="Content is not available for this Subject"/>
  )}

      </div>

    </div>
  );
}

export default TwoColumnPage;