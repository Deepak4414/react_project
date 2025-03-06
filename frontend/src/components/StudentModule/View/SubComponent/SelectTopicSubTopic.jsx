import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SelectTopicSubTopic = ({ selectedSubject }) => {
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState({});
  const [subtopics, setSubtopics] = useState({});
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chapter/${selectedSubject}`);
        setChapters(response.data.chapter);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };
    if (selectedSubject) fetchChapters();
  }, [selectedSubject]);

  useEffect(() => {
    const fetchTopicsAndSubtopics = async () => {
      let topicsData = {};
      let subtopicsData = {};

      for (let chapter of chapters) {
        try {
          const topicResponse = await axios.get(`http://localhost:5000/api/topics/${chapter.id}`);
          topicsData[chapter.id] = topicResponse.data.topics;

          for (let topic of topicResponse.data.topics) {
            try {
              const subtopicResponse = await axios.get(`http://localhost:5000/api/subtopics/${topic.id}`);
              subtopicsData[topic.id] = subtopicResponse.data;
            } catch (subtopicError) {
              console.error('Error fetching subtopics:', subtopicError);
            }
          }
        } catch (topicError) {
          console.error('Error fetching topics:', topicError);
        }
      }

      setTopics(topicsData);
      setSubtopics(subtopicsData);
    };

    if (chapters.length > 0) fetchTopicsAndSubtopics();
  }, [chapters]);

  const onSelectContent = (id, type) => {
    setSelectedContent({ id, type });
    console.log(`Selected ${type}: ${id}`);
  };

  return (
    <div className="two-column-page">
      <div className="left-columns">
        <h3>Chapters</h3>
        <ul className='chapter-lists'>
          {chapters.map((chapter, chapterIndex) => (
            <li key={chapter.id}>
              <p onClick={() => onSelectContent(chapter.id, 'chapter')}>
                {chapterIndex + 1}. {chapter.chapter}
              </p>
              <ul className="topics-lists">
                {(topics[chapter.id] || []).map((topic, topicIndex) => (
                  <li key={topic.id}>
                    <p onClick={() => onSelectContent(topic.id, 'topic')}>
                      {chapterIndex + 1}.{topicIndex + 1} {topic.topic}
                    </p>
                    <ul className="subtopics-lists">
                      {(subtopics[topic.id] || []).map((subtopic, subtopicIndex) => (
                        <li key={subtopic.id}>
                          <p onClick={() => onSelectContent(subtopic.id, 'subtopic')}>
                            {chapterIndex + 1}.{topicIndex + 1}.{subtopicIndex + 1} {subtopic.subTopic}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      {/* {selectedContent && (
        <p>
          Selected {selectedContent.type}: {selectedContent.id}
        </p>
      )} */}
    </div>
  );
};

export default SelectTopicSubTopic;