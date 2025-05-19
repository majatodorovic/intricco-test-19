import { get } from "@/api/api";
import Link from "next/link";

const getCategories = () => {
  return get("/categories/product/tree").then((res) => res?.payload);
};

const AllCategories = async () => {
  const categories = await getCategories();

  const renderCategories = (categories) => {
    return (categories ?? [])?.map((item) => {
      let has_children = item?.children?.length > 0 && item?.children;
      if (has_children) {
        return (
          <div key={item?.id} className={`col-span-1 h-fit w-full`}>
            <div className={`flex items-center justify-between`}>
              <Link
                href={`/${item?.link?.link_path}`}
                className={`hover:text-croonus-3 ${
                  !item?.parent_id ? "text-xl font-medium" : ""
                }`}
              >
                {item?.name}
              </Link>
            </div>
            {renderCategories(item?.children)}
          </div>
        );
      } else {
        return (
          <div key={item?.id} className={`col-span-1 h-fit w-full`}>
            <Link
              href={`/${item?.link?.link_path}`}
              className={`hover:text-croonus-3 ${
                !item?.parent_id ? "text-xl font-medium" : ""
              }`}
            >
              {item?.name}
            </Link>
          </div>
        );
      }
    });
  };

  return (
    <div className={`sectionWidth overflow-visible`}>
      <div className="mt-5">
        <div className={`flex items-center gap-2`}>
          <Link className={`text-[0.95rem]`} href={`/`}>
            Intricco Underwear
          </Link>
          <span className={`text-[0.95rem]`}>/</span>
          <span className={`text-[0.95rem] font-bold text-primary`}>
            Sve kategorije
          </span>
        </div>
        <h1
          className={`my-5 w-full border-b pb-2 text-[23px] font-normal md:text-[29px]`}
        >
          Sve kategorije
        </h1>
      </div>
      <div className={`grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4`}>
        {renderCategories(categories)}
      </div>
    </div>
  );
};

export default AllCategories;
