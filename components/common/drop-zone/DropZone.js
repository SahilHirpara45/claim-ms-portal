import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const DropZone = ({ onFileUpload, value, onChange, errors, pdf = false }) => {
  const [files, setFiles] = useState(value || []);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);

      // Update parent form and trigger onFileUpload with the accumulated files
      const newFiles = [...files, ...acceptedFiles];
      onChange(newFiles);
      onFileUpload(newFiles);
    },
    [files, onChange, onFileUpload]
  );

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange(newFiles);
    onFileUpload(newFiles);
  };

  useEffect(() => {
    setFiles(value || []);
  }, [value]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: pdf
      ? {
          "image/*": [".png", ".jpg", ".jpeg"],
          "application/pdf": [".pdf"],
        }
      : {
          "image/*": [".png", ".jpg", ".jpeg"],
        },
    onDrop,
  });

  return (
    <div className="w-full max-w-md">
      <div
        {...getRootProps()}
        className={`flex items-center justify-center w-full rounded-md cursor-pointer ${
          isDragActive ? "border-blue-600" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} className="hidden" />
        <div className="flex items-center gap-2 w-full px-4 py-2 bg-white border rounded-md border-gray-300">
          <span className="text-gray-600">
            {isDragActive ? "Drop the files here ..." : "Choose Files"}
          </span>
          <span className="text-gray-500">
            {files?.length > 1
              ? `${files.length} files selected`
              : files?.length === 1
              ? files[0]?.name
              : ""}
          </span>
        </div>
      </div>
      {files?.length > 0 && (
        <div className="mt-4">
          <ul className="list-disc list-inside bg-white p-4">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center text-gray-800"
              >
                {file.name || files[index].split("/").pop()}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-600 underline ml-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {errors && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
    </div>
  );
};

export default DropZone;
