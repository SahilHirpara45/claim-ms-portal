"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Upload } from "lucide-react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
const FileUploaderMultiple = ({
  value,
  onChange,
  name,
  textname,
  errors,
  readOnly = false,
}) => {
  const [files, setFiles] = useState(value || []);

  useEffect(() => {
    if (value && JSON.stringify(files) !== JSON.stringify(value)) {
      setFiles(value || []);
    }
  }, [value]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => Object.assign(file));
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    },
  });
  console.log(files, "fileuploader inside fileupload");

  useEffect(() => {
    onChange(files);
  }, [files]);

  const renderFilePreview = (file) => {
    if (!file) return null;

    if (typeof file === "string") {
      if (/\.(jpg|jpeg|gif|svg|png)$/i.test(file)) {
        return (
          <Image
            src={file}
            width={150}
            height={150}
            alt={file.name}
            className="file-preview rounded border p-0.5"
          />
        );
      } else if (/\.(pdf|doc)$/i.test(file)) {
        return (
          <embed src={file} type="application/pdf" width="400" height="200" />
        );
      } else {
        return <span>Not supported</span>;
      }
    } else if (file?.type?.startsWith("image")) {
      return (
        <Image
          src={URL.createObjectURL(file)}
          width={150}
          height={150}
          alt={file?.name}
          className="file-preview rounded border p-0.5"
        />
      );
    } else if (file?.type.startsWith("video")) {
      return (
        <video width={200} height={200} controls>
          <source src={URL.createObjectURL(file)} type={file?.type} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (file?.type === "application/pdf") {
      return (
        <embed
          src={URL.createObjectURL(file)}
          type="application/pdf"
          width="400"
          height="200"
        />
      );
    } else {
      return <span>Not supported</span>;
    }
  };

  const handleRemoveFile = (file) => {
    if (file) {
      const filteredFiles = files.filter((i) => i.name !== file?.name);
      setFiles(filteredFiles);
    }
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  // const fileList = files.map((file) => (
  //   <div
  //     key={file?.name}
  //     className="flex justify-between border px-3.5 py-3 my-6 rounded-md"
  //   >
  //     <div className="flex flex-col gap-3 items-center">
  //       <div className="file-preview">{renderFilePreview(file)}</div>
  //       <div className="text-sm text-card-foreground">{file?.name}</div>
  //     </div>

  //     <Button
  //       size="icon"
  //       color="destructive"
  //       variant="outline"
  //       className="border-none rounded-full"
  //       onClick={() => handleRemoveFile(file)}
  //     >
  //       <Icon icon="tabler:x" className="h-5 w-5" />
  //     </Button>
  //   </div>
  // ));
  const fileList = Array.isArray(files)
    ? files.map((file) => (
        <div
          key={file?.name}
          className="flex justify-between border px-3.5 py-3 my-6 rounded-md"
        >
          <div className="flex flex-col gap-3 items-center">
            <div className="file-preview">{renderFilePreview(file)}</div>
            <div className="text-sm text-card-foreground">{file?.name}</div>
          </div>

          {!readOnly && (
            <Button
              size="icon"
              color="destructive"
              variant="outline"
              className="border-none rounded-full"
              onClick={() => handleRemoveFile(file)}
            >
              <Icon icon="tabler:x" className="h-5 w-5" />
            </Button>
          )}
        </div>
      ))
    : [];

  // const fileList = files && files?.length > 0 ? files?.map((file) => (
  //   <div
  //     key={file?.name}
  //     className="flex justify-between border px-3.5 py-3 my-6 rounded-md"
  //   >
  //     <div className="flex flex-col gap-3 items-center">
  //       <div className="file-preview">{renderFilePreview(file)}</div>
  //       <div className="text-sm text-card-foreground">{file?.name}</div>
  //     </div>

  //     <Button
  //       size="icon"
  //       color="destructive"
  //       variant="outline"
  //       className="border-none rounded-full"
  //       onClick={() => handleRemoveFile(file)}
  //     >
  //       <Icon icon="tabler:x" className="h-5 w-5" />
  //     </Button>
  //   </div>
  // )) : null;
  // console.log(files, "yyyyyyy");

const hasFiles = files.length > 0 && files[0] !== undefined;
  return (
    <Fragment>
      <div className={cn(
      "w-full text-center border-dashed border border-primary rounded-md flex items-center flex-col relative",
      {
        "py-[52px]": !hasFiles,
      }
    )}>
        {files.length && files[0] !== undefined ? (
          <Fragment>
            <div
              as="div"
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              {fileList[0]}
            </div>
          </Fragment>
        ) : (
          <>
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <div className="h-12 w-12 inline-flex rounded-md bg-muted items-center justify-center mb-3">
                <Upload className="h-6 w-6 text-default-500" />
              </div>
              <h4 className="text-xl font-medium mb-1 text-card-foreground/80">
                Select file {textname}
              </h4>
              <div className="text-xs text-muted-foreground">
                Drop file or browse through your machine
              </div>
            </div>
          </>
        )}
      </div>
      {/* </div> */}
      {files.length > 1 && (
        <Fragment>
          <div>{fileList.slice(1)}</div>
          <div className="flex justify-end gap-2">
            <Button color="destructive" onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
            {/* <Button>Upload Files</Button> */}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default FileUploaderMultiple;
