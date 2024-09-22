import React from "react";
import "./common.css";
import Select, { components } from "react-select";
import University from "@/public/icons/university-icon.svg";
import Image from "next/image";

const SelectForm = ({
  options,
  placeholder,
  label,
  noIcon,
  noLabel,
  haveSub,
  cstyle,
  handleChange,
  name,
  value
}) => {
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
          color: "#ffffff",
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
            <Image src={University} alt="university" className="image" />
          </div>
        )}
        {children}

        {haveSub && <div className="h-[20px] flex w-100 flex-wrap">abc</div>}
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
        {noIcon ? (
          <></>
        ) : (
          <div
            style={{
              width: "calc((18 / 1920) * 100vw)",
              height: "calc((18 / 1920) * 100vw)",
            }}
          >
            <Image src={University} alt="university" className="image" />
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
        <label htmlFor="custom-select" style={{ color: "#484848" }}>
          {label || "UNIVERSITY"}
        </label>
      )}
      <Select
        id="custom-select"
        placeholder={placeholder || "Choose University"}
        options={options || fakeOptions}
        components={{
          SingleValue: CustomSingleValue,
          Placeholder: CustomPlaceholder,
        }}
        styles={customStyles}
        value={options && options.find((option) => option.value === value)}
        onChange={(e)=> handleChange(name, e.value)}
      />
    </div>
  );
};

export default SelectForm;
