"use client";

import Card from "@/components/ui/card-snippet";
import FileUploaderSingle from "./file-uploader-single";
// import { singleFileUploader } from "./source-code";

const FileUploaderPage = ({ width, height, errors, pdf }) => {
  return (
    <div className="space-y-5">
      <div className="col-span-2">
        <FileUploaderSingle width={width} height={height} errors={errors} pdf={pdf} />
      </div>
    </div>
  );
};

export default FileUploaderPage;
