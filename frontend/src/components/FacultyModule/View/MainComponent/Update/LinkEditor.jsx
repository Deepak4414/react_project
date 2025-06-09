// LinkEditor.js
const LinkEditor = ({
  selectedSubtopicId,
  setSelectedSubtopicId,
  levels,
  setLevels,
  nptelVideos,
  setNptelVideos,
  videoNames,
  subjectName,
  handleChange,
  handleNptelChange,
  handleSubmit,
  handleDeleteLink,
  handleDeleteNptelLink,
  handleAddLink,
  handleAddNptelLink,
  setPreviewMode,
}) => {
  return (
    <div className="link-editor">
      <button
        className="back-button"
        onClick={() => setSelectedSubtopicId(null)}
      >
        ← Back to Chapters
      </button>

      <form onSubmit={handleSubmit}>
        <div className="link-sections">
          {["basic", "medium", "advanced"].map((level) => (
            <div key={level} className="link-section">
              <div className="section-header">
                <h5 className="text-capitalize">{level} Level</h5>
                <button
                  type="button"
                  className="add-link-btn"
                  onClick={() => handleAddLink(level)}
                >
                  + Add Link
                </button>
              </div>

              {levels[level].map((link, index) => (
                <div key={link.id || index} className="link-item">
                  <button
                    type="button"
                    className="delete-link-btn"
                    onClick={() => handleDeleteLink(level, link.id)}
                  >
                    ×
                  </button>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Title"
                    value={link.title}
                    onChange={(e) => handleChange(e, level, index, "title")}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Link"
                    value={link.link}
                    onChange={(e) => handleChange(e, level, index, "link")}
                  />
                  <textarea
                    className="form-control mb-2"
                    placeholder="Description"
                    rows="2"
                    value={link.description}
                    onChange={(e) =>
                      handleChange(e, level, index, "description")
                    }
                  />
                </div>
              ))}
            </div>
          ))}

          <div className="link-section">
            <div className="section-header">
              <h5>NPTEL Videos</h5>
              <button
                type="button"
                className="add-link-btn"
                onClick={handleAddNptelLink}
              >
                + Add Video
              </button>
            </div>

            {Array.isArray(nptelVideos[1]) && nptelVideos[1].length === 0 ? (
              <p className="no-content">No NPTEL content available.</p>
            ) : (
              Array.isArray(nptelVideos[1]) &&
              nptelVideos[1].map((_, index) => (
                <div
                  key={nptelVideos[0]?.[index] || index}
                  className="link-item"
                >
                  <button
                    type="button"
                    className="delete-link-btn"
                    onClick={() => handleDeleteNptelLink(index)}
                  >
                    ×
                  </button>

                  <input
                    type="text"
                    className="form-control mb-2"
                    value={nptelVideos[3]?.[index] || ""}
                    onChange={(e) => handleNptelChange(e, index, 3)}
                    placeholder="Video Title"
                  />

                  <select
                    className="form-control mb-2"
                    value={nptelVideos[2]?.[index] || ""}
                    onChange={(e) => handleNptelChange(e, index, 2)}
                  >
                    <option value="">-- Select a Video --</option>
                    {videoNames.map((video, idx) => (
                      <option key={idx} value={video}>
                        {video}
                      </option>
                    ))}
                  </select>

                  <textarea
                    className="form-control mb-2"
                    value={nptelVideos[4]?.[index] || ""}
                    onChange={(e) => handleNptelChange(e, index, 4)}
                    placeholder="Video Description"
                    rows="2"
                  />

                  <select
                    className="form-control"
                    value={nptelVideos[5]?.[index] || ""}
                    onChange={(e) => handleNptelChange(e, index, 5)}
                  >
                    <option value="">-- Select Level --</option>
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              ))
            )}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Save Changes
        </button>
      </form>
      <button
        className="preview-button mt-3 flex-1"
        onClick={() => {
          setPreviewMode(true);
        }}
      >
        Preview Changes
      </button>
    </div>
  );
};

export default LinkEditor;
