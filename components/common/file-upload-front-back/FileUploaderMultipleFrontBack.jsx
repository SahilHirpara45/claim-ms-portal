"use client";
import { Fragment, useEffect, useState, useMemo } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { MdAddAPhoto } from "react-icons/md";

const MAX_FILE_SIZE = 6 * 1024 * 1024;

const FileUploaderMultipleFrontBack = ({
    label = "",
    name,
    value,
    onChange,
    textname,
    imgWidth = 200,
    imgHeight = 200,
    maxFileNum = 2,
    errors,
    loadingError = false
}) => {
    const [files, setFiles] = useState(value || []);
    const [errorMessages, setErrorMessages] = useState([]);
    const [rejectedFiles, setRejectedFiles] = useState([]);
    const [errorMessagesUp, setErrorMessagesUp] = useState("");
    useEffect(() => {
        if (value && value !== files) {
            setFiles(value);
        }
    }, [value]);

    const fileUrls = useMemo(() => {
        return files.map((file) => {
            if (file instanceof File) {
                return URL.createObjectURL(file);
            }
            return file;
        });
    }, [files]);

    const renderFilePreview = useMemo(() => (file, index) => {
        const fileUrl = fileUrls[index];
        const previewStyle = {
            maxWidth: "100%", // Responsive width
            maxHeight: "200px", // Set max height
            objectFit: "contain", // Maintain aspect ratio
            display: "block", // Center the image/video
            margin: "auto" // Center the image/video
        };
        if (file) {
            if (
                typeof file === "string" &&
                (file.startsWith("http://") || file.startsWith("https://")) &&
                /\.(jpg|jpeg|gif|svg|png)$/i.test(file) &&
                !/\.(mp4|webm)$/i.test(file)
            ) {
                return (
                    <img
                        src={file}
                        alt="preview"
                        style={{ width: "200px", height: "200px" }}
                    />
                );
            } else if (/\.(pdf|doc)$/i.test(file)) {
                return (
                    <embed src={file} type="application/pdf" width="100%" height="200" />
                );
            } else if (
                typeof file === "string" &&
                (file.startsWith("http://") || file.startsWith("https://")) &&
                /\.(mp4|webm)$/i.test(file)
            ) {
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
            } else if (file?.type?.startsWith("image")) {
                return (
                    <Image
                        src={fileUrl}
                        width={imgWidth}
                        height={imgHeight}
                        alt={file.name}
                    />
                );
            } else if (file?.type === "application/pdf") {
                return (
                    <embed
                        src={fileUrl}
                        type="application/pdf"
                       width="100%"
                        height="200"
                    />
                );
            } else if (file?.type?.startsWith("video")) {
                return (
                    <video
                        style={{
                            width: "200px",
                            aspectRatio: "auto 200 / 200",
                            height: "200px",
                        }}
                        controls
                    >
                        <source src={fileUrl} type={file.type} />
                        Your browser does not support the video tag.
                    </video>
                );
            } else {
                return <span>Not supported</span>;
            }
        } else {
            return <span>No file selected</span>;
        }
    }, [fileUrls, imgWidth, imgHeight]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles, fileRejections) => {
            const filteredFiles = acceptedFiles.filter((file) => {
                const fileType = file.type.split("/")[0];
                return fileType === "image" || fileType === "video" || fileType === "application";
            });

            if (files.length + filteredFiles.length > maxFileNum) {
                const remainingSpace = maxFileNum - files.length;
                filteredFiles.splice(remainingSpace);
            }
            setRejectedFiles(fileRejections);

            const errorMsgs = fileRejections.map((fileRejection) => {
                return fileRejection.errors.map((err) => err.message).join(", ");
            });

            setErrorMessages(errorMsgs);

            // setFiles((prevFiles) => [...prevFiles, ...filteredFiles]);
            setFiles((prevFiles) => {
                const newFiles = [...prevFiles, ...filteredFiles];
                checkSingleImage(newFiles);  // Check for single image file
                return newFiles;
            });
            onChange([...files, ...filteredFiles]);
        },
        maxSize: MAX_FILE_SIZE,
        accept: ["image/*", "video/*", "application/pdf"]
    });


 

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => {
            const newFiles = [...prevFiles];
            newFiles.splice(index, 1);
            checkSingleImage(newFiles);
            return newFiles;
        });
        onChange(files.filter((_, i) => i !== index));
    };

    const checkSingleImage = (files) => {
        const imageFiles = files.filter(file => /\.(jpg|jpeg|svg|png)$/i.test(file.name || file));
        if (imageFiles.length === 1) {
            setErrorMessagesUp("Please upload the second side of the document.");
        } else {
            setErrorMessagesUp("");
        }
    };
    const fileList = useMemo(() => files.map((file, index) => (
        <div
            key={index}
            style={{
                display: "flex",
                gap: "2rem",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div className="file-preview">{renderFilePreview(file, index)}</div>

                <button
                    variant="outlined"
                    type="button"
                    color="error"
                    onClick={() => handleRemoveFile(index)}
                    style={{
                        width: "100%",
                    }}
                >
                    Remove file
                </button>
            </div>
        </div>
    )), [files, renderFilePreview]);

    const handleRemoveAllFiles = () => {
        setFiles([]);
    };

    return (
        <Fragment>
            <div
                style={{

                    width: "100%",
                    minHeight: "12.5rem",
                    height: "100%",
                    display: "flex",

                    justifyContent: "start",
                    alignItems: "center",
                    position: "relative",
                    padding: "1rem",
                }}
                className="border-dashed border border-primary rounded-md flex-wrap md:flex-nowrap"
            >
                {files.length ? (
                    <Fragment>
                        <div
                            as="div"
                            style={{
                                display: "flex",
                                gap: "1rem",
                                flexWrap: "wrap",

                            }}
                        >
                            {fileList}
                        </div>
                    </Fragment>
                ) : null}
                {files.length === maxFileNum ? (
                    <></>
                ) : (
                    <>
                        <div {...getRootProps({ className: "dropzone" })} className="w-full">
                            <input {...getInputProps()} />
                            {!files.length && (
                                <>
                                    <div
                                        style={{
                                            display: "flex",
                                            textAlign: "center",
                                            alignItems: "center",
                                            flexDirection: "column",
                                            // background:"red",
                                            // width:"500px"

                                        }}

                                    >
                                        <div className="h-12 w-full inline-flex rounded-md bg-muted items-center justify-center mb-3">
                                            <Upload className="h-6 w-6 text-default-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-medium mb-1 text-card-foreground/80">
                                                Select file {textname}
                                            </h4>
                                            <div className="text-xs text-muted-foreground">
                                                Drop file or browse through your machine
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-center items-center h-36 w-full">
                                <MdAddAPhoto
                                    style={{
                                        fontSize: "30px",
                                        cursor: "pointer",
                                        textAlign: "center",
                                        visibility: files.length !== maxFileNum ? "visible" : "hidden",
                                    }}
                                />
                            </div>

                        </div>
                    </>
                )}
            </div>

            {errorMessages.length > 0 && (
                <div>
                    {errorMessages.map((msg, index) => (
                        <label key={index} style={{ color: "red", display: "block" }}>
                            {msg}
                        </label>
                    ))}
                </div>
            )}

            {errorMessagesUp && !loadingError && (
                <label style={{ color: "red", display: "block" }}>
                    {errorMessagesUp}
                </label>
            )}

            {errors && errors[name] && (
                <label style={{ color: "red" }}>
                    {errors[name].message}
                </label>
            )}
        </Fragment>
    );
};

export default FileUploaderMultipleFrontBack;
