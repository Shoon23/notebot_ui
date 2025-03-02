declare module "react-file-viewer" {
  import * as React from "react";

  export interface FileViewerProps {
    fileType: string;
    filePath: string;
    onError: (error: any) => void;
    // Optionally add other props if needed
    [key: string]: any;
  }

  const FileViewer: React.FC<FileViewerProps>;
  export default FileViewer;
}
