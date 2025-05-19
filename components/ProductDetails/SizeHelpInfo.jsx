import { useState, useEffect } from "react";
import Image from "next/image";
import { CloseIcon } from "../svg/CloseIcon";

const Table = ({ openModal }) => {
  return (
    <div
      className={
        openModal
          ? `fixed right-0 top-0 z-[5100] h-screen w-[50%] translate-x-0 border-l bg-white transition-all duration-500 max-md:w-full`
          : `fixed right-0 top-0 z-[5100] h-screen w-[50%] translate-x-full border-l bg-white transition-all duration-500 max-md:w-full`
      }
    >
      <div className={`h-full overflow-y-auto p-6`}>
        <h2 className={`w-full border-b pb-2 text-[1.2rem]`}>
          Tabele mera za žene (gornji deo)
        </h2>
        <div className={`mt-5`}>
          <table className={`w-full`}>
            <thead>
              <tr className={`border-b`}>
                <th className={`text-left`}></th>
                <th className={`text-left`}>XS</th>
                <th className={`text-left`}>S</th>
                <th className={`text-left`}>M</th>
                <th className={`text-left`}>L</th>
                <th className={`text-left`}>XL</th>
                <th className={`text-left`}>XXL</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border-b bg-[#f8f8f8] !py-2`}>
                <td className={`px-2 py-2 text-left font-bold`}>Obim grudi</td>
                <td className={`text-left`}>80-84</td>
                <td className={`text-left`}>84-88</td>
                <td className={`text-left`}>88-92</td>
                <td className={`text-left`}>92-96</td>
                <td className={`text-left`}>89-102</td>
                <td className={`text-left`}>102-106</td>
              </tr>
              <tr className={`border-b !py-2`}>
                <td className={`py-2 pl-2 text-left font-bold`}>Obim struka</td>
                <td className={`text-left`}>60-64</td>
                <td className={`text-left`}>64-68</td>
                <td className={`text-left`}>68-72</td>
                <td className={`text-left`}>72-76</td>
                <td className={`text-left`}>78-82</td>
                <td className={`text-left`}>82-86</td>
              </tr>
              <tr className={`border-b bg-[#f8f8f8] !py-2`}>
                <td className={`px-2 py-2 text-left font-bold`}>Obim kukova</td>
                <td className={`text-left`}>88-92</td>
                <td className={`text-left`}>92-96</td>
                <td className={`text-left`}>96-100</td>
                <td className={`text-left`}>100-104</td>
                <td className={`text-left`}>106-110</td>
                <td className={`text-left`}>110-114</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className={`mt-10 w-full border-b pb-2 text-[1.2rem]`}>
          Tabele mera za žene (donji deo)
        </h2>
        <div className={`mt-5`}>
          <table className={`w-full`}>
            <thead>
              <tr className={`border-b`}>
                <th className={`text-left`}></th>
                <th className={`text-left`}>27</th>
                <th className={`text-left`}>28</th>
                <th className={`text-left`}>29</th>
                <th className={`text-left`}>30</th>
                <th className={`text-left`}>31</th>
                <th className={`text-left`}>32</th>
                <th className={`text-left`}>33</th>
                <th className={`text-left`}>34</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border-b bg-[#f8f8f8] !py-2`}>
                <td className={`py-2 pl-2 text-left font-bold`}>Obim struka</td>
                <td className={`text-left`}>62-65</td>
                <td className={`text-left`}>65-68</td>
                <td className={`text-left`}>68-72</td>
                <td className={`text-left`}>72-74</td>
                <td className={`text-left`}>74-78</td>
                <td className={`text-left`}>78-82</td>
                <td className={`text-left`}>82-28</td>
                <td className={`text-left`}>68-92</td>
              </tr>
              <tr className={`border-b !py-2`}>
                <td className={`py-2 pl-2 text-left font-bold`}>Obim kukova</td>
                <td className={`text-left`}>90-93</td>
                <td className={`text-left`}>93-96</td>
                <td className={`text-left`}>96-99</td>
                <td className={`text-left`}>99-102</td>
                <td className={`text-left`}>102-106</td>
                <td className={`text-left`}>105-110</td>
                <td className={`text-left`}>110-114</td>
                <td className={`text-left`}>114-118</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className={`mt-10 w-full border-b pb-2 text-[1.2rem]`}>
          Tabele mera za muškarce (gornji deo)
        </h2>
        <div className={`mt-5`}>
          <table className={`w-full`}>
            <thead>
              <tr className={`border-b`}>
                <th className={`text-left`}></th>
                <th className={`text-left`}>S</th>
                <th className={`text-left`}>M</th>
                <th className={`text-left`}>L</th>
                <th className={`text-left`}>XL</th>
                <th className={`text-left`}>2XL</th>
                <th className={`text-left`}>3XL</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border-b bg-[#f8f8f8] !py-2`}>
                <td className={`py-2 pl-2 text-left font-bold`}>Obim grudi</td>
                <td className={`text-left`}>96-100</td>
                <td className={`text-left`}>100-104</td>
                <td className={`text-left`}>104-108</td>
                <td className={`text-left`}>110-114</td>
                <td className={`text-left`}>114-118</td>
                <td className={`text-left`}>118-112</td>
              </tr>
              <tr className={`border-b !py-2`}>
                <td className={`py-2 pl-2 text-left font-bold`}>Obim struka</td>
                <td className={`text-left`}>80-84</td>
                <td className={`text-left`}>84-88</td>
                <td className={`text-left`}>88-92</td>
                <td className={`text-left`}>94-98</td>
                <td className={`text-left`}>98-102</td>
                <td className={`text-left`}>102-104</td>
              </tr>
              <tr className={`border-b bg-[#f8f8f8] !py-2`}>
                <td className={`py-2 pl-2 text-left font-bold`}>Obim kukova</td>
                <td className={`text-left`}>98-102</td>
                <td className={`text-left`}>102-106</td>
                <td className={`text-left`}>106-110</td>
                <td className={`text-left`}>112-116</td>
                <td className={`text-left`}>116-120</td>
                <td className={`text-left`}>120-124</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className={`mt-10 w-full border-b pb-2 text-[1.2rem]`}>
          Tabele mera za muškarce (donji deo)
        </h2>
        <div className={`mt-5`}>
          <table className={`w-full`}>
            <thead>
              <tr className={`border-b`}>
                <th className={`text-left`}></th>
                <th className={`text-left`}>30</th>
                <th className={`text-left`}>31</th>
                <th className={`text-left`}>32</th>
                <th className={`text-left`}>33</th>
                <th className={`text-left`}>34</th>
                <th className={`text-left`}>36</th>
                <th className={`text-left`}>38</th>
                <th className={`text-left`}>40</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border-b bg-[#f8f8f8] !py-2`}>
                <td className={`py-2 pl-2 text-left font-bold`}>Obim struka</td>
                <td className={`text-left`}>78-81</td>
                <td className={`text-left`}>81-84</td>
                <td className={`text-left`}>84-87</td>
                <td className={`text-left`}>87-90</td>
                <td className={`text-left`}>90-94</td>
                <td className={`text-left`}>94-98</td>
                <td className={`text-left`}>98-102</td>
                <td className={`text-left`}>102-106</td>
              </tr>

              <tr className={`border-b !py-2`}>
                <td className={`py-2 pl-2 text-left font-bold`}>Obim kukova</td>
                <td className={`text-left`}>96-99</td>
                <td className={`text-left`}>99-102</td>
                <td className={`text-left`}>102-105</td>
                <td className={`text-left`}>105-108</td>
                <td className={`text-left`}>108-112</td>
                <td className={`text-left`}>112-116</td>
                <td className={`text-left`}>116-120</td>
                <td className={`text-left`}>120-124</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SizeHelpInfo = ({ disabled }) => {
  if (disabled) return <></>;

  const [infoModal, setInfoModal] = useState(false);

  useEffect(() => {
    const handleBodyScroll = () => {
      if (infoModal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    };
    handleBodyScroll();
  }, [infoModal]);

  return (
    <>
      <div className="mt-[1rem] max-md:mt-[2rem] max-md:flex max-md:w-full max-md:items-center">
        <ul className="separate relative flex flex-row gap-[47px] text-base">
          <div
            className="font-norma relative flex cursor-pointer items-center gap-2"
            onClick={() => setInfoModal(true)}
          >
            <Image
              src={"/icons/measure.png"}
              width={24}
              height={10}
              alt="Master Card"
              className="h-auto w-6"
            />{" "}
            Pomoć za veličine
          </div>
        </ul>
      </div>
      {infoModal && (
        <>
          <div
            className="fixed left-0 top-0 z-[100] h-screen w-screen bg-black bg-opacity-40 transition-all duration-500"
            onClick={() => {
              setInfoModal(false);
            }}
          ></div>
        </>
      )}
      {infoModal && (
        <div
          onClick={() => {
            setInfoModal(false);
          }}
          className="fixed right-1 top-2 z-[5200] h-5 w-5"
        >
          <CloseIcon />
        </div>
      )}
      <Table openModal={infoModal} />
    </>
  );
};

export default SizeHelpInfo;
