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
  handleChangeFilter,
  name,
  defaultValue,
  isClear,
  isColor,
  icon,
}) => {
  const [selectedValue, setSelectedValue] = useState(null);

  const CustomSingleValue = ({ data, children, ...props }) => {
    return (
      <components.SingleValue {...props}>
        <div
          style={{
            borderRadius: "20px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "calc((8 / 1920) * 100vw)",
            paddingLeft: "calc((18 / 1920) * 100vw)",
            paddingRight: "calc((18 / 1920) * 100vw)",
            fontSize: "clamp(10px, calc((16 / 1920) * 100vw), 26px)",
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
          {/* {haveSub && <div className="h-[20px] flex w-100 flex-wrap">abc</div>} */}
        </div>
      </components.SingleValue>
    );
  };

  const CustomPlaceholder = ({ children, ...props }) => (
    <components.Placeholder {...props}>
      <div
        style={{
          borderRadius: "20px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "calc((8 / 1920) * 100vw)",
          paddingLeft: "calc((18 / 1920) * 100vw)",
          paddingRight: "calc((18 / 1920) * 100vw)",
          fontSize: "clamp(10px, calc((16 / 1920) * 100vw), 26px)",
          lineHeight: "clamp(10px, calc((16 / 1920) * 100vw), 26px)"
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

  const customStyles = {
    container: (provided) => ({
      ...provided,
      height: "calc((52 / 1080) * 100vh)",
    }),
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#222222" : "#222222",
      borderRadius: "8px",
      boxShadow: "none",
      backgroundColor: "#222222",
      "&:hover": {
        borderColor: state.isFocused ? "#222222" : "#222222",
      },
      height: "calc((52 / 1080) * 100vh)",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
      height: "calc((52 / 1080) * 100vh)",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#333333",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#222222"
        : state.isFocused
        ? "#222222"
        : "#333333",
      color: "#ffffff",
      fontSize: "14px",
      cursor: "pointer",
    }),
  };

  const fakeOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "vanilla", label: "Vanilla" },
    { value: "strawberry", label: "Strawberry" },
  ];

  return (
    <div className="select-form" style={cstyle}>
      {noLabel ? (
        <div className="h-[18px]"></div>
      ) : (
        <div className="flex w-100 justify-between items-center">
          <label htmlFor="custom-select" style={{ color: "#484848" }}>
            {label || "UNIVERSITY"}
          </label>
          {selectedValue && (
            <Image
              src={Trash}
              alt="trash"
              className="w-[12px] h-[12px] cursor-pointer"
              onClick={() => {
                setSelectedValue(null);
                handleChangeFilter(name, null);
              }}
            />
          )}
        </div>
      )}
      <Select
        id={name}
        placeholder={placeholder || "Choose University"}
        options={options || fakeOptions}
        components={{
          SingleValue: CustomSingleValue,
          Placeholder: CustomPlaceholder,
        }}
        styles={customStyles}
        value={
          isClear
            ? null
            : options &&
              options?.find(
                (option) => String(option.value) === String(defaultValue)
              )
        }
        onChange={(e) => {
          if (e.value) {
            setSelectedValue(e);
            handleChangeFilter(name, e.value);
          }
        }}
      />
    </div>
  );
};

export default SelectForm;
