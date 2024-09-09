"use client";
import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const FileUploaderSingle = ({
  value,
  onChange,
  height,
  width,
  name,
  errors,
  resetTrigger,
  closeXmark = true,
  maxFileNum = 1,
  readOnly = "false",
  pdf = false,
}) => {
  const [files, setFiles] = useState(value || []);
  const [errorsMes, setErrorsMes] = useState("");
  const [rejectedFiles, setRejectedFiles] = useState([]);

  useEffect(() => {
    if (value && value !== files) {
      setFiles(value);
    }
  }, [value]);

  useEffect(() => {
    if (resetTrigger) {
      setFiles([]);
    }
  }, [resetTrigger]);

  const renderFilePreview = (file) => {
    if (file) {
      if (typeof file === "string" && /\.(jpg|jpeg|gif|svg|png)$/i.test(file)) {
        return (
          <img
            src={file}
            alt="preview"
            style={{ width: "200px", height: "200px" }}
          />
        );
      } else if (/\.(pdf|doc)$/i.test(file)) {
        return (
          <embed
            src={file}
            type="application/pdf"
            width="100%"
            height="200px"
          />
        );
      } else if (typeof file === "string" && /\.(mp4|webm)$/i.test(file)) {
        return (
          <video
            style={{
              width: "200px",
              aspectRatio: "auto 200 / 200",
              height: "200px",
            }}
            controls
          >
            <source src={file} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        );
      } else if (file.type && file.type.startsWith("image")) {
        return (
          <Image
            src={URL.createObjectURL(file)}
            width={200}
            height={200}
            alt={file.name}
          />
        );
      } else if (file.type && file.type.startsWith("application")) {
        return (
          <embed
            src={URL.createObjectURL(file)}
            type="application/pdf"
            width="100%"
            height="200px"
          />
        );
      } else if (file.type && file.type.startsWith("video")) {
        return (
          <video
            style={{
              width: "200px",
              aspectRatio: "auto 200 / 200",
              height: "200px",
            }}
            controls
          >
            <source src={URL.createObjectURL(file)} type={file.type} />
            Your browser does not support the video tag.
          </video>
        );
      } else {
        return <span>Not supported</span>;
      }
    } else {
      return <span>No file selected</span>;
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: pdf
      ? {
          "image/*": [".png", ".jpg", ".jpeg"],
          // "video/*": [".mp4", ".avi", ".mov"],
          "application/pdf": [".pdf"],
        }
      : {
          "image/*": [".png", ".jpg", ".jpeg"],
          // "video/*": [".mp4", ".avi", ".mov"],
        },
    onDrop: (acceptedFiles, fileRejections) => {
      const filteredFiles = acceptedFiles.filter((file) => {
        const fileType = file.type.split("/")[0];
        return pdf
          ? fileType === "application" || fileType === "image"
          : fileType === "image" || fileType === "application";
      });

      if (files.length + filteredFiles.length > maxFileNum) {
        const remainingSpace = maxFileNum - files.length;
        filteredFiles.splice(remainingSpace);
      }
      setRejectedFiles(fileRejections);

      const errorMsgs = fileRejections.map((fileRejection) => {
        return fileRejection.errors.map((err) => err.message).join(", ");
      });

      setErrorsMes(errorMsgs.join(", "));

      const newFiles = [...files, ...filteredFiles];
      setFiles(newFiles);
      onChange(newFiles);
    },
  });

  const closeTheFile = () => {
    setFiles([]);
    onChange([]);
  };

  return (
    <>
      <div className="w-full h-[200px] flex items-center justify-center relative border border-dashed border-default-300 rounded-md">
        {files?.length ? (
          <div className="w-full h-full flex items-center justify-center relative">
            {readOnly === "true" ? (
              <></>
            ) : (
              <>
                {closeXmark && (
                  <Button
                    type="button"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-default-900 hover:bg-background hover:text-default-900 z-20"
                    onClick={closeTheFile}
                  >
                    <span className="text-xl">
                      <Icon icon="fa6-solid:xmark" />
                    </span>
                  </Button>
                )}
                {files?.map((file) => (
                  <div key={file?.name}>{renderFilePreview(file)}</div>
                ))}
              </>
            )}
          </div>
        ) : (
          <div
            {...getRootProps({
              className:
                "dropzone w-full h-full flex items-center justify-center",
            })}
          >
            <input {...getInputProps()} />
            <div className="w-full text-center py-[52px] flex items-center flex-col">
              <div className="h-12 w-12 inline-flex rounded-md bg-muted items-center justify-center mb-3">
                <Upload className="text-default-500" />
              </div>
              <h4 className="text-2xl font-medium mb-1 text-card-foreground/80">
                Select file
              </h4>
              <div className="text-xs text-muted-foreground">
                Drop file or browse through your machine
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        {errors && errors[name] && (
          <p className="text-red-500">{errors[name].message}</p>
        )}
      </div>
    </>
  );
};

export default FileUploaderSingle;
