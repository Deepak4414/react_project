import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../Css/TwoColumnPage.css';
import ChapterContent from './ChapterContent';
import PageNotFound from '../../SubComponent/PageNotFound';
import SelectTopicSubTopic from '../../SubComponent/SelectTopicSubTopic';
const TwoColumnPage = ({ selectedSubject, username }) => {
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState(null);
  const [content, setContent] = useState([]);

  // Fetch chapters when the subject changes
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chapter/${selectedSubject}`);
        setChapters(response.data.chapter);
        // Reset state when subject changes
        setTopics([]);
        setSubtopics([]);
        setSelectedChapterId(null);
        setSelectedTopicId(null);
        setSelectedSubtopicId(null);
        setContent([]);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };
    if (selectedSubject) fetchChapters();
  }, [selectedSubject]);

  // Fetch topics when a chapter is selected
  const handleChapterSelect = async (chapterId) => {
    setSelectedChapterId(chapterId);
    setTopics([]);
    setSubtopics([]);
    setSelectedTopicId(null);
    setSelectedSubtopicId(null);
    setContent([]);

    try {
      const response = await axios.get(`http://localhost:5000/api/topics/${chapterId}`);
      setTopics(response.data.topics);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  // Fetch subtopics when a topic is selected
  const handleTopicSelect = async (topicId) => {
    setSelectedTopicId(topicId);
    setSubtopics([]);
    setSelectedSubtopicId(null);
    setContent([]);

    try {
      const response = await axios.get(`http://localhost:5000/api/subtopics/${topicId}`);
      // console.log('Subtopics:', response.data);
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
  const groupContentBySubTopicAndLevel = (content) => {

    const groupedContent = {};

    content.forEach((item) => {
      const { id, subTopicId, level, title, description, link, rating } = item;

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
      groupedContent[subTopicId].levels[level]?.push({ id, title, description, link, rating });
    });

    return groupedContent;
  };
  const groupedContent = groupContentBySubTopicAndLevel(content);
  return (
    <div className="two-column-page">
      {/* Left Column: Chapters, Topics, and Subtopics */}
      <div className="left-column">
        <h3>Chapters</h3>
        <ul className='chapter-list'>
          {chapters.map((chapter, chapterindex) => (
            <li key={chapter.id}>
              <button
                onClick={() => handleChapterSelect(chapter.id)}
                className={chapter.id === selectedChapterId ? 'active' : ''}
              >
                {chapter.chapter}

              </button>
              {selectedChapterId === chapter.id && (
                <ul className="topics-list">
                  {topics.map((topic,topicindex) => (
                    <li key={topic.id}>
                      <button
                        onClick={() => handleTopicSelect(topic.id)}
                        className={topic.id === selectedTopicId ? 'active' : ''}
                      >
                        {chapterindex+1}.{topicindex+1} {topic.topic}
                      </button>
                      {selectedTopicId === topic.id && (
                        <ul className="subtopics-list">
                          {subtopics.map((subtopic,subtopicindex) => (
                            <li key={subtopic.id}>
                              <button
                                onClick={() => handleSubtopicSelect(subtopic.id)}
                                className={subtopic.id === selectedSubtopicId ? 'active' : ''}
                              >
                                {chapterindex+1}.{topicindex+1}.{subtopicindex+1}  {subtopic.subTopic}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
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
                  <ChapterContent subTopicData={subTopicData} username={username} id={subTopicId} topicId={selectedTopicId} />
                </div>
              ))
            ) : (
              <PageNotFound message="Please select the Subtopics" />

              // <SelectTopicSubTopic selectedSubject={selectedSubject} username={username} subTopicData={groupedContent} />
            )}
          </div>
        ) : (
          <PageNotFound message="Please select the Topics" />
          // <SelectTopicSubTopic selectedSubject={selectedSubject} />
        )}

      </div>

    </div>
  );
}

export default TwoColumnPage;
