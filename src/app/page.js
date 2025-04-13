// File: pages/index.js (or app/page.js if using App Router)
// If using App Router, add "use client"; at the top of this file
"use client";
import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const [profileImage, setProfileImage] = useState(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [userName, setUserName] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);
  const frameRef = useRef(null);

  // Export functionality
  // const exportImage = async () => {
  //   if (!frameRef.current) return;

  //   try {
  //     setIsExporting(true);

  //     // Load html2canvas dynamically
  //     const html2canvas = (await import("html2canvas")).default;

  //     const canvas = await html2canvas(frameRef.current, {
  //       useCORS: true,
  //       allowTaint: true,
  //       backgroundColor: null,
  //       logging: false,
  //       scale: 2, // Higher resolution
  //     });

  //     // Convert to image
  //     const imageUrl = canvas.toDataURL("image/png");

  //     // Create download link
  //     const link = document.createElement("a");
  //     link.href = imageUrl;
  //     link.download = `${userName || "profile"}-image.png`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } catch (error) {
  //     console.error("Error exporting image:", error);
  //     alert("Failed to export image. Please try again.");
  //   } finally {
  //     setIsExporting(false);
  //   }
  // };

  const exportImage = async () => {
    if (!frameRef.current) return;

    try {
      setIsExporting(true);

      // Load html2canvas dynamically
      const html2canvas = (await import("html2canvas")).default;

      // Increase these values for higher quality
      const scale = 4; // Increase from 2 to 4 for higher resolution
      const quality = 1.0; // Maximum quality (0.0 to 1.0)

      const canvas = await html2canvas(frameRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        scale: scale, // Higher resolution
      });

      // Convert to image with maximum quality
      const imageUrl = canvas.toDataURL("image/png", quality);

      // Create download link
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${userName || "profile"}-image.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting image:", error);
      alert("Failed to export image. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        // Reset position and zoom when uploading new image
        setImagePosition({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle mouse/touch events for dragging
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);

    // Get the mouse/touch position
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    setStartPosition({
      x: clientX - imagePosition.x,
      y: clientY - imagePosition.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    // Get the mouse/touch position
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    // Calculate new position
    const newX = clientX - startPosition.x;
    const newY = clientY - startPosition.y;

    // Calculate bounds to keep the image within the circular frame
    const containerSize = imageContainerRef.current?.offsetWidth || 200;
    const imageSize = containerSize * zoom;
    const maxOffset = (imageSize - containerSize) / 2;

    // Apply bounds
    const boundedX = Math.max(-maxOffset, Math.min(maxOffset, newX));
    const boundedY = Math.max(-maxOffset, Math.min(maxOffset, newY));

    setImagePosition({ x: boundedX, y: boundedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleMouseMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, startPosition]);

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // The form values are already stored in state, so nothing else to do here
  };

  return (
    <div className="container">
      <Head>
        <title>গরুফ্রেম</title>
        <meta name="description" content="Upload your profile image" />
        <link rel="icon" href="/favicon.ico" />
        {/* Load html2canvas only when needed */}
        {isExporting && (
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
        )}
      </Head>

      <main className="main">
        <h1 className="title">
          গরুফ্রেম by{" "}
          <a href="https://www.facebook.com/profile.php?id=100066946987258">
            Abu Sayed
          </a>
        </h1>

        <div className="content">
          <div className="preview-section">
            <div className="frame-container">
              <div className="bengali-frame" ref={frameRef}>
                {/* This is where the Bengali text would appear from the background image */}

                {/* Circle for profile image */}
                <div className="image-circle" ref={imageContainerRef}>
                  {profileImage ? (
                    <div
                      className="image-wrapper"
                      ref={imageRef}
                      style={{
                        transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${zoom})`,
                      }}
                      onMouseDown={handleMouseDown}
                      onTouchStart={handleMouseDown}
                    >
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="profile-image"
                        draggable="false"
                        crossOrigin="anonymous"
                      />
                    </div>
                  ) : (
                    <div
                      className="upload-placeholder"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <span>+</span>
                      <p>Click to upload</p>
                    </div>
                  )}
                </div>

                {/* Text display area */}
                <div className="text-overlay">
                  {userName && <p className="user-name">{userName}</p>}
                </div>
                <div className="credit">Made With ❤️ by Abu Sayed</div>
              </div>
            </div>
          </div>

          <div className="controls-section">
            <div className="form-container">
              {/* <h2>Your Information</h2> */}
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  {/* <label htmlFor="name">Your Name:</label> */}
                  <input
                    type="text"
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>

                {/* <div className="form-group">
                  <label htmlFor="info">Your Info:</label>
                  <textarea
                    id="info"
                    value={userInfo}
                    onChange={(e) => setUserInfo(e.target.value)}
                    placeholder="Enter your information"
                    rows="4"
                  />
                </div> */}

                <button type="submit" className="submit-btn">
                  Update
                </button>
                {/* Export button */}
                <div className="export-container">
                  <button
                    className="export-btn"
                    onClick={exportImage}
                    disabled={isExporting || !profileImage}
                  >
                    {isExporting ? "Exporting..." : "Save Image"}
                  </button>
                  {!profileImage && (
                    <p className="export-info">
                      Upload a profile image to enable export
                    </p>
                  )}
                </div>
              </form>
            </div>

            {profileImage && (
              <div className="image-controls">
                <h2>Image Controls</h2>
                <div className="control-group">
                  <label htmlFor="zoom">Zoom:</label>
                  <input
                    type="range"
                    id="zoom"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                  />
                </div>

                <button
                  className="change-image-btn"
                  onClick={() => fileInputRef.current.click()}
                >
                  Change Image
                </button>
              </div>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
        </div>
        {/* Export button */}
        {/* <div className="export-container">
          <button
            className="export-btn"
            onClick={exportImage}
            disabled={isExporting || !profileImage}
          >
            {isExporting ? "Exporting..." : "Save Image"}
          </button>
          {!profileImage && (
            <p className="export-info">
              Upload a profile image to enable export
            </p>
          )}
        </div> */}
      </main>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap");

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "hind siliguri", sans-serif;
        }
        a {
          color: rgb(255, 17, 72);
          text-decoration: underline;
        }

        .container {
          min-height: 100vh;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .main {
          width: 100%;
          max-width: 1200px;
        }

        .title {
          text-align: center;
          margin-bottom: 30px;
          font-size: 28px;
        }

        .content {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        // .preview-section{
        // wi
        // }

        .frame-container {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 20px;
          background-color: #f5f5f5;
          text-align: center;
          width: 400px;
        }

        .bengali-frame {
          text-align: center;
          position: relative;
          width: 100%;
          aspect-ratio: 1/1;
          background-image: url("/background.jpg");
          background-size: cover;
          background-position: center;
          background-color: darkred; /* Fallback if image not loaded */
          margin: 0 auto;
          border-radius: 5px;
        }

        .image-circle {
          aspect-ratio: 1;
          background-color: rgba(119, 119, 119, 0.64);
          border-radius: 50%;
          width: 180px;
          height: 180px;
          position: absolute;
          top: 19%;
          right: -1%;
          overflow: hidden;
          object-fit: cover;
        }

        .upload-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #000;
          cursor: pointer;
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .upload-placeholder span {
          font-size: 32px;
          margin-bottom: 5px;
        }

        .upload-placeholder p {
          font-size: 14px;
          margin: 0;
        }

        .image-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          cursor: move;
          transform-origin: center;
          object-fit: cover;
        }

        .profile-image {
          width: 180px;
          height: 180px;
          object-fit: cover;
        }

        .text-overlay {
          position: absolute;
          left: 5%;
          top: 73%;
          color: #000;
          font-weight: bold;
          font-size: 25px;
        }

        .user-name,
        .user-info {
          margin: 5px 0;
          word-wrap: break-word;
        }

        .form-container,
        .image-controls {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          background-color: #f5f5f5;
        }

        h2 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .control-group {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }

        .control-group label {
          margin-right: 10px;
          margin-bottom: 0;
          min-width: 60px;
        }

        input[type="range"] {
          flex: 1;
        }

        .submit-btn,
        .export-btn,
        .change-image-btn {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
          font-weight: bold;
          cursor: pointer;
        }
        .export-btn {
          margin-top: 10px;
          background-color: rgb(255, 17, 72);
        }

        .submit-btn:hover,
        .change-image-btn:hover {
          background-color: #0051a2;
        }
        .export-info {
          margin-top: 5px;
          font-size: 16px;
          text-align: center;
          color: #555;
        }
        .credit {
          position: absolute;
          font-size: 8px;
          bottom: 10px;
          right: 10px;
        }
        @media (min-width: 768px) {
          .content {
            flex-direction: row;
          }

          .preview-section,
          .controls-section {
            width: 50%;
          }
          .frame-container {
            width: 500px;
          }
          .image-circle {
            aspect-ratio: 1;
            background-color: #fff3;
            border-radius: 50%;
            width: 240px;
            height: 240px;
            position: absolute;
            top: 18%;
            right: -2%;
            overflow: hidden;
            background-color: #eee;
          }
          .text-overlay {
            position: absolute;
            left: 5%;
            top: 75%;
            color: #000;
            font-weight: bold;
            font-size: 25px;
          }
        }
      `}</style>
    </div>
  );
}
