"use client";

import React, { useEffect, useState } from "react";
import "./common.css";
import Select, { components } from "react-select";
import University from "@/public/icons/university-icon.svg";
import Trash from "@/public/icons/trash-icon.svg";
import Image from "next/image";

const SelectForm = ({
  options,
  placeholder,
  label,
  noIcon,
  noLabel,
  haveSub,
  cstyle,
  sub,
  handleChangeFilter,
  name,
  defaultValue,
  isClear,
  isColor,
  icon,
  required,
  isMulti,
  clearBtn,
  handleDeleteDomain,
}) => {
  const [selectedValue, setSelectedValue] = useState(null);

  const CustomSingleValue = ({ data, children, ...props }) => {
    return (
      <components.SingleValue {...props}>
        <div
          style={{
            borderRadius: sub ? "20px 20px 0 0" : "20px 20px 20px 20px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "calc((8 / 1920) * 100vw)",
            paddingLeft: "calc((8 / 1920) * 100vw)",
            paddingRight: "calc((18 / 1920) * 100vw)",
            fontSize: "clamp(10px, calc((16 / 1920) * 100vw), 26px)",
            lineHeight: "clamp(10px, calc((16 / 1920) * 100vw), 26px)",
            color: "#ffffff",
          }}
        >
          {isColor && (
            <div
              style={{
                width: "calc((18 / 1920) * 100vw)",
                height: "calc((18 / 1920) * 100vw)",
                borderRadius: "100%",
                backgroundColor: `${data.value}`,
              }}
            ></div>
          )}
          {noIcon ? (
            <></>
          ) : (
            <div
              style={{
                width: "calc((18 / 1920) * 100vw)",
                height: "calc((18 / 1920) * 100vw)",
              }}
            >
              {icon ? (
                icon
              ) : (
                <Image src={University} alt="university" className="image" />
              )}
            </div>
          )}
          {children?.length > 20 ? children?.slice(0, 20) + "..." : children}
        </div>
        {/* {haveSub && <div className="h-[20px] flex w-100 flex-wrap">abc</div>} */}
      </components.SingleValue>
    );
  };

  const CustomPlaceholder = ({ children, ...props }) => (
    <components.Placeholder {...props}>
      <div
        style={{
          borderRadius: sub ? "20px 20px 0 0" : "20px 20px 20px 20px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "calc((8 / 1920) * 100vw)",
          paddingLeft: "calc((8 / 1920) * 100vw)",
          paddingRight: "calc((18 / 1920) * 100vw)",
          fontSize: "clamp(10px, calc((16 / 1920) * 100vw), 26px)",
          lineHeight: "clamp(10px, calc((16 / 1920) * 100vw), 26px)",
        }}
      >
        {noIcon ? (
          <></>
        ) : (
          <div
            style={{
              width: "calc((18 / 1920) * 100vw)",
              height: "calc((18 / 1920) * 100vw)",
            }}
          >
            {icon ? (
              icon
            ) : (
              <Image src={University} alt="university" className="image" />
            )}
          </div>
        )}
        {children}
      </div>
    </components.Placeholder>
  );

  const CustomOption = (props) => {
    return (
      <components.Option {...props}>
        <div
          style={{
            display: "inline-flex", // Đặt hình và text cùng dòng
            alignItems: "center", // Căn giữa theo trục dọc
            gap: "calc((8 / 1920) * 100vw)", // Khoảng cách giữa hình và text
          }}
        >
          {name === "color" && (
            <div
              style={{
                width: "calc((18 / 1920) * 100vw)",
                height: "calc((18 / 1920) * 100vw)",
                borderRadius: "100%",
                backgroundColor: `${props.data.value}`,
              }}
            ></div>
          )}
          <span
            style={{
              whiteSpace: "nowrap", // Đảm bảo text không bị xuống dòng
            }}
          >
            {props.data.label}
          </span>
        </div>
      </components.Option>
    );
  };

  const customStyles = {
    container: (provided) => ({
      ...provided,
      height: isMulti ? "auto" : "calc((52 / 1080) * 100vh)",
      minHeight: "calc((52 / 1080) * 100vh)",
    }),
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#2e2e2e" : "#2e2e2e",
      borderBottom: sub ? "0px" : "1px solid #2e2e2e",
      borderRadius: sub ? "8px 8px 0 0" : "8px 8px 8px 8px",
      boxShadow: "none",
      backgroundColor: "#171717",
      "&:hover": {
        borderColor: state.isFocused ? "#2e2e2e" : "#2e2e2e",
      },
      height: isMulti ? "auto" : "calc((52 / 1080) * 100vh)",
      minHeight: "calc((52 / 1080) * 100vh)",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
      height: isMulti ? "auto" : "calc((52 / 1080) * 100vh)",
      minHeight: "calc((52 / 1080) * 100vh)",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#333333",
      minWidth: "max-content",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#222222"
        : state.isFocused
        ? "#222222"
        : "#333333",
      color: "#fff",
      fontSize: "14px",
      cursor: "pointer",
      paddingLeft: "calc((18 / 1920) * 100vw)",
    }),
  };

  const fakeOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "vanilla", label: "Vanilla" },
    { value: "strawberry", label: "Strawberry" },
  ];

  const handleChange = (selectedOption) => {
    if (isMulti && name === "skill_set" && selectedOption.length > 5) {
      return;
    }

    const value = isMulti
      ? selectedOption.map((option) => option.value)
      : selectedOption?.value || "";

    handleChangeFilter(name, value);
  };

  return (
    <div className="select-form" style={cstyle}>
      {noLabel ? (
        <div className="h-[18px]"></div>
      ) : (
        <div className="flex w-100 justify-between items-center">
          <label htmlFor="custom-select" style={{ color: "#484848" }}>
            {label || "UNIVERSITY"}
          </label>
          {clearBtn && (
            <Image
              src={Trash}
              sizes="12"
              width={12}
              height={12}
              alt="trash"
              className="cursor-pointer"
              onClick={handleDeleteDomain}
            />
          )}
        </div>
      )}
      <Select
        id={name}
        placeholder={placeholder || "Choose University"}
        isMulti={isMulti}
        options={options || fakeOptions}
        components={{
          SingleValue: CustomSingleValue,
          Placeholder: CustomPlaceholder,
          Option: CustomOption,
        }}
        required={required}
        styles={customStyles}
        closeMenuOnSelect={isMulti ? false : true}
        value={
          isClear
            ? null
            : options &&
              options?.find(
                (option) => String(option.value) === String(defaultValue)
              )
        }
        onChange={handleChange}
      />
    </div>
  );
};

export default SelectForm;
