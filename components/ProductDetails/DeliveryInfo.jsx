import Image from "next/image";

const DeliveryInfo = () => {
  return (
    <div className="mt-5 flex w-full flex-row items-center justify-between gap-[10px] py-5 md:fixed md:right-0 md:top-[30%] md:z-[100] md:mt-0 md:max-w-[114px] md:flex-col md:items-center md:justify-center md:gap-[30px] md:rounded-l-lg md:bg-white md:px-5 md:py-[37px] md:text-center md:drop-shadow-2xl">
      <div className="flex flex-col items-center justify-center text-center">
        <Image
          src="/icons/package.png"
          alt="free delivery"
          width={50}
          height={50}
          className="primaryFilter h-auto w-[30px] md:w-[50px]"
        />
        <p className="regular text-sm">Besplatna dostava</p>
      </div>
      <div className="flex flex-col items-center justify-center text-center">
        <Image
          src="/icons/calendar.png"
          alt="2 dana isporuka"
          width={47}
          height={42}
          className="primaryFilter h-auto w-[30px] md:w-[47px]"
        />
        <p className="regular text-sm">2 dana isporuka</p>
      </div>
      <div className="flex flex-col items-center justify-center text-center">
        <Image
          src="/icons/delivery-status.png"
          alt="Povrat do 14 dana"
          width={46}
          height={46}
          className="primaryFilter h-auto w-[30px] md:w-[46px]"
        />
        <p className="regular text-sm">Povrat do 14 dana</p>
      </div>
    </div>
  );
};

export default DeliveryInfo;
