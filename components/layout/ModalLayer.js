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
import { memberOptions, p, yearOptions, d, s } from "@/data/data";
import AddIcon from "@/public/icons/add-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "@/reducers/userInfoSlice";

const ModalLayer = ({ toggleOpenModalSetting }) => {
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.userInfo);
  const university = useSelector((state) => state.university);
  const competition = useSelector((state) => state.competition);
  const domain = useSelector((state) => state.domain);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { register, watch, setValue, handleSubmit } = useForm({
    defaultValues: {
      first_name: userData.first_name,
      age: userData.age,
      color: userData.color,
      city: userData.city,
      district: userData.district,
      university: userData.university,
      team_member_count: userData.team_member_count,
      bio: userData.bio,
      competition: userData.competition?.[0]?.id,
      year_competition: userData.competition?.[0]?.year_competition,
      domain: userData.domain?.[0]?.id,
      skill_set: userData.skill_set,
      // bio_image: userData.bio_image,
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

  const handleUploadBio = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const data = new FormData();
        data.append("file", file);
        const res = await uploadFile(data);
        setSelectedImage(URL.createObjectURL(file));
        setValue("bio_image", [res]);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleUpdateSetting = (data) => {
    data.domain = [data.domain];
    data.competition = [{
      id: data.competition,
      year_competition: data.year_competition,
    }];
    delete data.year_competition;
    data.bio_image = [data.bio_image[0]?.id];
    updateProfile(data)
      .then((res) => {
        dispatch(setUserInfo(res))
        toggleOpenModalSetting();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const competitionOptions = competition?.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  const universityOptions = university?.map((item) => {
    return {
      value: String(item.id),
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

  const handleChangeFilter = (name, value) => {
    setValue(name, value);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-90 z-20"
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
                  <div className="m-av rounded-full overflow-hidden w-[90px] h-[90px]">
                    <Image
                      src={selectedImage || userData?.avatar?.file}
                      alt="avatar"
                      width={90}
                      height={90}
                      className="rounded-full"
                      style={{
                        height: "100%",
                        width: "100%",
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
              handleChangeFilter={handleChangeFilter}
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
                handleChangeFilter={handleChangeFilter}
                defaultValue={watch("city")}
              />
              <SelectForm
                options={dsOptions}
                label={"District"}
                placeholder={"District"}
                noIcon={true}
                name={"district"}
                handleChangeFilter={handleChangeFilter}
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
                handleChangeFilter={handleChangeFilter}
                defaultValue={watch("university")}
              />
              <SelectForm
                options={memberOptions}
                label={"Team Member"}
                placeholder={"Team Member"}
                noIcon={true}
                name={"team_member_count"}
                handleChangeFilter={handleChangeFilter}
                defaultValue={watch("team_member_count")}
              />
            </div>
            <div className="form-double-item">
              <SelectForm
                options={competitionOptions}
                label={"Competition"}
                placeholder={"Competition"}
                noIcon={true}
                name={"competition"}
                handleChangeFilter={handleChangeFilter}
                defaultValue={watch("competition")}
              />
              <SelectForm
                options={yearOptions}
                label={"Year"}
                placeholder={"Year"}
                noIcon={true}
                name={"year_competition"}
                handleChangeFilter={handleChangeFilter}
                defaultValue={watch("year_competition")}
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
              handleChangeFilter={handleChangeFilter}
              defaultValue={watch("domain")}

            />
            <SelectForm
              options={s}
              label={"Skill set"}
              placeholder={"Skill set"}
              noIcon={true}
              haveSub={true}
              cstyle={{ marginBottom: "12px" }}
              name={"skill_set"}
              handleChangeFilter={handleChangeFilter}
              defaultValue={watch("skill_set")}
            />
            <InputForm
              title={"Archivement"}
              placeholder={"Archivement"}
              register={register}
              name={"archivement"}
              isEditor={true}
            />
            <InputForm
              title={"Tldr"}
              placeholder={"Tôi tên là quốc anh đến từ neu, tôi học finance và thích ăn bánh bao + chơi bóng rổ"}
              register={register}
              name={"bio"}
              isEditor={true}
            />
            <div className="more">
              <label>Bio Image</label>
              <div className="flex items-center gap-[6px]">
                {watch("bio_image")?.length > 0 && (
                  <Image
                    src={watch("bio_image")?.[0].file}
                    alt="camera-icon"
                    width={150}
                    height={150}
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )}
                <div className="w-[150px] h-[150px] rounded-[8px] bg-[#222] flex items-center justify-center relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleUploadBio}
                  />
                  <Image
                    src={AddIcon}
                    alt="camera-icon"
                    width={16}
                    height={16}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>
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
