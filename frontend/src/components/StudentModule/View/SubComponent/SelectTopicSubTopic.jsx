import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChapterContent from '../MainComponent/ExploreMaterial/ChapterContent';
const SelectTopicSubTopic = ({ selectedSubject,username, subTopicData }) => {
  console.log("ad",subTopicData);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState({});
  const [subtopics, setSubtopics] = useState({});
  const [selectedContent, setSelectedContent] = useState(null);
  const [content, setContent] = useState({});

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

  useEffect(() => {
    const fetchContent = async () => {
      if (selectedContent) {
        try {
          const response = await axios.get(`http://localhost:5000/api/content/${selectedContent.id}`);
          setContent(response.data);
          
        } catch (error) {
          console.error('Error fetching content:', error);
        }
      }
    };
    fetchContent();
  }, [selectedContent]);

  const onSelectContent = (id, type) => {
    setSelectedContent({ id, type });
    console.log(`Selected ${type}: ${id}`);
  };

//   const groupContentBySubTopicAndLevel = (content, subTopic) => {
// console.log("content",content);
//     const groupedContent = {};

//     content.forEach((item) => {
//       const { id, subTopicId, level, title, description, link, rating } = item;

//       // Ensure subTopicId exists in the grouping
//       if (!groupedContent[subTopicId]) {
//         groupedContent[subTopicId] = {
//           title: `SubTopic: ${subTopicId}`, // Provide a generic title if none exists
//           levels: {
//             basic: [],
//             medium: [],
//             advanced: [],
//           },

//         };
//       }

//       // Push the content into the appropriate level
//       groupedContent[subTopicId].levels[level]?.push({ id, title, description, link, rating });
//     });

//     return groupedContent;
//   };
//   const groupedContent = groupContentBySubTopicAndLevel(content, subtopics);
  

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
                          <button onClick={() => onSelectContent(subtopic.id, 'subtopic')}>
                            {chapterIndex + 1}.{topicIndex + 1}.{subtopicIndex + 1} {subtopic.subTopic}
                          </button>
                          {/* <div>
            {Object.keys(groupedContent).length > 0 ? (
              Object.entries(groupedContent).map(([subTopicId, subTopicData]) => (
                <div key={subTopicId}>
                  <ChapterContent subTopicData={subTopicData} username={username} id={subTopicId} topicId={topic} />
                </div>
              ))
            ) : (
              // <PageNotFound message="Please select the Subtopics" />

              <SelectTopicSubTopic selectedSubject={selectedSubject} username={username} subTopicData={groupedContent} />
            )}
          </div> */}
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
    </div>
  );
};

export default SelectTopicSubTopic;