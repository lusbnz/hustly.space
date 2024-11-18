import React, { useEffect, useState } from "react";
import "./layout.css";
import "./styles.css";

const ModalRejectConfirm = ({ isOpen, toggleOpenModal, handleConfirm }) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black opacity-90 z-20 ${
          isOpen ? "show" : ""
        }`}
        onClick={toggleOpenModal}
      />
      <div className="w-[100vw] h-[90vh] bg-transparent opacity-100 fixed top-0 left-0 z-30 p-[22px] flex items-center justify-center">
        <div className="w-[600px] fisrt-chat flex flex-col gap-[20px] max-h-[100vh] p-[28px] text-white bg-[#171717] rounded-[20px] relative z-50">
          <span className="font-[600] text-[20px]">
            Are you sure you want to reject this user?{" "}
          </span>
          <span className="font-[400] text-[14px] text-gray-400">
            If you reject this person, they won't be able to reach out to you
            again, unless you reach out to them first. Are you sure you want to
            reject them? They might be sad 😞
          </span>
          <div className="flex items-center gap-[24px] w-100 justify-end mt-[12px]">
            <div
              className="cursor-pointer hover:opacity-80"
              onClick={toggleOpenModal}
            >
              Cancel
            </div>
            <div
              className="h-[32px] px-[12px] rounded-[4px] bg-red-700 flex items-center justify-center hover:opacity-80 cursor-pointer"
              onClick={() => {
                handleConfirm();
                toggleOpenModal();
              }}
            >
              Delete
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalRejectConfirm;
