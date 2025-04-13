// File: pages/index.js (or app/page.js if using App Router)
// If using App Router, add "use client"; at the top of this file

import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [profileImage, setProfileImage] = useState(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [userName, setUserName] = useState('');
  const [userInfo, setUserInfo] = useState('');
  
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
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
      y: clientY - imagePosition.y
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
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
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
        <title>Profile Image Creator</title>
        <meta name="description" content="Upload your profile image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">Create Your Profile</h1>
        
        <div className="content">
          <div className="preview-section">
            <div className="frame-container">
              <div className="bengali-frame">
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
                      />
                    </div>
                  ) : (
                    <div className="upload-placeholder" onClick={() => fileInputRef.current.click()}>
                      <span>+</span>
                      <p>Click to upload</p>
                    </div>
                  )}
                </div>
                
                {/* Text display area */}
                <div className="text-overlay">
                  {userName && <p className="user-name">{userName}</p>}
                  {userInfo && <p className="user-info">{userInfo}</p>}
                </div>
              </div>
            </div>
          </div>
          
          <div className="controls-section">
            <div className="form-container">
              <h2>Your Information</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name:</label>
                  <input
                    type="text"
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="info">Your Info:</label>
                  <textarea
                    id="info"
                    value={userInfo}
                    onChange={(e) => setUserInfo(e.target.value)}
                    placeholder="Enter your information"
                    rows="4"
                  />
                </div>
                
                <button type="submit" className="submit-btn">Update</button>
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
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </main>

      <style jsx>{`
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
        
        @media (min-width: 768px) {
          .content {
            flex-direction: row;
          }
          
          .preview-section,
          .controls-section {
            width: 50%;
          }
        }
        
        .frame-container {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 20px;
          background-color: #f5f5f5;
        }
        
        .bengali-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 1/1;
          background-image: url('/background.jpg');
          background-size: cover;
          background-position: center;
          background-color: darkred; /* Fallback if image not loaded */
        }
        
        .image-circle {
          position: absolute;
          right: 5%;
          top: 25%;
          width: 35%;
          aspect-ratio: 1/1;
          border-radius: 50%;
          overflow: hidden;
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .upload-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
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
        }
        
        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .text-overlay {
          position: absolute;
          left: 5%;
          top: 30%;
          width: 50%;
          color: white;
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
        .change-image-btn {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .submit-btn:hover,
        .change-image-btn:hover {
          background-color: #0051a2;
        }
      `}</style>
    </div>
  );
}