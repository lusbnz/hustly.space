"use client";

import { uploadFile } from "@/api/file";
import Image from "next/image";
import React, { useRef, useState } from "react";
import UploadIcon from "@/public/icons/image-icon.svg";
import SendIcon from "@/public/icons/send-icon.svg";
import EmojiPicker from "emoji-picker-react";
import { set } from "react-hook-form";

const TextEditor = ({ handleSend }) => {
  const [editorData, setEditorData] = useState("");
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [tempImage, setTempImage] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onSend = () => {
    handleSend(editorData, imageId);
    setEditorData("");
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      setTempImage(null);
      setImageId(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        document.execCommand("insertHTML", false, "<br><br>");
        e.preventDefault();
      } else {
        e.preventDefault();
        onSend();
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const data = new FormData();
        data.append("file", file);
        const res = await uploadFile(data);
        const imageUrl = res.file;
        setTempImage(imageUrl);
        setImageId(res.id);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleEmojiSelect = (emoji) => {
    const emojiHtml = emoji.emoji;
  
    if (editorRef.current) {
      const editor = editorRef.current;
      editor.focus();
  
      // Tạo một node chứa emoji và chèn vào cuối nội dung
      const emojiNode = document.createElement("span");
      emojiNode.innerHTML = emojiHtml; // Sử dụng innerHTML để chèn emoji đúng cách
  
      // Chèn emoji vào cuối nội dung
      editor.appendChild(emojiNode);
  
      // Di chuyển con trỏ đến cuối editor
      const range = document.createRange();
      range.setStartAfter(emojiNode);
      range.collapse(true);
  
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
  
      // Cập nhật dữ liệu editor
      setEditorData(editor.innerHTML);
    }
  
    setShowEmojiPicker(false);
  };  
  
  return (
    <div className="relative">
      {tempImage && (
        <div className="absolute bottom-40 left-0 right-0 flex justify-start">
          <Image
            src={tempImage}
            alt="Uploaded Preview"
            className="rounded-[8px]"
            width={100}
            height={100}
            objectFit="cover"
          />
        </div>
      )}
      <div className={`w-100 bg-[#222] h-[150px] rounded-[8px] mt-[4px]`}>
        <div
          ref={editorRef}
          className="h-[100px] bg-transparent outline-none text-[#ffffff] p-[12px] overflow-y-auto"
          style={{ width: "-webkit-fill-available" }}
          contentEditable
          placeholder="Your message..."
          onInput={() => setEditorData(editorRef.current.innerHTML)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex items-center justify-between gap-[6px] w-100 mt-[10px] px-[20px]">
          <div className="flex items-center gap-[12px]">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files[0];
              
              if (file && file.size > 20 * 1024 * 1024) {
                alert("File size exceeds 20MB. Please select a smaller file.");
                e.target.value = ""; // Reset input file để không chọn tệp lớn
              } else {
                handleFileChange(e); // Gọi hàm xử lý nếu file hợp lệ
              }
            }}
            accept="image/*, audio/*, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt"
            className="hidden"
          />
          <div
            className="text-white cursor-pointer"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😀
          </div>
          {showEmojiPicker && (
            <div className="absolute bottom-[80px] left-[20px] z-10">
              <EmojiPicker onEmojiClick={handleEmojiSelect} />
            </div>
          )}
          <div
            className="text-white cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <Image src={UploadIcon} alt="upload" width={20} height={20} />
          </div>
          </div>
          <div className="text-white cursor-pointer" onClick={onSend}>
            <Image src={SendIcon} alt="send" width={20} height={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
