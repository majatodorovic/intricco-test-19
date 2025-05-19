import React, { useState } from "react";

/**
 * Component for displaying a text block with a "Read More" toggle.
 *
 * @param {string} props.text - The full text to be displayed.
 * @param {number} [props.maxLength=250] - Maximum length of the text before truncation.
 *
 * Truncates text to a maximum length and adds a "Read More" button if the text exceeds it.
 * Toggles between full and truncated text on button click.
 */
const ReadMoreText = ({ text, maxLength = 250 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDisplayText = () => {
    if (isExpanded) return text;
    if (text.length <= maxLength) return text;

    const trimmedText = text.substring(0, maxLength);
    return trimmedText.substring(0, trimmedText.lastIndexOf(" ")) + "...";
  };

  return (
    <div className="text-gray-700 mb-2">
      <p>{getDisplayText()}</p>
      {text.length > maxLength && (
        <button
          className="text-gray-400 hover:underline text-[13px]"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Smanji tekst" : "Pročitaj više"}
        </button>
      )}
    </div>
  );
};

export default ReadMoreText;
