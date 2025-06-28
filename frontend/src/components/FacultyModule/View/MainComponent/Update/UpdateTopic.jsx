import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../Css/ShowAllTopicAndSubtopic.css";
import LinkEditor from "./LinkEditor"; // Adjust path as needed
import ChapterContents from "./ChapterContents"; // Adjust the path if needed
import TwoColumnPageForFaculty from "./TwoColumnPageForFaculty"; // Adjust the path if needed
import TwoColumnPage from "../../../../StudentModule/View/MainComponent/ExploreMaterial/TwoColumnPage"; // Adjust the path if needed
import DeleteConfirmModal from "./ConfirmDeleteModal"; // Adjust the path if needed

const UpdateTopic = () => {
  const location = useLocation();
  const { course, branch, semester, subject } = location.state || {};
  const [username, setUsername] = useState("");
  const [subTopicData, setSubTopicData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState({});
  const [subtopics, setSubtopics] = useState({});
  const [selectedSubtopicId, setSelectedSubtopicId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [editedChapterTitle, setEditedChapterTitle] = useState("");
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [editedTopicTitle, setEditedTopicTitle] = useState("");
  const [editingSubtopicId, setEditingSubtopicId] = useState(null);
  const [editedSubtopicTitle, setEditedSubtopicTitle] = useState("");
  const [topicId, setTopicId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSubtopicModalInfo, setDeleteSubtopicModalInfo] = useState({
    open: false,
    topicId: null,
    subtopicId: null,
  });

  const [deleteTopicModalInfo, setDeleteTopicModalInfo] = useState({
    open: false,
    topicId: null,
  });

  const [deleteChapterModalInfo, setDeleteChapterModalInfo] = useState({
    open: false,
    chapterId: null,
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [globalPreview, setGlobalPreview] = useState(false);

  // For editing links
  const [levels, setLevels] = useState({
    basic: [],
    medium: [],
    advanced: [],
  });
  const [nptelVideos, setNptelVideos] = useState([]);
  const [videoNames, setVideoNames] = useState([]);

  // Input states
  const [chapterInputs, setChapterInputs] = useState({});
  const [topicInputs, setTopicInputs] = useState({});
  const [subtopicInputs, setSubtopicInputs] = useState({});
  const [subjectName, setSubjectName] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userState"));
    setUsername(storedUser?.username || "");
  }, []);
  // Fetch subject name
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/subject-name/${subject}`)
      .then((response) => {
        setSubjectName(response.data[0]?.subjectName || "");
      });
  }, [subject]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!subject) return;

      try {
        setLoading(true);

        // Fetch chapters
        const chaptersRes = await axios.get(
          `http://localhost:5000/api/chapter/${subject}`
        );
        const chaptersList = chaptersRes.data.chapter || [];
        setChapters(chaptersList);

        // Fetch topics
        const topicsData = {};
        const topicInputsData = {};
        for (const chapter of chaptersList) {
          const topicsRes = await axios.get(
            `http://localhost:5000/api/topics/${chapter.id}`
          );
          topicsData[chapter.id] = topicsRes.data.topics || [];
          topicInputsData[chapter.id] = "";
        }
        setTopics(topicsData);
        setTopicInputs(topicInputsData);

        // Fetch subtopics
        const subtopicsData = {};
        const subtopicInputsData = {};
        const subtopicFetchPromises = [];

        for (const chapter of chaptersList) {
          for (const topic of topicsData[chapter.id] || []) {
            const fetch = axios
              .get(`http://localhost:5000/api/subtopics/${topic.id}`)
              .then((res) => {
                subtopicsData[topic.id] = res.data || [];
                subtopicInputsData[topic.id] = "";
              })
              .catch((err) => {
                console.error(
                  `Error fetching subtopics for topic ${topic.id}:`,
                  err
                );
                subtopicsData[topic.id] = [];
                subtopicInputsData[topic.id] = "";
              });

            subtopicFetchPromises.push(fetch);
          }
        }

        await Promise.all(subtopicFetchPromises);
        setSubtopics(subtopicsData);
        setSubtopicInputs(subtopicInputsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subject]);

  // Fetch NPTEL video names
  useEffect(() => {
    const fetchVideoNames = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/nptelvideos/${subject}`
        );
        setVideoNames(response.data[0] || []);
      } catch (error) {
        console.error("Error fetching video names:", error);
      }
    };

    if (subject) {
      fetchVideoNames();
    }
  }, [subject]);

  // Fetch links when subtopic is selected
  useEffect(() => {
    if (selectedSubtopicId) {
      // Fetch links for preview mode
      axios
        .get(`http://localhost:5000/api/content/${selectedSubtopicId}`)
        .then((response) => {
          const grouped = groupContentBySubTopicAndLevel(response.data);
          setSubTopicData(grouped[selectedSubtopicId]);
        })
        .catch((error) => console.error("Error fetching content:", error));

      // Fetch links for editor
      axios
        .get(`http://localhost:5000/api/links/${selectedSubtopicId}`)
        .then((response) => {
          const data = response.data || [];
          const categorizedLinks = { basic: [], medium: [], advanced: [] };

          data.forEach((link) => {
            if (categorizedLinks[link.level]) {
              categorizedLinks[link.level].push({
                id: link.id,
                title: link.title,
                link: link.link,
                description: link.description,
                rating: link.rating,
              });
            }
          });

          setLevels(categorizedLinks);
        })
        .catch((error) => console.error("Error fetching links:", error));

      // Fetch NPTEL videos
      axios
        .get(`http://localhost:5000/api/videos?subTopic=${selectedSubtopicId}`)
        .then((response) => {
          const data = response.data || [[], [], [], [], [], []];
          setNptelVideos(data);
        })
        .catch(() => setNptelVideos([]));
    }
  }, [selectedSubtopicId]);

  // Helper function to group content for ChapterContent component
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

  // Chapter CRUD operations
  const handleAddChapter = async () => {
    const newChapterName = chapterInputs["new"];
    if (!newChapterName?.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/add-chapter/add-chapter",
        {
          subjectId: subject,
          courseId: course,
          branchId: branch,
          semesterId: semester,
          chapterName: newChapterName,
        }
      );

      const newChapter = {
        id: response.data.chapter.id,
        chapter: response.data.chapter.chapterName,
      };

      setChapters([...chapters, newChapter]);
      setTopics({ ...topics, [newChapter.id]: [] });
      setChapterInputs({ ...chapterInputs, new: "" });
    } catch (error) {
      console.error("Error adding chapter:", error);
    }
  };

  const handleDeleteChapter = async (chapterId, password) => {
    try {
      if (!username) {
        alert("Username not available. Please login again.");
        return;
      }

      if (!password) {
        alert("Password is required.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/verify-password",
        {
          username,
          password,
        }
      );

      if (!res.data.success) {
        alert(res.data.message || "Password is incorrect.");
        return;
      }

      const deleteRes = await axios.delete(
        `http://localhost:5000/api/delete/delete-chapter/${chapterId}`
      );
      if (deleteRes.status === 200 || deleteRes.status === 204) {
        setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
        alert("Chapter deleted successfully.");
      } else {
        alert("Failed to delete Chapter. Try again later.");
      }
      setDeleteChapterModalInfo({ open: false, chapterId: null });

      const newTopics = { ...topics };
      delete newTopics[chapterId];
      setTopics(newTopics);
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  const handleEditChapter = (chapter) => {
    setEditingChapterId(chapter.id);
    setEditedChapterTitle(chapter.chapter);
  };

  const handleSaveChapterEdit = async (chapterId) => {
    if (!editedChapterTitle.trim()) return;

    try {
      await axios.put(
        `http://localhost:5000/api/update-chapter-name/chapters/${chapterId}`,
        { chapter: editedChapterTitle }
      );

      setChapters(
        chapters.map((chapter) =>
          chapter.id === chapterId
            ? { ...chapter, chapter: editedChapterTitle }
            : chapter
        )
      );
      setEditingChapterId(null);
    } catch (error) {
      console.error("Error updating chapter:", error);
    }
  };

  // Topic CRUD operations
  const handleAddTopic = async (chapterId) => {
    const topicName = topicInputs[chapterId];
    if (!topicName?.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/add-topic/add-topic",
        {
          topicName,
          chapterId,
          subjectId: subject,
          courseId: course,
          branchId: branch,
          semesterId: semester,
        }
      );

      setTopics((prev) => ({
        ...prev,
        [chapterId]: [...(prev[chapterId] || []), response.data.topic],
      }));
      setTopicInputs({ ...topicInputs, [chapterId]: "" });
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  };

  const handleDeleteTopic = async (chapterId, topicId, password) => {
    try {
      if (!username) {
        alert("Username not available. Please login again.");
        return;
      }

      if (!password) {
        alert("Password is required.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/verify-password",
        {
          username,
          password,
        }
      );

      if (!res.data.success) {
        alert(res.data.message || "Password is incorrect.");
        return;
      }
      const deleteRes = await axios.delete(
        `http://localhost:5000/api/delete/delete-topic/${topicId}`
      );
      if (deleteRes.status === 200 || deleteRes.status === 204) {
        setTopics((prev) => ({
          ...prev,
          [chapterId]: prev[chapterId].filter((topic) => topic.id !== topicId),
        }));
        alert("Topic deleted successfully.");
      } else {
        alert("Failed to delete Topic. Try again later.");
      }
      setDeleteTopicModalInfo({ open: false, topicId: null });
      const newSubtopics = { ...subtopics };
      delete newSubtopics[topicId];
      setSubtopics(newSubtopics);
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  const handleEditTopic = (topicId, currentTitle) => {
    setEditingTopicId(topicId);
    setEditedTopicTitle(currentTitle);
  };

  const handleSaveTopicEdit = async (chapterId, topicId) => {
    if (!editedTopicTitle.trim()) return;

    try {
      await axios.put(
        `http://localhost:5000/api/update-topic-name/topics/${topicId}`,
        { topic: editedTopicTitle }
      );

      setTopics((prev) => ({
        ...prev,
        [chapterId]: prev[chapterId].map((topic) =>
          topic.id === topicId ? { ...topic, topic: editedTopicTitle } : topic
        ),
      }));
      setEditingTopicId(null);
    } catch (error) {
      console.error("Error updating topic:", error);
    }
  };

  // Subtopic CRUD operations
  const handleAddSubtopic = async (topicId) => {
    const subtopicName = subtopicInputs[topicId];
    if (!subtopicName?.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/add-subtopic/add-subtopic",
        { topicId, subtopicName }
      );

      setSubtopics((prev) => ({
        ...prev,
        [topicId]: [...(prev[topicId] || []), response.data.subtopic],
      }));
      setSubtopicInputs({ ...subtopicInputs, [topicId]: "" });
    } catch (error) {
      console.error("Error adding subtopic:", error);
    }
  };

  // const handleDeleteSubtopic = async (topicId, subtopicId) => {
  //   try {
  //     await axios.delete(
  //       `http://localhost:5000/api/delete/delete-subtopic/${subtopicId}`
  //     );

  //     setSubtopics((prev) => ({
  //       ...prev,
  //       [topicId]: (prev[topicId] || []).filter(
  //         (subtopic) => subtopic.id !== subtopicId
  //       ),
  //     }));
  //   } catch (error) {
  //     console.error("Error deleting subtopic:", error);
  //   }
  // };

  const handleDeleteSubtopic = async (topicId, subtopicId, password) => {
    try {
      if (!username) {
        alert("Username not available. Please login again.");
        return;
      }

      if (!password) {
        alert("Password is required.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/verify-password",
        {
          username,
          password,
        }
      );

      if (!res.data.success) {
        alert(res.data.message || "Password is incorrect.");
        return;
      }

      const deleteRes = await axios.delete(
        `http://localhost:5000/api/delete/delete-subtopic/${subtopicId}`
      );

      if (deleteRes.status === 200 || deleteRes.status === 204) {
        setSubtopics((prev) => ({
          ...prev,
          [topicId]: (prev[topicId] || []).filter(
            (subtopic) => subtopic.id !== subtopicId
          ),
        }));

        alert("Subtopic deleted successfully.");
      } else {
        alert("Failed to delete subtopic. Try again later.");
      }

      setDeleteSubtopicModalInfo({
        open: false,
        topicId: null,
        subtopicId: null,
      });
    } catch (error) {
      if (error.response) {
        alert(
          `Error: ${error.response.data?.message || "Server error occurred."}`
        );
      } else if (error.request) {
        alert("No response from server. Check your connection.");
      } else {
        alert("Unexpected error: " + error.message);
      }

      console.error("Error deleting subtopic:", error);
    }
  };

  const handleEditSubtopic = (subtopicId, currentTitle) => {
    setEditingSubtopicId(subtopicId);
    setEditedSubtopicTitle(currentTitle);
  };

  const handleSaveSubtopicEdit = async (topicId, subtopicId) => {
    if (!editedSubtopicTitle.trim()) return;

    try {
      await axios.put(
        `http://localhost:5000/api/update-subtopic-name/subtopics/${subtopicId}`,
        { subTopic: editedSubtopicTitle }
      );

      setSubtopics((prev) => ({
        ...prev,
        [topicId]: (prev[topicId] || []).map((subtopic) =>
          subtopic.id === subtopicId
            ? { ...subtopic, subTopic: editedSubtopicTitle }
            : subtopic
        ),
      }));
      setEditingSubtopicId(null);
    } catch (error) {
      console.error("Error updating subtopic:", error);
    }
  };

  // Link editor functions
  const handleDeleteLink = async (level, id) => {
    try {
      if (id && !String(id).startsWith("new-")) {
        await axios.delete(`http://localhost:5000/api/delete-link/${id}`);
      }

      setLevels((prev) => ({
        ...prev,
        [level]: prev[level].filter((link) => String(link.id) !== String(id)),
      }));
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const handleAddLink = (level) => {
    setLevels((prev) => ({
      ...prev,
      [level]: [
        ...prev[level],
        {
          id: `new-${Date.now()}`,
          title: "",
          link: "",
          description: "",
          rating: 0,
        },
      ],
    }));
  };

  const handleDeleteNptelLink = async (index) => {
    try {
      const videoId = nptelVideos[0]?.[index];
      if (videoId && !String(videoId).startsWith("new-")) {
        await axios.delete(
          `http://localhost:5000/api/delete/delete-nptel/${videoId}`
        );
      }

      setNptelVideos((prev) =>
        prev.map((arr) => arr.filter((_, i) => i !== index))
      );
    } catch (error) {
      console.error("Error deleting NPTEL link:", error);
    }
  };

  const handleAddNptelLink = () => {
    setNptelVideos((prev) => {
      const newVideos = prev.length > 0 ? [...prev] : [[], [], [], [], [], []];
      const newId = `new-${Date.now()}`;
      return [
        [...newVideos[0], newId],
        [...newVideos[1], ""],
        [...newVideos[2], ""],
        [...newVideos[3], ""],
        [...newVideos[4], ""],
        [...newVideos[5], ""],
      ];
    });
  };

  const handleChange = (e, level, index, field) => {
    setLevels((prev) => {
      const newLevels = { ...prev };
      newLevels[level][index][field] = e.target.value;
      return newLevels;
    });
  };

  const handleNptelChange = (e, index, fieldIndex) => {
    setNptelVideos((prev) => {
      const newVideos = [...prev];
      newVideos[fieldIndex][index] = e.target.value;
      return newVideos;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update regular links
      await axios.put(
        `http://localhost:5000/api/update-links/${selectedSubtopicId}`,
        { levels }
      );

      // Update NPTEL videos
      if (nptelVideos.length > 0 && nptelVideos[0].length > 0) {
        await axios.put(
          `http://localhost:5000/api/update-nptel/${selectedSubtopicId}`,
          {
            ids: nptelVideos[0],
            videos: nptelVideos[2],
            titles: nptelVideos[3],
            descriptions: nptelVideos[4],
            levels: nptelVideos[5],
            subTopic: selectedSubtopicId,
            folder_path: `D:/Videos/${subjectName}`,
          }
        );
      }

      for (const video of vfstrVideos) {
        const formData = new FormData();
        formData.append("id", video.id); // ✅ SEND ID (needed for update)
        formData.append("title", video.title);
        formData.append("description", video.description);
        formData.append("video", video.video);
        formData.append("videoLevel", video.videoLevel);
        formData.append("videoFile", video.textFile); // file may be null
        formData.append("level", video.videoLevel);
        formData.append("subject", subject);
        formData.append("topicId", topicId);
        formData.append("subTopicId", selectedSubtopicId);
        formData.append("facultyName", video.facultyName || ""); // Optional


        await axios.post(
          "http://localhost:5000/api/upload-vfstr-video",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      alert("Updated successfully!");
      // setSelectedSubtopicId(null);
    } catch (error) {
      console.error("Error updating links:", error);
    }
  };

  // Input handlers
  const handleChapterInputChange = (value) => {
    setChapterInputs({ ...chapterInputs, new: value });
  };

  const handleTopicInputChange = (chapterId, value) => {
    setTopicInputs({ ...topicInputs, [chapterId]: value });
  };

  const handleSubtopicInputChange = (topicId, value) => {
    setSubtopicInputs({ ...subtopicInputs, [topicId]: value });
  };

  const handlePreview = () => {
    setGlobalPreview(true);
  };

  // handle vfstr video upload
  const [vfstrVideos, setVfstrVideos] = useState([]);
  const [vfstrVideoNames, setVfstrVideoNames] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");

  useEffect(() => {
    const fetchVFSTRVideos = async () => {
      if (!selectedSubtopicId || !subject) return;

      setVfstrVideos([]);
      setVfstrVideoNames([]);

      try {
        const res = await axios.get("http://localhost:5000/api/vfstr-videos", {
          params: { subTopic: selectedSubtopicId },
        });

        const data = res.data || {};
        // Set video records to UI (even if empty)
        setVfstrVideos(
          (data.videofiles || []).map((v) => ({
            id: v.id,
            isNew: false,
            title: v.title,
            description: v.description,
            video: v.video_name,
            videoLevel: v.video_level,
            facultyName: v.faculty_name,
            textFile: null,
          }))
        );

        // If video files were returned, use them
        if (Array.isArray(data.videos) && data.videos.length > 0) {
          setVfstrVideoNames(data.videos);
        } else {
          // 🔁 Fallback: fetch video names using subjectId
          const fallbackRes = await axios.get(
            `http://localhost:5000/api/vfstrvideos/${subject}`
          );
          setVfstrVideoNames(fallbackRes.data[0] || []);
        }
      } catch (error) {
        console.error("Error fetching VFSTR videos:", error);

        // 🔁 If /vfstr-videos failed, still try to load filenames
        try {
          const fallbackRes = await axios.get(
            `http://localhost:5000/api/vfstrvideos/${subject}`
          );
          setVfstrVideoNames(fallbackRes.data[0] || []);
        } catch (err2) {
          console.error("Fallback video name fetch error:", err2);
        }
      }
    };

    fetchVFSTRVideos();
  }, [selectedSubtopicId, subject]);

  const handleDeleteVfstrLink = async (index) => {
    const video = vfstrVideos[index];
    const videoId = video.id;

    console.log("Deleting VFSTR video with ID:", videoId);

    try {
      // 🧠 Only call backend if it's not a newly created entry
      if (videoId && !String(videoId).startsWith("new-")) {
        await axios.delete(
          `http://localhost:5000/api/delete/delete-vfstr/${videoId}`
        );
      }

      // 🧹 Always remove from UI
      setVfstrVideos((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting VFSTR video:", error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/fetch-faculties")
      .then((res) => setFaculties(res.data))
      .catch((err) => console.error("Faculty fetch error:", err));
  }, []);

  return (
    <div className="update-topic-container">
      <h3 className="page-title">Update Course Content for "{subjectName}"</h3>
      <DeleteConfirmModal
        isOpen={deleteSubtopicModalInfo.open}
        itemName="subtopic"
        onClose={() =>
          setDeleteSubtopicModalInfo({
            open: false,
            topicId: null,
            subtopicId: null,
          })
        }
        onConfirm={(password) =>
          handleDeleteSubtopic(
            deleteSubtopicModalInfo.topicId,
            deleteSubtopicModalInfo.subtopicId,
            password
          )
        }
      />
      <DeleteConfirmModal
        isOpen={deleteTopicModalInfo.open}
        itemName="Topic"
        onClose={() =>
          setDeleteTopicModalInfo({
            open: false,
            chapterId: null,
            topicId: null,
          })
        }
        onConfirm={(password) =>
          handleDeleteTopic(
            deleteTopicModalInfo.chapterId,
            deleteTopicModalInfo.topicId,
            password
          )
        }
      />
      <DeleteConfirmModal
        isOpen={deleteChapterModalInfo.open}
        itemName="Chapter"
        onClose={() =>
          setDeleteChapterModalInfo({ open: false, chapterId: null })
        }
        onConfirm={(password) =>
          handleDeleteChapter(deleteChapterModalInfo.chapterId, password)
        }
      />

      {/* Global Preview Mode when no subtopic is selected */}
      {!selectedSubtopicId && globalPreview && (
        <div className="preview-mode-container">
          <button
            className="back-button"
            onClick={() => setGlobalPreview(false)}
          >
            ← Back to Editor
          </button>
          <TwoColumnPage selectedSubject={subject} username={username} />
        </div>
      )}

      {/* Preview button when no subtopic is selected and not in global preview mode */}
      {!selectedSubtopicId && !globalPreview && (
        <button className="btn btn-primary" onClick={handlePreview}>
          Preview
        </button>
      )}

      {/* When a subtopic is selected */}
      {selectedSubtopicId ? (
        previewMode ? (
          <div className="preview-mode-container">
            <button
              className="back-button"
              onClick={() => setPreviewMode(false)}
            >
              ← Back to Editor
            </button>
            {subTopicData ? (
              <>
                <TwoColumnPageForFaculty
                  selectedSubject={subject}
                  username={username}
                  selectedSubtopicIds={selectedSubtopicId}
                />
              </>
            ) : (
              <div className="no-content">No content available for preview</div>
            )}
          </div>
        ) : (
          <LinkEditor
            selectedSubtopicId={selectedSubtopicId}
            setSelectedSubtopicId={setSelectedSubtopicId}
            levels={levels}
            setLevels={setLevels}
            nptelVideos={nptelVideos}
            setNptelVideos={setNptelVideos}
            videoNames={videoNames}
            subjectName={subjectName}
            handleChange={handleChange}
            handleNptelChange={handleNptelChange}
            handleSubmit={handleSubmit}
            handleDeleteLink={handleDeleteLink}
            handleDeleteNptelLink={handleDeleteNptelLink}
            handleAddLink={handleAddLink}
            handleAddNptelLink={handleAddNptelLink}
            setPreviewMode={setPreviewMode}
            vfstrVideos={vfstrVideos}
            setVfstrVideos={setVfstrVideos}
            vfstrVideoNames={vfstrVideoNames}
            faculties={faculties}
            selectedFaculty={selectedFaculty}
            setSelectedFaculty={setSelectedFaculty}
            handleDeleteVfstrLink={handleDeleteVfstrLink}
          />
        )
      ) : (
        !globalPreview && (
          <ChapterContents
            chapters={chapters}
            chapterInputs={chapterInputs}
            topicInputs={topicInputs}
            subtopicInputs={subtopicInputs}
            topics={topics}
            subtopics={subtopics}
            editingChapterId={editingChapterId}
            setEditedChapterTitle={setEditedChapterTitle}
            editingTopicId={editingTopicId}
            editingSubtopicId={editingSubtopicId}
            editedChapterTitle={editedChapterTitle}
            editedTopicTitle={editedTopicTitle}
            editedSubtopicTitle={editedSubtopicTitle}
            selectedSubtopicId={selectedSubtopicId}
            loading={loading}
            handleEditChapter={handleEditChapter}
            handleDeleteChapter={handleDeleteChapter}
            handleSaveChapterEdit={handleSaveChapterEdit}
            setEditingChapterId={setEditingChapterId}
            handleChapterInputChange={handleChapterInputChange}
            handleAddChapter={handleAddChapter}
            handleTopicInputChange={handleTopicInputChange}
            handleAddTopic={handleAddTopic}
            handleEditTopic={handleEditTopic}
            handleDeleteTopic={handleDeleteTopic}
            handleSaveTopicEdit={handleSaveTopicEdit}
            setEditingTopicId={setEditingTopicId}
            handleSubtopicInputChange={handleSubtopicInputChange}
            handleAddSubtopic={handleAddSubtopic}
            handleEditSubtopic={handleEditSubtopic}
            handleDeleteSubtopic={handleDeleteSubtopic}
            handleSaveSubtopicEdit={handleSaveSubtopicEdit}
            setEditingSubtopicId={setEditingSubtopicId}
            setSelectedSubtopicId={setSelectedSubtopicId}
            setEditedTopicTitle={setEditedTopicTitle}
            setEditedSubtopicTitle={setEditedSubtopicTitle}
            setDeleteSubtopicModalInfo={setDeleteSubtopicModalInfo}
            setDeleteTopicModalInfo={setDeleteTopicModalInfo}
            setDeleteChapterModalInfo={setDeleteChapterModalInfo}
          />
        )
      )}
    </div>
  );
};

export default UpdateTopic;
