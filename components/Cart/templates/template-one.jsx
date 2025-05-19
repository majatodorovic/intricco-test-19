import {
  GoogleReCaptcha,
  GoogleReCaptchaProvider,
} from "react-google-recaptcha-v3";

export const TemplateOne = ({ verifyCaptcha, children }) => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.CAPTCHAKEY}>
      <GoogleReCaptcha onVerify={verifyCaptcha} refreshReCaptcha={true} />
      <div className="placeholder mx-auto mt-0 text-sm 4xl:container xl:mt-12">
        <div className="bg-[#f5f5f6] xl:hidden">
          <div className="mx-auto w-[85%] py-3 text-xl font-semibold">
            Korpa
          </div>
        </div>
        <>
          <div className="sectionWidth grid grid-cols-5 gap-x-3 gap-y-3">
            <div className="col-span-5 bg-white p-1 max-xl:row-start-1">
              {children}
            </div>
          </div>
        </>
      </div>
    </GoogleReCaptchaProvider>
  );
};
