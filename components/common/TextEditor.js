"use client";

import { uploadFile } from "@/api/file";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import UploadIcon from "@/public/icons/image-icon.svg";
import SendIcon from "@/public/icons/send-icon.svg";
import EmojiPicker from "emoji-picker-react";
import TrashIcon from "@/public/icons/trash-icon.svg";
import AttachmentIcon from "@/public/icons/attachment.svg";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

const TextEditor = ({
  handleSend,
  isDetail,
  setHaveImage,
  isLoading,
  setIsLoading,
}) => {
  const [editorData, setEditorData] = useState("");
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [tempImage, setTempImage] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [fileName, setFileName] = useState(null);

  const onSend = () => {
    if (isImage || fileId || editorData.trim()) {
      // Ensure the editor data is not just whitespace
      handleSend(editorData, isImage ? imageId : fileId);
      setIsImage(false);
      setEditorData("");
      if (editorRef.current) {
        editorRef.current.innerHTML = ""; // Clear editor
        setTempImage(null);
        setTempFile(null);
        setImageId(null);
        setFileId(null)
        setFileName(null);
      }
      editorRef.current.focus(); // Refocus the editor after sending
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
    setIsLoading(true);
    const file = e.target.files[0];

    if (file) {
      try {
        const data = new FormData();
        data.append("file", file);
        const res = await uploadFile(data);
        const fileUrl = res.file;

        // Determine if the uploaded file is an image
        if (file.type.startsWith("image/")) {
          setTempImage(fileUrl);
          setIsImage(true);
          setImageId(res.id);
        } else {
          setTempFile(fileUrl); // Store non-image file URL
          setIsImage(false);
          setFileName(res.name);
          setFileId(res.id);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Upload file less than 10MB");
        setIsImage(false);
        setTempImage(null);
        setFileName(null);
        setTempFile(null); // Reset on error
        setIsLoading(false);

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

  const handleRemoveImage = () => {
    setTempImage(null);
    setTempFile(null); // Reset non-image file
    setIsImage(false);
    setFileName(null);
    setImageId(null);
    setFileId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  useEffect(() => {
    if (isDetail) {
      setHaveImage(isImage || Boolean(tempFile)); // Check if there's an image or non-image file
    }
  }, [tempImage, tempFile]);

  return (
    <div className={`relative`}>
      <div
        className={`w-100 bg-[#222] rounded-[8px] mt-[4px]`}
        style={{
          height:
            tempImage || tempFile
              ? "calc(320 /1080 * 100vh)"
              : "calc(200 /1080 * 100vh)",
        }}
      >
        {tempImage && (
          <div className={`relative flex justify-between p-4`}>
            <img
              src={tempImage}
              alt="Uploaded Preview"
              className="rounded-[8px]"
              style={{
                width: "calc(64 / 1080 * 100vh)",
                height: "calc(64 / 1080 * 100vh)",
                objectFit: "cover",
              }}
            />
            <div className="cursor-pointer" onClick={handleRemoveImage}>
              <Image src={TrashIcon} alt="Delete" width={20} height={20} />
            </div>
          </div>
        )}
        {tempFile && (
          <div className={`relative flex justify-between p-4`}>
            <div className="flex items-center justify-center p-2 min-w-[100px] h-[32px] rounded-[4px] bg-[#171717]">
              <Image
                src={AttachmentIcon}
                alt="Attachment"
                width={16}
                height={16}
              />
              <span className="text-white text-[12px] ml-2">{fileName?.length > 15 ? fileName.slice(0, 15) + "..." : fileName}</span>{" "}
              {/* Show file name */}
            </div>
            <div className="cursor-pointer" onClick={handleRemoveImage}>
              <Image src={TrashIcon} alt="Delete" width={20} height={20} />
            </div>
          </div>
        )}
        <div
          ref={editorRef}
          className="bg-transparent outline-none text-[#ffffff] p-[12px] overflow-y-auto"
          style={{
            width: "-webkit-fill-available",
            height: "calc(130 /1080 * 100vh)",
          }}
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
                  alert(
                    "File size exceeds 20MB. Please select a smaller file."
                  );
                  e.target.value = ""; // Reset input file để không chọn tệp lớn
                } else {
                  handleFileChange(e); // Gọi hàm xử lý nếu file hợp lệ
                }
              }}
              accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.txt"
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

          {isLoading ? (
            <div className="flex justify-center mt-2">
              <BeatLoader color="#ffffff" loading={isLoading} size={10} />
            </div>
          ) : (
            <div className="text-white cursor-pointer" onClick={onSend}>
              <Image src={SendIcon} alt="send" width={20} height={20} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
