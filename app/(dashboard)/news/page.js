"use client";

import React, { useEffect, useState } from "react";
import "./styles.css";
import Badge from "@/components/common/Badge";
import ModalDetail from "@/components/layout/ModalDetail";

const News = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const handleDetailCard = (index) => {
    if (isModalOpen === index) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(index);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsFirstLoading(false);
    }, 100);
  }, []);

  return isFirstLoading ? (
    <>
      <div className="w-[100vw] h-100 flex items-center justify-center text-white font-[500] text-[24px]">
        Loading...
      </div>
    </>
  ) : (
    <>
      <div className="news-wrapper">
        <div className="flex flex-col">
          <span className="greeting">Hello Duc!</span>
          <span className="description">Have you found a partner yet?</span>
        </div>
        <div className="card-wrapper grid grid-cols-1 md:grid-cols-2">
          {Array(1, 2, 3, 4, 5, 6, 7, 8).map((item, index) => (
            <div
              className="card-item"
              key={index}
              onClick={() => handleDetailCard(index)}
            >
              <div className="card-header flex">
                <div className="avatar"></div>
                <div className="flex flex-col info">
                  <span className="name">Daniel Simon {index + 1}</span>
                  <span className="location">Hanoi</span>
                </div>
              </div>
              <div className="card-body">
                <span className="description">
                  Are you a passionate Python developer eager to create
                  meaningful products? Were looking for you to help us build a
                  free online learning platform to provide education for
                  underprivileged children. Join us in making a difference!
                </span>
                <div className="tags">
                  <Badge
                    backgroundColor={"#DAF4E0"}
                    color={"#009723"}
                    name={"Finance"}
                  />
                  <Badge
                    backgroundColor={"#DAF5FF"}
                    color={"#007DEA"}
                    name={"Business"}
                  />
                  <Badge
                    backgroundColor={"#FFF0DB"}
                    color={"#ED6600"}
                    name={"Marketing"}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen !== false && <ModalDetail isOpen={isModalOpen} />}
    </>
  );
};

export default News;
