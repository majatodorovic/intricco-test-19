import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Pagination Component for navigating through paginated data.
 * Updates the URL with the current page parameter without reloading the page.
 *
 * @param {Object} pagination - Pagination details.
 * @param {number} pagination.selected_page - The currently selected page.
 * @param {number} pagination.total_pages - Total number of pages.
 * @param {number} pagination.total_items - Total number of items.
 * @param {number} pagination.items_per_page - Number of items displayed per page.
 */

const ApiPagination = ({ pagination }) => {
  if (!pagination) return false;

  const { selected_page, total_pages, total_items, items_per_page } =
    pagination;

  if (total_pages < 2) return false;

  const [currentPage, setCurrentPage] = useState(selected_page);

  useEffect(() => {
    setCurrentPage(selected_page);
  }, [selected_page, total_pages, total_items, items_per_page]);

  // Updates the current page state and modifies the URL with the new page parameter.
  const handlePageChange = (page) => {
    if (page < 1 || page > total_pages) return;
    setCurrentPage(page);

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("strana", page);
    window.history.pushState({}, "", currentUrl);
  };

  //Generates an array of page numbers - first and last pages, current page, ellipses (...)
  const generatePages = () => {
    const pages = [];
    const delta = 2;

    for (let i = 1; i <= total_pages; i++) {
      if (
        i === 1 ||
        i === total_pages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        (i === currentPage - delta - 1 && currentPage - delta > 2) ||
        (i === currentPage + delta + 1 && currentPage + delta < total_pages - 1)
      ) {
        pages.push("...");
      }
    }

    return pages.filter((value, index, self) => self.indexOf(value) === index);
  };

  return (
    <div className="flex mt-6 py-2 items-center justify-end gap-1">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="min-w-[36px] min-h-[36px] flex items-center justify-center border rounded disabled:opacity-50"
      >
        <Image
          src={"/icons/right-chevron.png"}
          alt="back button"
          className="transform rotate-180"
          width={16}
          height={18}
        />
      </button>

      {generatePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && handlePageChange(page)}
          disabled={page === "..."}
          className={`min-w-[36px] min-h-[36px] flex items-center justify-center border rounded select-none ${
            currentPage === page
              ? "bg-[#04b400] text-white"
              : page !== "..." && "hover:border-[#04b400] hover:text-[#04b400]"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === total_pages}
        className="min-w-[36px] min-h-[36px] flex items-center justify-center border rounded disabled:opacity-50"
      >
        <Image
          src={"/icons/right-chevron.png"}
          alt="back button"
          className="transform "
          width={16}
          height={18}
        />
      </button>
    </div>
  );
};

export default ApiPagination;
