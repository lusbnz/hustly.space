import React from "react";
import "./styles.css";
import Banner from "@/public/images/banner.png";
import Image from "next/image";
import ButtonComponent from "@/components/common/ButtonComponent";
import InputForm from "@/components/common/InputForm";

const Settings = () => {
  return (
    <div className="flex setting-container">
      <div className="setting-content">
        <div className="setting-header">Profile Setting</div>
        <div className="separator"></div>
        <div className="setting-body">
          <div className="avatar">
            <div className="avatar-img"></div>
            <span>Daniel Simon</span>
          </div>
          <div className="form-wrapper">
            <form>
              <div className="grid grid-cols-2 gap-[12px]">
                <InputForm title={"City"} placeholder={"City..."} />
                <InputForm title={"Country"} placeholder={"Country..."} />
              </div>
              <div className="grid grid-cols-2 gap-[12px]">
                <InputForm title={"University"} placeholder={"University..."} />
                <InputForm
                  title={"Team member"}
                  placeholder={"Team member..."}
                />
              </div>
              <div className="grid grid-cols-2 gap-[12px]">
                <InputForm
                  title={"Competition"}
                  placeholder={"Competition..."}
                />
                <InputForm
                  title={"Year Competition"}
                  placeholder={"Year Competition..."}
                />
              </div>
              <InputForm title={"Domain"} placeholder={"Domain..."} />
              <InputForm title={"Skill Set"} placeholder={"Skill Set..."} />
            </form>
          </div>
        </div>
        <div className="setting-footer">
          <ButtonComponent
            type={"button"}
            backgroundColor={"#ffffff"}
            color={"#000000"}
            title={"Cancel"}
            border
          />
          <ButtonComponent type={"button"} title={"Save"} />
        </div>
      </div>
      <div className="flex-1 rounded-[20px]">
        <Image src={Banner} alt="banner" className="rounded-[20px] image" />
      </div>
    </div>
  );
};

export default Settings;
