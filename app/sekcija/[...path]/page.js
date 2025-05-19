import CategoryData from "@/components/sections/categories/CategoryPage";

const Section = async ({
  params: { path },
  searchParams: { sort: sortURL, strana },
}) => {
  let slug;
  switch (true) {
    case path[path?.length - 1] === "preporuceno":
      slug = "recommendation";
      break;
    default:
      break;
  }

  //vadimo sort iz URL
  const sort = (sortURL ?? "_")?.split("_");
  const sortField = sort[0];
  const sortDirection = sort[1];

  return (
    <>
      <CategoryData
        slug={slug}
        sortDirection={sortDirection}
        sortField={sortField}
        isSection
        strana={strana}
        allFilters={[]}
      />
    </>
  );
};

export default Section;
