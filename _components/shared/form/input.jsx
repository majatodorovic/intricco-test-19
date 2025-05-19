"use client";

import { icons } from "@/_lib/icons";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/api";
import { toast } from "react-toastify";
import Image from "next/image";

export const Input = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  errors,
  data,
  id,
  required,
  options,
  fill,
  className,
}) => {
  switch (type) {
    case "email":
    case "text":
    case "password":
      return (
        <TextInput
          name={name}
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          data={data}
          type={type}
          value={value}
          errors={errors}
          required={required}
          className={className}
        />
      );
    case "select":
      return (
        <SelectInput
          name={name}
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          data={data}
          value={value}
          errors={errors}
          options={options}
          required={required}
          fill={fill}
          className={className}
        />
      );
    case "date":
      return (
        <DateInput
          name={name}
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          data={data}
          value={value}
          errors={errors}
          required={required}
          className={className}
        />
      );
    case "checkbox":
      return (
        <CheckboxInput
          name={name}
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          data={data}
          value={value}
          errors={errors}
          required={required}
          className={className}
        />
      );
    case "textarea":
      return (
        <TextareaInput
          name={name}
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          data={data}
          value={value}
          errors={errors}
          required={required}
          className={className}
        />
      );
    case "rating":
      return (
        <RatingInput
          name={name}
          id={id}
          onChange={onChange}
          value={value}
          required={required}
          errors={errors}
          className={className}
          options={options}
        />
      );

    case "file":
      return (
        <FileUploadInput
          name={name}
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          data={data}
          value={value}
          errors={errors}
          required={required}
          fileType={name || "all"}
          className={className}
        />
      );
  }
};

export const FileUploadInput = ({
  name,
  id,
  onChange,
  placeholder,
  data,
  errors,
  required,
  fileType,
  className,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    if (
      fileType.includes("images") &&
      data[fileType].length == 0 &&
      uploadedFiles.length > 0
    ) {
      setUploadedFiles([]);
    }
    if (
      fileType.includes("videos") &&
      data[fileType].length == 0 &&
      uploadedFiles.length > 0
    ) {
      setUploadedFiles([]);
    }
  }, [data]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Check file type
    const isImage =
      fileType.includes("images") && file.type.startsWith("image/");
    const isVideo =
      fileType.includes("videos") && file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.warning(`Invalid file type. Please upload a ${fileType}.`, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
      });
      event.target.value = null;
      return;
    }

    setUploadedFiles((prev) => [...prev, file]);
    onChange({ target: { name, value: [...uploadedFiles, file] } });

    event.target.value = null;
  };

  const handleRemoveFile = (indexToRemove) => {
    const updatedFiles = uploadedFiles.filter(
      (_, index) => index !== indexToRemove,
    );
    setUploadedFiles(updatedFiles);
    onChange({ target: { name, value: updatedFiles } });
  };

  return (
    <div className={`col-span-full ${className ? className : ""}`}>
      {/* <label
        htmlFor={name}
        className={`block text-sm font-normal text-gray-500 mb-2`}
      >
        {placeholder}
        {required && <span className={`text-xs text-red-500`}>*</span>}
      </label> */}
      <div className="border-gray-300 bg-gray-50 rounded-md border border-dashed p-4">
        <label
          htmlFor={id}
          className="flex cursor-pointer flex-col items-center justify-center"
        >
          <div className="flex flex-col items-center">
            <span className="border-gray-300 text-gray-600 rounded-md border px-4 py-2 text-sm">
              {placeholder}
            </span>
          </div>
          <input
            type="file"
            name={name}
            id={id}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>
      {uploadedFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-5">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="relative mb-2">
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="uploaded preview"
                  className="h-auto max-w-full rounded-md border"
                />
              ) : (
                <video
                  controls
                  src={URL.createObjectURL(file)}
                  className="h-auto max-w-full rounded-md border"
                />
              )}

              <Image
                title="Remove file"
                src={"/icons/cancel.png"}
                alt="cancel"
                width={20}
                height={20}
                onClick={() => handleRemoveFile(index)}
                className="absolute right-1 top-1 cursor-pointer rounded p-1"
              />
            </div>
          ))}
        </div>
      )}

      {required && errors?.includes(name) && (
        <div className={`mt-1 text-xs text-red-500`}>
          This field is required.
        </div>
      )}
    </div>
  );
};

export const RatingInput = ({
  name,
  errors,
  onChange,
  value,
  required,
  className,
  options = [1, 2, 3, 4, 5],
}) => {
  const [hoveredValue, setHoveredValue] = useState(null);
  return (
    <div className={`col-span-full ${className ? className : ""}`}>
      <div className="flex items-center">
        <label
          htmlFor={name}
          className={`text-gray-500 mr-2 block text-sm font-normal`}
        >
          Rating
          {required && <span className={`text-xs text-red-500`}> *</span>}
        </label>
        <div className="flex">
          {options.map((star) => (
            <span
              key={star}
              className={`cursor-pointer px-[2px] text-2xl ${
                (hoveredValue !== null ? hoveredValue : value) >= star
                  ? "text-yellow-500"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => {
                if (!value || star > value) {
                  setHoveredValue(star);
                }
              }}
              onMouseLeave={() => setHoveredValue(null)}
              onClick={() => onChange({ target: { name, value: star } })}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      {required && errors?.includes(name) && (
        <div className={`mt-1 text-xs text-red-500`}>
          Ovo polje je obavezno.
        </div>
      )}
    </div>
  );
};

export const TextInput = ({
  name,
  id,
  onChange,
  placeholder,
  data,
  value,
  errors,
  type,
  required,
  className,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`${className ? className : ""}`}>
      <div className={`relative`}>
        <input
          value={value ?? data?.[name] ?? ""}
          name={name}
          placeholder={`${placeholder}${required && "*"}`}
          onChange={(e) => onChange(e)}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          id={id}
          className={`mainInput ${
            (errors ?? [])?.includes(name)
              ? "!ring-1 !ring-red-500 !ring-offset-2 !ring-offset-white"
              : ""
          }`}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-2 top-4`}
            title={`Prikaži lozinku`}
          >
            {showPassword ? icons["eyeopen"] : icons["eye_closed"]}
          </button>
        )}
        {required && errors?.includes(name) && (
          <div className={`mt-1 text-xs text-red-500`}>
            Ovo polje je obavezno.
          </div>
        )}
      </div>
    </div>
  );
};

export const SelectInput = ({
  name,
  id,
  onChange,
  placeholder,
  data,
  value,
  errors,
  options,
  required,
  fill,
  className,
}) => {
  const { data: opt } = useQuery({
    queryKey: ["options", name, fill],
    queryFn: async () => {
      return await get(`${fill}`)?.then((res) => res?.payload);
    },
    enabled: fill?.length > 0,
  });

  return (
    <div className={`col-span-full ${className}`}>
      <select
        value={value ?? data?.[name]}
        name={name}
        onChange={(e) => onChange(e)}
        id={id}
        className={`border-gray-200 bg-gray-50 mt-1 block w-full border-0 bg-gray p-4 text-base focus:border-transparent focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white sm:text-sm ${
          (errors ?? [])?.includes(name)
            ? "!ring-1 !ring-red-500 !ring-offset-2 !ring-offset-white"
            : ""
        }`}
      >
        <option value={""} hidden>
          {placeholder}*
        </option>
        {(opt ?? options ?? []).map((option) => (
          <option key={option?.id} value={option?.id}>
            {option?.name}
          </option>
        ))}
      </select>
      {required && errors?.includes(name) && (
        <div className={`mt-1 text-xs text-red-500`}>
          Ovo polje je obavezno.
        </div>
      )}
    </div>
  );
};

export const DateInput = ({
  name,
  id,
  onChange,
  placeholder,
  data,
  value,
  errors,
  required,
  className,
}) => {
  return (
    <div className={`col-span-full ${className ? className : ""}`}>
      <label
        htmlFor={name}
        className={`text-gray-500 block text-sm font-normal`}
      >
        {placeholder}
        {required && <span className={`text-xs text-red-500`}> *</span>}
      </label>
      <input
        value={value ?? data?.[name]}
        name={name}
        onChange={(e) => onChange(e)}
        type={"date"}
        id={id}
        className={`mt-1 block w-full border-0 bg-gray p-4 text-base focus:border-transparent focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white sm:text-sm ${
          (errors ?? [])?.includes(name)
            ? "!ring-1 !ring-red-500 !ring-offset-2 !ring-offset-white"
            : ""
        }`}
      />
      {required && errors?.includes(name) && (
        <div className={`mt-1 text-xs text-red-500`}>
          Ovo polje je obavezno.
        </div>
      )}
    </div>
  );
};

export const CheckboxInput = ({
  name,
  id,
  onChange,
  placeholder,
  data,
  value,
  errors,
  required,
  className,
}) => {
  return (
    <div
      className={`col-span-full my-auto flex flex-col gap-0 ${
        className ? className : ""
      }`}
    >
      <div className={`flex flex-row-reverse items-center justify-end gap-2`}>
        <label
          htmlFor={id}
          className={`text-gray-500 block text-sm font-normal`}
        >
          {placeholder}
          {required && <span className={`text-xs text-red-500`}> *</span>}
        </label>
        <input
          checked={value ?? data?.[name]}
          value={value ?? data?.[name]}
          name={name}
          onChange={(e) => onChange(e)}
          type={"checkbox"}
          id={id}
          className={`border-gray-200 bg-gray-50 block h-5 w-5 rounded-md border text-base text-primary shadow-sm focus:border-transparent focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white sm:text-sm ${
            (errors ?? [])?.includes(name)
              ? "!ring-1 !ring-red-500 !ring-offset-2 !ring-offset-white"
              : ""
          }`}
        />
      </div>
      {required && errors?.includes(name) && (
        <div className={`mt-1 text-xs text-red-500`}>
          Ovo polje je obavezno.
        </div>
      )}
    </div>
  );
};

export const TextareaInput = ({
  name,
  id,
  onChange,
  placeholder,
  data,
  value,
  errors,
  className,
}) => {
  const handleInputChange = (e) => {
    onChange(e); // Promena vrednosti bez dodatne validacije tokom pisanja
  };

  return (
    <div className={`col-span-full mb-6 ${className ? className : ""}`}>
      <textarea
        value={value ?? data?.[name]}
        name={name}
        placeholder={placeholder}
        onChange={handleInputChange}
        id={id}
        className={`mt-1 block w-full border border-gray bg-gray p-4 text-base placeholder:text-black focus:border-transparent focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white sm:text-sm ${
          (errors ?? [])?.includes(name)
            ? "!ring-1 !ring-red-500 !ring-offset-2 !ring-offset-white"
            : ""
        }`}
      />
      {errors?.includes(name) && (
        <div className={`mt-1 text-xs text-red-500`}>
          {value?.length > 511
            ? `Maksimalan broj karaktera je 511.`
            : `Ovo polje je obavezno.`}
        </div>
      )}
    </div>
  );
};
