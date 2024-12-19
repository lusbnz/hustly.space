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
  handleDelete,
  isSidebar,
  register,
}) => {
  const [selectedValue, setSelectedValue] = useState(
    !isSidebar
      ? options.find((option) => String(option.value) === String(defaultValue))
      : null
  );

  useEffect(() => {
    if (isClear) {
      setSelectedValue(null);
      handleChangeFilter(name, isMulti ? [] : "");
    }
  }, [isClear, handleChangeFilter, name, isMulti]);

  const {
    ref,
    onChange = () => {},
    ...rest
  } = register ? register(name, { required }) : {};

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
            display: "inline-flex",
            alignItems: "center",
            gap: "calc((8 / 1920) * 100vw)",
            whiteSpace: "normal",
            overflow: "visible",
            textOverflow: "ellipsis",
            width: "100%",
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
          <span>{props.data.label}</span>
        </div>
      </components.Option>
    );
  };

  const customStyles = {
    container: (provided) => ({
      ...provided,
      height: isMulti ? "auto" : "36px",
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
      height: isMulti ? "auto" : "36px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
      height: isMulti ? "auto" : "36px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#333333",
      minWidth: "max-content",
      overflowX: "auto",
      zIndex: 1000,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#222222"
        : state.isFocused
        ? "#222222"
        : "#333333",
      color: "#fff",
      fontSize: "12px",
      cursor: "pointer",
      paddingLeft: "calc((18 / 1920) * 100vw)",
      zIndex: 1000,
    }),
    multiValue: (provided) => ({
      ...provided,
      fontSize: "calc((16 / 1920) * 100vw)",
      padding: "calc((2 / 1920) * 100vw) calc((4 / 1920) * 100vw)",
    }),
  };

  const fakeOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "vanilla", label: "Vanilla" },
    { value: "strawberry", label: "Strawberry" },
  ];

  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption);
    if (
      (isMulti && name === "skill_set" && selectedOption.length > 5) ||
      (name === "domain__id" && selectedValue?.length > 2)
    ) {
      return;
    }

    const value = isMulti
      ? selectedOption.map((option) => option.value)
      : selectedOption?.value || "";

    handleChangeFilter(name, value);
    if (!!onChange) {
      onChange(value);
    }
  };

  return (
    <div className="select-form" style={cstyle}>
      {noLabel ? (
        <div className="h-[18px]"></div>
      ) : (
        <div className="flex w-100 justify-between items-center">
          <label htmlFor="custom-select" style={{ color: "#e5e5e5" }}>
            {label || "UNIVERSITY"}{" "}
            {name === "skill_set" && (
              <span style={{ fontSize: "12px" }}>
                {` (${selectedValue?.length || 0}/5)`}
              </span>
            )}
            {name === "domain__id" && !isSidebar && (
              <span style={{ fontSize: "12px" }}>
                {` (${selectedValue?.length || 0}/2)`}
              </span>
            )}
          </label>
          {clearBtn && (
            <Image
              src={Trash}
              sizes="12"
              width={12}
              height={12}
              alt="trash"
              className="cursor-pointer"
              onClick={
                handleDelete
                  ? () => {
                      setSelectedValue(null);
                      if (!!selectedValue) {
                        handleDelete(name);
                      }
                    }
                  : handleDeleteDomain
              }
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
        isOptionDisabled={() =>
          (name === "skill_set" && selectedValue?.length >= 5) ||
          (name === "domain__id" && selectedValue?.length >= 2)
        }
        value={
          isClear
            ? null
            : isMulti
            ? options?.filter((option) =>
                defaultValue?.includes(option.value)
              ) || []
            : selectedValue
        }
        onChange={handleChange}
        ref={ref}
        {...rest}
      />
    </div>
  );
};

export default SelectForm;
