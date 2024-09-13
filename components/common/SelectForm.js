import React from "react";
import "./common.css";
import Select, { components } from "react-select";
import University from "@/public/icons/university-icon.svg";
import Image from "next/image";

const SelectForm = () => {
  const CustomSingleValue = ({ children, ...props }) => (
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
        }}
      >
        <div
          style={{
            width: "calc((18 / 1920) * 100vw)",
            height: "calc((18 / 1920) * 100vw)",
          }}
        >
          <Image src={University} alt="university" className="image" />
        </div>{" "}
        {children}
      </div>
    </components.SingleValue>
  );

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
        }}
      >
        <div
          style={{
            width: "calc((18 / 1920) * 100vw)",
            height: "calc((18 / 1920) * 100vw)",
          }}
        >
          <Image src={University} alt="university" className="image" />
        </div>{" "}
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
      borderColor: state.isFocused ? "#000000" : "#cccccc",
      borderRadius: "8px",
      boxShadow: "none",
      "&:hover": {
        borderColor: state.isFocused ? "#000000" : "#cccccc",
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
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#bbbbbb"
        : state.isFocused
        ? "#dddddd"
        : "transparent",
      color: "#000000",
      cursor: "pointer",
    }),
  };

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "vanilla", label: "Vanilla" },
    { value: "strawberry", label: "Strawberry" },
  ];

  return (
    <div className="select-form">
      <label htmlFor="custom-select">UNIVERSITY</label>
      <Select
        id="custom-select"
        placeholder="Choose University"
        options={options}
        components={{
          SingleValue: CustomSingleValue,
          Placeholder: CustomPlaceholder,
        }}
        styles={customStyles}
      />
    </div>
  );
};

export default SelectForm;
