import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";

export default function GorubhojUploader() {
  const [image, setImage] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentInfo, setStudentInfo] = useState("");
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 250, y: 20 });

  const imageRef = useRef(null);
  const frameRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    const rect = e.target.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  const handleDownload = async () => {
    if (frameRef.current) {
      const canvas = await html2canvas(frameRef.current);
      const link = document.createElement("a");
      link.download = "gorubhoj_frame.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-red-900 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4">
        <CardContent className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center">গরুভোজ ফটো ফ্রেম</h1>

          <div
            ref={frameRef}
            className="relative w-full h-[600px] bg-cover bg-center"
            style={{ backgroundImage: "url('/490323400_660673956607659_3933026969264621759_n.jpg')" }}
          >
            {image && (
              <img
                ref={imageRef}
                src={image}
                alt="Uploaded"
                className="absolute w-[250px] h-[250px] object-cover rounded-full border-4 border-white cursor-move"
                onMouseDown={handleMouseDown}
                style={{ top: position.y, left: position.x }}
              />
            )}
            {studentName && (
              <p className="absolute bottom-[60px] left-[30px] text-white text-xl font-bold">{studentName}</p>
            )}
            {studentInfo && (
              <p className="absolute bottom-[30px] left-[30px] text-white text-base">{studentInfo}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
            <Input
              type="text"
              placeholder="শিক্ষার্থীর নাম"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="শিক্ষার্থীর তথ্য"
              value={studentInfo}
              onChange={(e) => setStudentInfo(e.target.value)}
            />
            <Button onClick={handleDownload}>ডাউনলোড করুন</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
