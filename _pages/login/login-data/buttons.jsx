"use client";
export const Buttons = ({ handleOpen, buttons }) => {
  return (
    <div className={`mt-5 flex flex-col items-center gap-5 sm:flex-row`}>
      <button
        name={buttons?.first?.name}
        onClick={({ target: { name } }) => {
          handleOpen(name);
        }}
        className={`bg-gray-100 hover:bg-gray-200/80 w-full border px-4 py-2 font-medium text-black shadow focus:outline-none focus:ring-2 focus:ring-[#04b400] focus:ring-offset-2 focus:ring-offset-white sm:text-sm`}
      >
        {buttons?.first?.text}
      </button>
      <button
        name={buttons?.second?.name}
        onClick={({ target: { name } }) => {
          handleOpen(name);
        }}
        className={`bg-gray-100 hover:bg-gray-200/80 w-full border px-4 py-2 font-medium text-black shadow focus:outline-none focus:ring-2 focus:ring-[#04b400] focus:ring-offset-2 focus:ring-offset-white sm:text-sm`}
      >
        {buttons?.second?.text}
      </button>
    </div>
  );
};
