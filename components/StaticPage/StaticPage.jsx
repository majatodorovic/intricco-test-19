import Image from "next/image";

const StaticPage = ({ data }) => {
  const staticData = data?.items?.map((item) => {
    return item;
  });

  const keyGenerator = (prefix) => {
    return `${prefix}-${Math.random().toString(36)}`;
  };

  return (
    <div className={`sectionWidth mt-10`}>
      <h1
        className={`mb-5 mt-5 w-full border-b pb-2 text-[23px] font-normal md:text-[29px]`}
      >
        {staticData[0].content}
      </h1>
      {staticData?.slice(1).map((item) => {
        switch (item?.type) {
          case "multiple_images":
            return (
              <div
                key={keyGenerator("multiple_images")}
                className={`leading-tight`}
              >
                {item?.content?.map((image) => {
                  return (
                    <div
                      key={keyGenerator("image")}
                      className={`relative col-span-1 flex justify-center`}
                    >
                      <div
                        className={`max-sm:h-[220px] sm:h-[350px] lg:h-[550px] 2xl:h-[800px]`}
                      >
                        <Image src={image?.file} alt={``} fill priority />
                      </div>
                    </div>
                  );
                })}
              </div>
            );

          case "html_editor":
            return (
              <div
                key={keyGenerator("html")}
                className={`prose !max-w-full prose-h2:font-medium prose-h3:font-medium`}
                dangerouslySetInnerHTML={{ __html: item?.content }}
              ></div>
            );

          case "textarea":
            return (
              <div
                key={keyGenerator("textarea")}
                className={`prose !max-w-full`}
                dangerouslySetInnerHTML={{ __html: item?.content }}
              ></div>
            );
        }
      })}
    </div>
  );
};

export default StaticPage;
