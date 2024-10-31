"use client";

import { uploadFile } from "@/api/file";
import Image from "next/image";
import React, { use, useEffect, useRef, useState } from "react";
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
  const [isSend, setIsSend] = useState(false);

  const onSend = () => {
    setIsSend(true);
    const cleanedData = editorData.replace(/<[^>]*>/g, "").trim();
    if (isImage || fileId || cleanedData) {
      setTimeout(() => {
        console.log('02', editorData);
        handleSend(editorData, isImage ? imageId : fileId);
        if (editorRef.current) {
          editorRef.current.innerHTML = ""; 
          setTempImage(null);
          setTempFile(null);
          setImageId(null);
          setFileId(null);
          setFileName(null);
          setEditorData("");
        }
        editorRef.current.focus();
      }, 0);
    }
    setIsSend(false)
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        setEditorData((prev) => `${prev}<br><br>`);
        e.preventDefault();
      } else {
        e.preventDefault();
        if(!isSend){
          console.log('01', editorData);
          onSend();
        }
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault(); 
    const text = (e.clipboardData || window.clipboardData).getData("text");
    document.execCommand("insertText", false, text);
  };

  useEffect(() => {
    console.log('00', editorData);
  }, [editorData])

  const handleFileChange = async (e) => {
    setIsLoading(true);
    const file = e.target.files[0];

    if (file) {
      try {
        const data = new FormData();
        data.append("file", file);
        const res = await uploadFile(data);
        const fileUrl = res.file;

        if (file.type.startsWith("image/")) {
          setTempImage(fileUrl);
          setIsImage(true);
          setImageId(res.id);
        } else {
          setTempFile(fileUrl);
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
        setTempFile(null);
        setIsLoading(false);

      }
    }
  };

  const handleEmojiSelect = (emoji) => {
    const emojiHtml = emoji.emoji;

    if (editorRef.current) {
      const editor = editorRef.current;
      editor.focus();

      const emojiNode = document.createElement("span");
      emojiNode.innerHTML = emojiHtml;

      editor.appendChild(emojiNode);

      const range = document.createRange();
      range.setStartAfter(emojiNode);
      range.collapse(true);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      setEditorData(editor.innerHTML);
    }

    setShowEmojiPicker(false);
  };

  const handleRemoveImage = () => {
    setTempImage(null);
    setTempFile(null);
    setIsImage(false);
    setFileName(null);
    setImageId(null);
    setFileId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (isDetail) {
      setHaveImage(isImage || Boolean(tempFile));
    }
  }, [tempImage, tempFile]);

  return (
    <div className={`relative`}>
      <div
        className={`w-100 bg-[#222] rounded-[8px] mt-[12px]`}
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
          onPaste={handlePaste}
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
