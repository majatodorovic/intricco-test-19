"use client";

import React, { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetch as FETCH } from "@/api/api";
import { DisplayStars } from "../_components";

/**
 * Component for displaying a product's review summary, including the average rating,
 * total number of reviews, and the distribution of ratings ★.
 *
 * @param {string} props.id_product - The ID of the product for which the review summary is fetched.
 * @param {array} marksOptions - marks options
 */
const MarksSummary = ({ id_product, marksOptions }) => {
  // Fetch summary reviews for the product
  const { data } = useSuspenseQuery({
    queryKey: ["marksSummary", id_product],
    queryFn: async () => {
      const response = await FETCH(`product-details/reviews/marks/summary`, {
        id_product,
      });
      return response?.payload;
    },
  });

  // Process the review data and calculate the average, total, and percentage distributions
  const reviewsData = useMemo(() => {
    if (!data?.marks) return null;

    // Total number of reviews and average mark
    const totalReviews = data.marks.reviews_total || 0;
    const averageMark = parseFloat(data.marks.average_mark).toFixed(1) || "0.0";
    const reviewsByMarks = data.marks.reviews_total_by_marks || [];

    // Extract the distribution of reviews by marks (5★ to 1★)
    const marksDistribution = marksOptions.reduce((acc, mark) => {
      acc[mark] =
        reviewsByMarks.find((item) => item.mark === `${mark}.00`)?.count || 0;
      return acc;
    }, {});

    // Calculate percentages for each rating
    const percentages = Object.entries(marksDistribution).map(
      ([mark, count]) => ({
        mark,
        count,
        percentage: (count / totalReviews) * 100,
      })
    );

    // Round percentages and adjust to ensure the total is exactly 100%
    const roundedPercentages = percentages.map((item) => ({
      ...item,
      percentage: Math.floor(item.percentage),
    }));

    let totalRounded = roundedPercentages.reduce(
      (sum, item) => sum + item.percentage,
      0
    );

    // Distribute the remaining percentage to the highest differences
    while (totalRounded < 100) {
      const diffItem = percentages
        .map((item, index) => ({
          index,
          diff: item.percentage - roundedPercentages[index].percentage,
        }))
        .sort((a, b) => b.diff - a.diff)[0];

      roundedPercentages[diffItem.index].percentage += 1;
      totalRounded += 1;
    }

    // Sort the distribution to display ratings from 5★ to 1★
    const sortedDistribution = roundedPercentages.sort(
      (a, b) => parseInt(b.mark, 10) - parseInt(a.mark, 10)
    );

    return { totalReviews, averageMark, marksDistribution: sortedDistribution };
  }, [data]);

  return (
    <div className="review-container max-w-md mx-auto p-4 w-full">
      <div className="text-center flex flex-row items-center">
        <span className="text-[60px] font-semibold mr-3">
          {reviewsData.averageMark}
        </span>
        <div>
          <DisplayStars
            mark={reviewsData.averageMark}
            marksOptions={marksOptions}
          />
          <p className="text-sm text-gray-500">{`(${reviewsData.totalReviews} Ratings)`}</p>
        </div>
      </div>
      <div className="mt-2">
        {reviewsData.marksDistribution.map((item) => (
          <div
            key={item.mark}
            className="flex items-center justify-between mb-1"
          >
            <span className="text-sm text-gray-700">{item.mark} ★</span>
            <div className="flex-1 mx-2 bg-gray-200 rounded">
              <div
                className="bg-yellow-500 h-2 rounded"
                style={{
                  width: `${
                    reviewsData.totalReviews == 0 ? 0 : item.percentage
                  }%`,
                }}
              ></div>
            </div>
            <span className="text-sm text-gray-500">{`${item.count} ${
              reviewsData.totalReviews == 0 ? "" : item.percentage + "%"
            } `}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarksSummary;
