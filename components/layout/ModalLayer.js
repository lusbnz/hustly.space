"use client";

import React, { useEffect, useState } from "react";
import "./layout.css";
import ButtonComponent from "../common/ButtonComponent";
import InputForm from "../common/InputForm";
import BackIcon from "@/public/icons/back-icon.svg";
import CameraIcon from "@/public/icons/camera-icon.svg";
import EditIcon from "@/public/icons/edit-icon.svg";
import InstagramIcon from "@/public/icons/instagram-icon.svg";
import FacebookIcon from "@/public/icons/facebook-icon.svg";
import LinkedInIcon from "@/public/icons/linkedin-icon.svg";
import TrashIcon from "@/public/icons/trash-icon.svg";
import Image from "next/image";
import { uploadFile } from "@/api/file";
import { updateProfile } from "@/api/profile";
import { useForm } from "react-hook-form";
import SelectForm from "../common/SelectForm";
import {
  memberOptions,
  p,
  yearOptions,
  d,
  s,
  genderChoices,
} from "@/data/data";
import AddIcon from "@/public/icons/add-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "@/reducers/userInfoSlice";
import { BeatLoader } from "react-spinners";
import { removeVietnameseTones } from "@/utils/utils";

const ModalLayer = ({ toggleOpenModalSetting }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  const university = useSelector((state) => state.university);
  const competition = useSelector((state) => state.competition);
  const domain = useSelector((state) => state.domain);

  const [isLoadingBioImage, setIsLoadingBioImage] = useState(false);
  const [numberDomain, setNumberDomain] = useState(0);
  const [numberArchivement, setNumberArchivement] = useState(1);
  const [openSocial, setOpenSocial] = useState(null);

  useEffect(() => {
    if (userInfo?.domain) {
      setNumberDomain(
        userInfo?.domain?.length > 0 ? userInfo?.domain?.length : 1
      );
    }
    if (userInfo?.archivement) {
      setNumberArchivement(userInfo?.archivement?.length);
    }
  }, [userInfo]);

  const domainOptions = domain?.map((item) => {
    return {
      value: item.id,
      label: removeVietnameseTones(item.name),
      color: item.color,
      subOptions: item.sub_domains.map((item) => ({
        value: item.id,
        label: removeVietnameseTones(item.name),
      })),
    };
  });

  // domainOptions.unshift({
  //   value: null,
  //   label: "",
  // });

  const [isEdit, setIsEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: userInfo?.first_name,
      last_name: userInfo?.last_name,
      age: userInfo?.age,
      color: userInfo?.color,
      city: userInfo?.city,
      district: userInfo?.district,
      university: userInfo?.university,
      team_member_count: userInfo?.team_member_count,
      bio: userInfo?.bio,
      competition: userInfo?.competition?.[0]?.id,
      year_competition: userInfo?.competition?.[0]?.year_competition,
      domain_1: userInfo?.domain?.[0]?.id || null,
      sub_domain_1: userInfo?.domain?.[0]?.sub_domains || null,
      domain_2: userInfo?.domain?.[1]?.id || null,
      sub_domain_2: userInfo?.domain?.[1]?.sub_domains || null,
      skill_set: userInfo?.skill_set,
      bio_image: userInfo?.bio_image,
      archivement: userInfo?.archivement,
      link_1: userInfo?.social_link?.instagram || null,
      link_2: userInfo?.social_link?.email || null,
      link_3: userInfo?.social_link?.linkedin || null,
      gender: userInfo?.gender,
    },
  });

  const achievements = watch("archivement");

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
    setIsLoadingBioImage(true);
    const files = Array.from(e.target.files);
    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          const res = await uploadFile(data);
          return res;
        })
      );
      setValue("bio_image", [...(watch("bio_image") || []), ...uploadedFiles]);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoadingBioImage(false);
    }
  };

  const handleUpdateSetting = (data) => {
    const ageValue = Number(data.age);

    if (isNaN(ageValue) || ageValue < 18) {
      setError("age", {
        type: "manual",
        message: "Age must be a number and greater than or equal to 18",
      });
      return;
    }

    data.domains = [];
    if (data?.sub_domain_1?.length > 0) {
      data.domains = data.sub_domain_1.map((id) => ({ id, order: 1 }));
      delete data.sub_domain_1;
      delete data.domain_1;
    }

    if (data?.sub_domain_2?.length > 0) {
      data.domains = [
        ...data.domains,
        ...data.sub_domain_2.map((id) => ({ id, order: 2 })),
      ];

      delete data.sub_domain_2;
      delete data.domain_2;
    }

    if (data?.domain_1) {
      data.domains.push({ id: data.domain_1, order: 1 });
      delete data.domain_1;
    }

    if (data?.domain_2) {
      data.domains.push({ id: data.domain_2, order: 2 });
      delete data.domain_2;
    }

    delete data.domain_1;
    delete data.domain_2;
    delete data.sub_domain_1;
    delete data.sub_domain_2;

    data.competition = [
      {
        id: data.competition,
        year_competition: data.year_competition,
      },
    ];
    delete data.year_competition;
    if (data.bio_image?.length > 0) {
      data.bio_image = data.bio_image.map((img) => img.id);
    }

    if (data.archivement) {
      if (typeof data.archivement === "string") {
        data.archivement = [
          {
            description: data.archivement,
          },
        ];
      }
    }

    data.social_link = {
      instagram: data.link_1 || null,
      email: data.link_2 || null,
      linkedin: data.link_3 || null,
    };

    delete data.link_1;
    delete data.link_2;
    delete data.link_3;

    updateProfile(data)
      .then((res) => {
        dispatch(setUserInfo(res));
        toggleOpenModalSetting();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const competitionOptions = competition?.map((item) => {
    return {
      value: item.id,
      label: removeVietnameseTones(item.name),
    };
  });

  // competitionOptions.unshift({
  //   value: null,
  //   label: "",
  // });

  const universityOptions = university?.map((item) => {
    return {
      value: String(item.id),
      label: removeVietnameseTones(item.name),
    };
  });

  const psOptions = p?.map((item) => {
    return {
      value: item.code,
      label: removeVietnameseTones(item.name),
    };
  });

  const dsOptions = d
    ?.filter((item) => String(item.province_code) === String(watch("city")))
    .map((item) => ({
      value: item.code,
      label: removeVietnameseTones(item.name),
    }));

  const colorOptions = [
    {
      value: "#ff0000",
      title: "ferno",
      label: "the one with a burning passion, always pushing forward.",
    },
    {
      value: "#0000ff",
      title: "ocea",
      label:
        "quiet but incredibly competent and productive in everything they do.",
    },
    {
      value: "#00ff00",
      title: "jade",
      label: "the heart of the team, radiates positive energy to everyone.",
    },
    {
      value: "#ffff00",
      title: "aura",
      label: "the most creative, always coming up with new ideas.",
    },
  ];

  const handleChangeFilter = (name, value) => {
    setValue(name, value);
  };

  const handleDeleteDomain = () => {
    setValue("domain_2", null);
    setValue("sub_domain_2", null);
    setNumberDomain(1);
  };  

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-95 z-20"
        onClick={toggleOpenModalSetting}
      />
      <div className="w-[100vw] h-[90vh] bg-transparent opacity-100 absolute z-30 p-[22px]">
        <div className="w-[532px] h-[90vh] max-h-[100vh] p-[28px] text-white bg-[#171717] rounded-[20px] relative z-50">
          <div className="border-b-[1px] pb-[28px] mb-[22px] border-b-[#212121] flex items-center">
            {userInfo?.is_update_setting && (
              <div
                className="mr-2 cursor-pointer"
                onClick={toggleOpenModalSetting}
              >
                <Image src={BackIcon} alt="back-icon" width={24} height={24} />
              </div>
            )}
            <span className="m-title">Profile Setting</span>
          </div>
          <div className="mb-[40px] max-h-[70vh] overflow-y-auto pb-12">
            <div className="flex items-center justify-between my-[22px] gap-[12px]">
              <div className="flex items-center gap-[12px]">
                {(selectedImage || userInfo?.avatar?.file) && !isEdit ? (
                  <div className="m-av rounded-full overflow-hidden w-[90px] h-[90px]">
                    <Image
                      src={selectedImage || userInfo?.avatar?.file}
                      alt="avatar"
                      width={90}
                      height={90}
                      className="rounded-full"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectPosition: "center",
                        objectFit: "cover",
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
                  <div className="flex items-center gap-[6px]">
                    <span className="m-name">{watch("first_name")}</span>
                    <span className="m-name">{watch("last_name")}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-[6px]">
                    <input
                      className="outline-0 bg-transparent border-b-[1px] border-b-[#fff] w-[60px]"
                      {...register("first_name")}
                      required={true}
                    />
                    <input
                      className="outline-0 bg-transparent border-b-[1px] border-b-[#fff] w-[60px]"
                      {...register("last_name")}
                      required={true}
                    />
                  </div>
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

            <div>
              <label className="m-label">Who are you in your team?</label>
              <div className="grid grid-cols-1 md:grid-cols-2 w-100 items-start justify-start gap-[12px] pt-[12px] pb-[24px]">
                {colorOptions?.map((item) => (
                  <div
                    key={item.value}
                    className="flex items-start justify-start gap-[6px] border-[1px] border-[#212121] rounded-[10px] p-[12px] h-[100px] hover:border-[#e5e5e5] cursor-pointer"
                    onClick={() => {
                      setValue("color", item.value);
                    }}
                    style={
                      watch("color") === item.value
                        ? { border: "1px solid #666" }
                        : {}
                    }
                  >
                    <div
                      className={`h-[12px] w-[12px] rounded-full mt-[3px]`}
                      style={{ backgroundColor: item.value }}
                    ></div>
                    <div className="flex flex-col w-[90%] items-start justify-start">
                      <span className="text-[12px]">{item.title}</span>
                      <span className="text-[12px] font-[500] text-[#666] lh-[18px]">
                        {item.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {errors.color && (
              <div className="text-[#ff0000] text-[12px] mb-2">
                {"This field is required"}
              </div>
            )}
            <div className="form-double-item">
              <InputForm
                title={"Age"}
                placeholder={"Age"}
                register={register}
                name={"age"}
                required={true}
              />
              <SelectForm
                options={genderChoices}
                label={"Gender"}
                placeholder={"Gender"}
                noIcon={true}
                name={"gender"}
                handleChangeFilter={handleChangeFilter}
                defaultValue={watch("gender")}
                required={true}
              />
            </div>
            {errors.age ||
              (errors.gender && (
                <div className="text-[#ff0000] text-[12px] mb-2">
                  {"This field is required"}
                </div>
              ))}
            <div className="form-double-item">
              <SelectForm
                options={psOptions}
                label={"City"}
                placeholder={"City"}
                noIcon={true}
                name={"city"}
                handleChangeFilter={handleChangeFilter}
                defaultValue={watch("city")}
                required={true}
              />
              <SelectForm
                options={dsOptions}
                label={"District"}
                placeholder={"District"}
                noIcon={true}
                name={"district"}
                handleChangeFilter={handleChangeFilter}
                defaultValue={watch("district")}
                required={true}
              />
            </div>
            {(errors.city || errors.district) && (
              <div className="text-[#ff0000] text-[12px] mb-2">
                {"This field is required"}
              </div>
            )}
            <div className="form-double-item">
              <SelectForm
                options={universityOptions}
                label={"University"}
                placeholder={"University"}
                noIcon={true}
                name={"university"}
                handleChangeFilter={handleChangeFilter}
                defaultValue={watch("university")}
                required={true}
              />
              <SelectForm
                options={memberOptions}
                label={"Team Member"}
                placeholder={"Team Member"}
                noIcon={true}
                name={"team_member_count"}
                handleChangeFilter={handleChangeFilter}
                defaultValue={watch("team_member_count")}
                required={true}
              />
            </div>
            {(errors.university || errors.team_member_count) && (
              <div className="text-[#ff0000] text-[12px] mb-2">
                {"This field is required"}
              </div>
            )}
            <div className="form-double-item">
              <SelectForm
                options={competitionOptions}
                label={"Competition"}
                placeholder={"Competition"}
                noIcon={true}
                name={"competition"}
                handleChangeFilter={handleChangeFilter}
                defaultValue={watch("competition")}
                required={true}
              />
              <SelectForm
                options={yearOptions}
                label={"Year"}
                placeholder={"Year"}
                noIcon={true}
                name={"year_competition"}
                handleChangeFilter={handleChangeFilter}
                defaultValue={watch("year_competition")}
                required={true}
              />
            </div>
            {(errors.competition || errors.year_competition) && (
              <div className="text-[#ff0000] text-[12px] mb-2">
                {"This field is required"}
              </div>
            )}

            <SelectForm
              options={domainOptions}
              label={`Domain (1/2)`}
              placeholder={"Domain"}
              noIcon={true}
              haveSub={true}
              cstyle={{
                marginBottom: `${!watch("domain_1") ? "12px" : "0px"}`,
              }}
              sub={watch("domain_1")}
              name={"domain_1"}
              handleChangeFilter={handleChangeFilter}
              defaultValue={watch("domain_1")}
              required={true}
            />
            {watch("domain_1") && (
              <div
                className="bg-[#171717] flex flex-wrap w-100 gap-[6px] px-[12px] py-[8px] mb-[12px] rounded-b-[8px]"
                style={{
                  borderBottom: "1px solid #2e2e2e",
                  borderLeft: "1px solid #2e2e2e",
                  borderRight: "1px solid #2e2e2e",
                }}
              >
                {domainOptions
                  ?.find((item) => item.value === watch("domain_1"))
                  ?.subOptions?.map((item) => {
                    return (
                      <span
                        key={item.value}
                        className="sub-option hover:opacity-80"
                        style={{
                          backgroundColor:
                            Array.isArray(watch("sub_domain_1")) &&
                            watch("sub_domain_1").includes(item.value)
                              ? "#fff"
                              : "#171717",
                          color:
                            Array.isArray(watch("sub_domain_1")) &&
                            watch("sub_domain_1").includes(item.value)
                              ? "#000"
                              : "#595959",
                        }}
                        onClick={() => {
                          const update = watch("sub_domain_1") || [];
                          if (update?.includes(item.value)) {
                            setValue(
                              "sub_domain_1",
                              update.filter((value) => value !== item.value)
                            );
                          } else {
                            setValue("sub_domain_1", [...update, item.value]);
                          }
                        }}
                      >
                        {item.label}
                      </span>
                    );
                  })}
              </div>
            )}

            {numberDomain === 1 && (
              <div
                className="mt-[12px] mb-[20px] cursor-pointer text-[#e5e5e5] text-[12px] font-[400] flex gap-2 items-center"
                onClick={() => setNumberDomain(2)}
              >
                <Image src={AddIcon} width={12} height={12} alt="plus" />
                <span>More domain</span>
              </div>
            )}

            {numberDomain === 2 && (
              <>
                <SelectForm
                  options={domainOptions}
                  label={`Domain (2/2)`}
                  placeholder={"Domain"}
                  noIcon={true}
                  haveSub={true}
                  cstyle={{
                    marginBottom: `${!watch("domain_2") ? "12px" : "0px"}`,
                  }}
                  sub={watch("domain_2")}
                  name={"domain_2"}
                  handleChangeFilter={handleChangeFilter}
                  defaultValue={watch("domain_2")}
                  required={true}
                  clearBtn={true}
                  handleDeleteDomain={handleDeleteDomain}
                />
                {watch("domain_2") && (
                  <div
                    className="bg-[#171717] flex flex-wrap w-100 gap-[6px] px-[12px] py-[8px] mb-[12px] rounded-b-[8px]"
                    style={{
                      borderBottom: "1px solid #2e2e2e",
                      borderLeft: "1px solid #2e2e2e",
                      borderRight: "1px solid #2e2e2e",
                    }}
                  >
                    {domainOptions
                      ?.find((item) => item.value === watch("domain_2"))
                      ?.subOptions?.map((item) => {
                        return (
                          <span
                            key={item.value}
                            className="sub-option hover:opacity-80"
                            style={{
                              backgroundColor:
                                Array.isArray(watch("sub_domain_2")) &&
                                watch("sub_domain_2").includes(item.value)
                                  ? "#fff"
                                  : "#171717",
                              color:
                                Array.isArray(watch("sub_domain_2")) &&
                                watch("sub_domain_2").includes(item.value)
                                  ? "#000"
                                  : "#595959",
                            }}
                            onClick={() => {
                              const update = watch("sub_domain_2") || [];
                              if (update?.includes(item.value)) {
                                setValue(
                                  "sub_domain_2",
                                  update.filter((value) => value !== item.value)
                                );
                              } else {
                                setValue("sub_domain_2", [
                                  ...update,
                                  item.value,
                                ]);
                              }
                            }}
                          >
                            {item.label}
                          </span>
                        );
                      })}
                  </div>
                )}
              </>
            )}

            {errors.domain_1 && (
              <div className="text-[#ff0000] text-[12px] mb-2">
                {"This field is required"}
              </div>
            )}

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
              required={true}
              isMulti={true}
            />
            {errors.skill_set && (
              <div className="text-[#ff0000] text-[12px] mb-2">
                {"This field is required"}
              </div>
            )}

            {achievements?.length === 0 ? (
              <div className="relative">
                <InputForm
                  title={"Archivement"}
                  placeholder={
                    "An academic or professional achievement, an award you've won, or something impressive you've built."
                  }
                  register={register}
                  name={`archivement[0].description`}
                  isEditor={true}
                  // required={true}
                />
              </div>
            ) : (
              <>
                {achievements?.slice(0, 1).map((achievement, index) => (
                  <div className="relative" key={index}>
                    <InputForm
                      title={`Achievement`}
                      placeholder={
                        "An academic or professional achievement, an award you've won, or something impressive you've built."
                      }
                      register={register}
                      name={`archivement[0].description`}
                      isEditor={true}
                      // required={true}
                      defaultValue={achievement?.description}
                    />
                  </div>
                ))}
              </>
            )}

            <InputForm
              title={"Tldr"}
              placeholder={
                "I am Quoc Anh from neu, I study finance and like to eat banh bao + play basketball."
              }
              register={register}
              name={"bio"}
              isEditor={true}
              required={true}
            />
            {errors.bio && (
              <div className="text-[#ff0000] text-[12px] mb-2">
                {"This field is required"}
              </div>
            )}

            <div className="contact-l">
              <span
                style={{
                  color: "#fff !important",
                }}
              >
                Social
              </span>
              <div className="flex social items-center">
                <div
                  className="social-icon"
                  onClick={() => {
                    if (openSocial === "1") {
                      setOpenSocial("");
                    } else {
                      setOpenSocial("1");
                    }
                  }}
                >
                  <Image src={InstagramIcon} alt="image" />
                </div>
                <div
                  className="social-icon"
                  onClick={() => {
                    if (openSocial === "2") {
                      setOpenSocial("");
                    } else {
                      setOpenSocial("2");
                    }
                  }}
                >
                  <Image src={FacebookIcon} alt="image" />
                </div>
                <div
                  className="social-icon"
                  onClick={() => {
                    if (openSocial === "3") {
                      setOpenSocial("");
                    } else {
                      setOpenSocial("3");
                    }
                  }}
                >
                  <Image src={LinkedInIcon} alt="image" />
                </div>
              </div>
            </div>

            {openSocial && (
              <input
                className="p-1 rounded-[4px] pl-2 bg-[#171717] outline-none text-[12px] w-100 min-w-[200px]"
                style={{ border: "1px solid #2e2e2e" }}
                defaultValue={watch(`link_${openSocial}`)}
                placeholder="https://"
                onChange={(e) => {
                  setValue(`link_${openSocial}`, e.target.value);
                }}
              ></input>
            )}

            <div className="more mt-[12px]">
              <label>Bio Image ({watch('bio_image')?.length}/3)</label>
              {isLoadingBioImage ? (
                <div className="w-[150px] h-[150px] rounded-[8px] bg-[#222] flex items-center justify-center relative">
                  <BeatLoader color="#fff" size={10} />
                </div>
              ) : (
                <div className="flex items-center gap-[2px] relative w-[490px] flex-wrap">
                  {watch("bio_image")?.length > 0 && (
                    <>
                      {watch("bio_image").map((image, index) => (
                        <div
                          key={index}
                          style={{
                            position: "relative",
                            display: "inline-block",
                            marginRight: "10px",
                            width: "150px",
                          }}
                        >
                          <Image
                            src={image?.file}
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
                          <div
                            className="absolute top-[10px] left-[120px] cursor-pointer"
                            onClick={() => {
                              const newBioImages = watch("bio_image").filter(
                                (_, i) => i !== index
                              );
                              setValue("bio_image", newBioImages);
                            }}
                          >
                            <Image
                              src={TrashIcon}
                              alt="edit-icon"
                              width={16}
                              height={16}
                            />
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {watch("bio_image")?.length < 3 && (
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
                  )}
                </div>
              )}
            </div>
            {errors.bio_image && (
              <div className="text-[#ff0000] text-[12px] mb-2">
                {"This field is required"}
              </div>
            )}
          </div>
          <div className="absolute bottom-4 w-[484px] bg-[#171717]">
            <div className="flex items-center gap-[6px] w-100 ">
              {userInfo?.is_update_setting && (
                <ButtonComponent
                  type={"button"}
                  title={"Cancel"}
                  border
                  backgroundColor={"transparent"}
                  color={"#ffffff"}
                  onClick={toggleOpenModalSetting}
                />
              )}
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
