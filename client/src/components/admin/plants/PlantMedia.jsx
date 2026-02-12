import React from "react";

const PlantMedia = ({
  thumbnailPreview,
  handleThumbnailChange,
  oldThumbnail,
  galleryPreview,
  handleGalleryChange,
  oldMedia,
  removeOldMedia,
  removeNewFile,
  isEdit,
}) => {
  const isVideo = (filename) => {
    if (!filename) return false;
    const ext = filename.split(".").pop().toLowerCase();
    return ["mp4", "mov", "avi", "webm"].includes(ext);
  };

  return (
    <div className="media-container">
      {/* 1. Ảnh Đại Diện */}
      <div className="media-box">
        <h3 className="media-title">1. Ảnh Đại Diện</h3>
        <input type="file" onChange={handleThumbnailChange} accept="image/*" />

        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="New"
            className="preview-img new-thumb"
          />
        )}

        {isEdit && !thumbnailPreview && oldThumbnail && (
          <div className="old-media-wrapper">
            <p>Ảnh hiện tại:</p>
            <img
              src={`${API_URL}${oldThumbnail}`}
              alt="Old"
              className="preview-img"
            />
          </div>
        )}
      </div>

      {/* 2. Thư Viện Ảnh & Video */}
      <div className="media-box">
        <h3 className="media-title">2. Thư Viện Ảnh & Video</h3>
        <input
          type="file"
          multiple
          onChange={handleGalleryChange}
          accept="image/*,video/*"
        />

        <div className="gallery-grid">
          {/* Media Cũ */}
          {oldMedia.map((item) => (
            <div key={item.id} className="gallery-item">
              {isVideo(item.image_url) ? (
                <video
                  src={`${API_URL}${item.image_url}`}
                  className="gallery-content"
                />
              ) : (
                <img
                  src={`${API_URL}${item.image_url}`}
                  alt="old"
                  className="gallery-content"
                />
              )}
              <button
                type="button"
                onClick={() => removeOldMedia(item.id)}
                className="btn-remove-media"
              >
                X
              </button>
            </div>
          ))}

          {/* Media Mới Upload */}
          {galleryPreview.map((item, index) => (
            <div key={index} className="gallery-item new-item">
              {item.type === "video" ? (
                <video src={item.url} className="gallery-content" />
              ) : (
                <img src={item.url} className="gallery-content" />
              )}
              <button
                type="button"
                onClick={() => removeNewFile(index)}
                className="btn-remove-media new"
              >
                HỦY
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantMedia;
