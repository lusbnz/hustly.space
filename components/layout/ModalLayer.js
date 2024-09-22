"use client";

import React, { useEffect, useState } from "react";
import "./layout.css";
import ButtonComponent from "../common/ButtonComponent";
import InputForm from "../common/InputForm";
import BackIcon from "@/public/icons/back-icon.svg";
import CameraIcon from "@/public/icons/camera-icon.svg";
import EditIcon from "@/public/icons/edit-icon.svg";
import Image from "next/image";
import { uploadFile } from "@/api/file";
import { updateProfile } from "@/api/profile";
import { useForm } from "react-hook-form";
import SelectForm from "../common/SelectForm";
import { memberOptions, p, yearOptions, d } from "@/data/data";

const ModalLayer = ({ toggleOpenModalSetting }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const university = JSON.parse(localStorage.getItem("university"));
  const competion = JSON.parse(localStorage.getItem("competion"));
  const domain = JSON.parse(localStorage.getItem("domain"));
  const [isEdit, setIsEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { register, watch, setValue, handleSubmit } = useForm({
    defaultValues: {
      first_name: userData.first_name,
      age: userData.age,
      color: userData.color,
      city: userData.city,
      district: userData.district,
      // university: userData.university,
      team_member_count: userData.team_member_count,
      bio: userData.bio,
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const data = new FormData();
        data.append("file", file);
        const res = await uploadFile(data);
        setSelectedImage(URL.createObjectURL(file));
        setValue("avatar", res.id);
        setIsEdit(false);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleUpdateSetting = (data) => {
    updateProfile(data)
      .then((res) => {
        localStorage.setItem("userData", JSON.stringify(res));
        toggleOpenModalSetting();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const competionOptions = competion?.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  const universityOptions = university?.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  const psOptions = p?.map((item) => {
    return {
      value: item.code,
      label: item.name,
    };
  });

  const dsOptions = d
    ?.filter((item) => String(item.province_code) === String(watch("city")))
    .map((item) => ({
      value: item.code,
      label: item.name,
    }));

  const domainOptions = domain?.map((item) => {
    return {
      value: item.id,
      label: item.name,
      subOptions: item.sub_domains.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    };
  });

  const colorOptions = [
    {
      value: "#ff0000",
      label:
        "(ferno): Pioneering spirit, fierce competition, unwavering determination, and the power to inspire others toward success.",
    },
    {
      value: "#00ff00",
      label:
        "(ocea): Detail-oriented, speak little but do much, the silent hero of the team, ensuring every detail is completed flawlessly.",
    },
    {
      value: "#0000ff",
      label:
        "(jade): The glue of the team, they excel at listening, relieving tension, and understanding each member, helping everyone move forward in unity.",
    },
    {
      value: "#ffff00",
      label:
        "(aura): Creative individuals, full of unique ideas, are always the ones who propose groundbreaking solutions to solve the team's challenges.",
    },
  ];

  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-70 z-20"
        onClick={toggleOpenModalSetting}
      />
      <div className="w-[100vw] h-100 bg-transparent opacity-100 absolute z-30 p-[22px]">
        <div className="w-[532px] h-100 max-h-[95vh] p-[28px] text-white bg-[#171717] rounded-[20px] relative z-50">
          <div className="border-b-[1px] pb-[28px] mb-[22px] border-b-[#212121] flex items-center">
            <div
              className="mr-2 cursor-pointer"
              onClick={toggleOpenModalSetting}
            >
              <Image src={BackIcon} alt="back-icon" width={24} height={24} />
            </div>
            <span className="m-title">Profile Setting</span>
          </div>
          <div className="mb-[40px] max-h-[510px] overflow-y-auto">
            <div className="flex items-center justify-between my-[22px] gap-[12px]">
              <div className="flex items-center gap-[12px]">
                {(selectedImage || userData?.avatar?.file) && !isEdit ? (
                  <div className="m-av rounded-full overflow-hidden">
                    <Image
                      src={selectedImage || userData?.avatar?.file}
                      alt="avatar"
                      width={90}
                      height={90}
                      className="rounded-full"
                      style={{
                        maxWidth: "90px",
                        maxHeight: "90px",
                        height: "90px",
                        width: "90px",
                        objectPosition: "center",
                        objectFit: "fill",
                      }}
                    />
                  </div>
                ) : (
                  <div className="relative m-upload bg-[#7a7a7a]">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                    />
                    <Image
                      src={CameraIcon}
                      alt="camera-icon"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
                {!isEdit ? (
                  <span className="w-[181px]">{watch("first_name")}</span>
                ) : (
                  <input
                    className="outline-0 bg-transparent"
                    {...register("first_name")}
                    required={true}
                  />
                )}
              </div>
              <Image
                src={EditIcon}
                alt="camera-icon"
                width={16}
                height={16}
                className="cursor-pointer"
                onClick={() => setIsEdit(!isEdit)}
              />
            </div>
            <SelectForm
              options={colorOptions}
              label={"Color"}
              placeholder={"Color"}
              noIcon={true}
              haveSub={true}
              cstyle={{ marginBottom: "12px" }}
              name={"color"}
              handleChange={handleChange}
              defaultValue={watch("color")}
            />
            <InputForm
              title={"Age"}
              placeholder={"Age"}
              register={register}
              name={"age"}
            />
            <div className="form-double-item">
              <SelectForm
                options={psOptions}
                label={"City"}
                placeholder={"City"}
                noIcon={true}
                name={"city"}
                handleChange={handleChange}
                defaultValue={watch("city")}
              />
              <SelectForm
                options={dsOptions}
                label={"District"}
                placeholder={"District"}
                noIcon={true}
                name={"district"}
                handleChange={handleChange}
                defaultValue={watch("district")}
              />
            </div>
            <div className="form-double-item">
              <SelectForm
                options={universityOptions}
                label={"University"}
                placeholder={"University"}
                noIcon={true}
                name={"university"}
                handleChange={handleChange}
              />
              <SelectForm
                options={memberOptions}
                label={"Team Member"}
                placeholder={"Team Member"}
                noIcon={true}
                name={"team_member_count"}
                handleChange={handleChange}
                defaultValue={watch("team_member_count")}
              />
            </div>
            <div className="form-double-item">
              <SelectForm
                options={competionOptions}
                label={"Competition"}
                placeholder={"Competition"}
                noIcon={true}
                name={"competition"}
                handleChange={handleChange}
              />
              <SelectForm
                options={yearOptions}
                label={"Year"}
                placeholder={"Year"}
                noIcon={true}
                name={"year"}
                handleChange={handleChange}
              />
            </div>
            <SelectForm
              options={domainOptions}
              label={"Domain"}
              placeholder={"Domain"}
              noIcon={true}
              haveSub={true}
              cstyle={{ marginBottom: "12px" }}
              name={"domain"}
              handleChange={handleChange}
            />
            <SelectForm
              options={domainOptions}
              label={"Skill set"}
              placeholder={"Skill set"}
              noIcon={true}
              haveSub={true}
              cstyle={{ marginBottom: "12px" }}
              name={"skill_set"}
              handleChange={handleChange}
            />
            <SelectForm
              options={domainOptions}
              label={"Archivement"}
              placeholder={"Archivement"}
              noIcon={true}
              haveSub={true}
              cstyle={{ marginBottom: "12px" }}
              name={"archivement"}
              handleChange={handleChange}
            />
            <InputForm
              title={"Bio"}
              placeholder={"Bio"}
              register={register}
              name={"bio"}
            />
          </div>
          <div className="absolute bottom-4 w-[484px]">
            <div className="flex items-center gap-[6px] w-100 ">
              <ButtonComponent
                type={"button"}
                title={"Cancel"}
                border
                backgroundColor={"transparent"}
                color={"#ffffff"}
                onClick={toggleOpenModalSetting}
              />
              <ButtonComponent
                type={"submit"}
                title={"Save"}
                onClick={handleSubmit(handleUpdateSetting)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalLayer;
