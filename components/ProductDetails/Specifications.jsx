"use client";

import {
  useProductDescription,
  useProductSpecification,
} from "@/hooks/ecommerce.hooks";
import React, { useState } from "react";

const Specifications = ({ id }) => {
  const { data: specification } = useProductSpecification({ slug: id });
  const { data: desc } = useProductDescription({ slug: id });

  const [activeTab, setActiveTab] = useState("description");

  return (
    <>
      {(specification.length > 0 || desc?.description) && (
        <div
          className={`mt-4 flex h-full max-h-[250px] flex-col gap-2 overflow-y-auto md:max-w-[95%] lg:mt-16`}
        >
          {specification?.length > 0 &&
            specification?.map((item) => {
              return (
                <div key={item?.set?.id}>
                  <div
                    onClick={() =>
                      setActiveTab(
                        activeTab === item?.set?.id ? null : item?.set?.id,
                      )
                    }
                    className={`flex cursor-pointer items-center justify-between text-xl font-normal text-primary ${
                      activeTab === item?.set?.id && "!font-semibold"
                    } `}
                  >
                    <span className={`uppercase`}>
                      {item?.groups[0]?.attributes[0]?.attribute.name}
                    </span>
                    <i
                      className={`fa fa-solid pr-2 transition-all duration-500 fa-chevron-${
                        activeTab === item?.set?.id ? "up" : "down"
                      }`}
                    />
                  </div>
                  {activeTab === item?.set?.id && (
                    <div
                      className={`customScroll max-h-[150px] overflow-y-auto py-2 lg:px-3`}
                    >
                      <p>
                        {item?.groups[0]?.attributes[0]?.values?.map((val) => (
                          <p key={val?.id}>- {val?.name}</p>
                        ))}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

          <div>
            <div
              onClick={() =>
                setActiveTab(activeTab === "description" ? null : "description")
              }
              className={`flex cursor-pointer items-center justify-between text-xl font-normal text-primary ${activeTab === "description" && "!font-semibold"}`}
            >
              OPIS
              <i
                className={`fa fa-solid pr-2 transition-all duration-500 fa-chevron-${
                  activeTab === "description" ? "up" : "down"
                }`}
              />
            </div>
            {activeTab === "description" && (
              <div
                className={`customScroll max-h-[150px] overflow-y-auto py-2 lg:px-3`}
              >
                <p dangerouslySetInnerHTML={{ __html: desc?.description }}></p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Specifications;
