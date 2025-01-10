import { StorageServiceContext } from "@/App";
import { useContext } from "react";

const useStorageService = () => {
  const storageServ = useContext(StorageServiceContext);
  if (!storageServ) {
    throw new Error(
      "useStorageService must be used within a StorageServiceProvider"
    );
  }
  return storageServ;
};

export default useStorageService;
