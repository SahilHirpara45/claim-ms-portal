import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const SimpleFileUpload = () => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }))]);
  }, []);

  const removeFile = (file) => () => {
    setFiles((prevFiles) => prevFiles.filter(f => f !== file));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*,application/pdf'
  });

  return (
    <div className="p-4 border border-gray-300 rounded">
      <label className="block text-sm font-medium text-gray-700 mb-1">Police Report Upload</label>
      <div {...getRootProps({ className: 'dropzone' })} className="border-2 border-dashed border-gray-300 rounded p-4 cursor-pointer text-center">
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <div className="mt-4">
        {files.map((file) => (
          <div key={file.name} className="flex items-center justify-between bg-gray-100 p-2 rounded mt-2">
            <div className="flex items-center">
              <img src={file.preview} className="w-16 h-16 object-cover mr-2" />
              <p className="text-sm">{file.name}</p>
            </div>
            <button
              className="bg-red-500 text-white rounded px-2 py-1"
              onClick={removeFile(file)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleFileUpload;
