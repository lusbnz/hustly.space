import React from "react";
import "./layout.css";
import ButtonComponent from "../common/ButtonComponent";
import InputForm from "../common/InputForm";

const ModalLayer = ({ toggleOpenModalSetting }) => {
  return (
    <div className="w-[100vw] h-100 bg-black opacity-90 absolute z-50 p-[22px]">
      <div className="w-[532px] h-100 max-h-[95vh] p-[28px] text-white bg-[#171717] rounded-[20px] relative opacity-100">
        <div className="border-b-[1px] pb-[28px] mb-[22px] border-b-[#212121] flex items-center">
          <span
            className="mr-2 cursor-pointer"
            onClick={toggleOpenModalSetting}
          >
            back
          </span>
          <span className="m-title">Profile Setting</span>
        </div>
        <div className="mb-[40px] max-h-[510px] overflow-y-auto">
            <InputForm title={"Name"} placeholder={"Name"} />
            <InputForm title={"Name"} placeholder={"Name"} />
            <InputForm title={"Name"} placeholder={"Name"} />
            <InputForm title={"Name"} placeholder={"Name"} />
            <InputForm title={"Name"} placeholder={"Name"} />
            <InputForm title={"Name"} placeholder={"Name"} />
            <InputForm title={"Name"} placeholder={"Name"} />
            <InputForm title={"Name"} placeholder={"Name"} />
            <InputForm title={"Name"} placeholder={"Name"} />
        </div>
        <div className="absolute bottom-4 w-[484px]">
          <div className="flex items-center gap-[6px] w-100 ">
            <ButtonComponent
              type={"button"}
              title={"Cancel"}
              border
              backgroundColor={"transparent"}
              color={"#ffffff"}
            />
            <ButtonComponent type={"button"} title={"Save"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLayer;
