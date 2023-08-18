import clsx from "clsx";
import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  AiFillFileAdd,
  AiOutlineClose,
  AiOutlineCloudDownload,
  AiOutlineFileImage,
} from "react-icons/ai";
import { HiExclamationCircle } from "react-icons/hi";

function ImagesToBase64({ label, name }) {
  const [imagesBase64, setImagesBase64] = React.useState([]);
  const imageSelector = React.useRef<HTMLInputElement>(null);
  const {
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
  } = useFormContext();

  const value = getValues()[name];

  React.useEffect(() => {
    if (value) {
      setImagesBase64(value);
    }
  }, [value, name]);

  const compressTheImageAndReturnBase64 = async (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const promise = new Promise((resolve, reject) => {
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const elem = document.createElement("canvas");
          let width = 1080;
          if (img.width < 1080) width = img.width;
          const scaleFactor = width / img.width;
          elem.width = width;
          elem.height = img.height * scaleFactor;
          const ctx = elem.getContext("2d");
          ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);
          const base64 = ctx.canvas.toDataURL("image/jpeg", 0.8);
          resolve(base64);
        };
      };
      reader.onerror = (error) => reject(error);
    });
    const base64 = await promise;
    return base64;
  };

  const handleSelectFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await compressTheImageAndReturnBase64(file);
    if (imagesBase64.includes(base64)) return;
    if (imagesBase64.length >= 5) return;
    setImagesBase64((prev) => [...prev, base64]);
    setValue(name, [...imagesBase64, base64]);
    clearErrors(name);
    imageSelector.current.value = "";
  };

  return (
    <Controller
      name={name}
      render={({ field }) => (
        <div className={clsx("flex flex-col")}>
          <label
            htmlFor={name}
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {label}
          </label>
          <div className="flex flex-col">
            {imagesBase64.length ? (
              <div className="grid md:grid-cols-2 gap-2">
                {imagesBase64.map((image) => (
                  <button
                    type="button"
                    className="relative"
                    onClick={() => {
                      setImagesBase64((prev) =>
                        prev.filter((img) => img !== image)
                      );
                      setValue(
                        name,
                        imagesBase64.filter((img) => img !== image)
                      );
                      imageSelector.current.value = "";
                    }}
                  >
                    <AiOutlineClose className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 transform text-red-500 opacity-0 transition-all duration-500 hover:block hover:opacity-100" />
                    <img
                      src={image}
                      alt={name}
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-gray-600"
                    />
                  </button>
                ))}
                <button
                  {...field}
                  type="button"
                  className="relative"
                  onClick={() => {
                    imageSelector.current?.click();
                  }}
                >
                  <AiOutlineFileImage className="w-full h-full cursor-pointer rounded-md text-emerald-500 transition-colors duration-500 hover:text-emerald-600" />
                </button>
              </div>
            ) : (
              <button
                {...field}
                type="button"
                className="relative w-24"
                onClick={() => {
                  imageSelector.current?.click();
                }}
              >
                <AiOutlineFileImage className="h-20 w-full cursor-pointer rounded-md text-emerald-500 transition-colors duration-500 hover:text-emerald-600" />
              </button>
            )}
            <input
              name={name}
              type="file"
              accept="image/*"
              className="absolute top-0 left-0 h-0 w-0 opacity-0"
              multiple={true}
              ref={imageSelector}
              onChange={handleSelectFile}
            />
            {errors[name] && (
              <div className="mt-1 flex items-center text-sm text-red-600 dark:text-red-400">
                <HiExclamationCircle className="mr-1 h-4 w-4" />
                {errors[name].message}
              </div>
            )}
          </div>
        </div>
      )}
    />
  );
}

export default ImagesToBase64;
