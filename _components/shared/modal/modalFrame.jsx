"use client";
import { icons } from "@/_lib/icons";

const ModalFrame = ({ display, handleClose, children }) => {
  return (
    <>
      <div
        className={
          display
            ? `fixed bottom-0 right-0 top-0 left-0 max-sm:w-[95%] w-full max-w-xl rounded-lg h-fit m-auto z-[2002] bg-white p-5`
            : `hidden`
        }
      >
        <div className="absolute flex items-center justify-end right-4">
          <span
            className={`w-[1.5rem] hover:text-red-500 cursor-pointer`}
            onClick={handleClose}
          >
            {icons.close}
          </span>
        </div>

        {children}
      </div>
      <div
        onClick={handleClose}
        className={
          display
            ? `fixed top-0 left-0 bg-black/70 h-[100dvh] w-[100dvw] z-[2001]`
            : ``
        }
      />
    </>
  );
};

export default ModalFrame;
