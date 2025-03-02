import { FC, useEffect, useContext, useRef } from "react";
import { Toast } from "@capacitor/toast";
import "./AppInitializer.css";
import InitializeAppService from "../../services/initializeService";
import { SqliteServiceContext, StorageServiceContext } from "../../App";
import { Filesystem, Directory } from "@capacitor/filesystem";
async function ensureDirectoryExists(
  folderName: string,
  baseDirectory: Directory = Directory.Data // defaults to Directory.Data
): Promise<void> {
  try {
    await Filesystem.mkdir({
      path: folderName,
      directory: baseDirectory,
      recursive: true, // Create intermediate folders if needed
    });
    console.log(
      `Folder '${folderName}' created (or already exists) in ${baseDirectory}.`
    );
  } catch (error: any) {
    // If the error indicates the folder already exists, ignore it
    if (error.message && error.message.toLowerCase().includes("exists")) {
      console.log(`Folder '${folderName}' already exists, no need to create.`);
    } else {
      console.error(`Error creating folder '${folderName}':`, error);
      throw error;
    }
  }
}

interface AppInitializerProps {
  children: any;
}

const AppInitializer: FC<AppInitializerProps> = ({ children }) => {
  const ref = useRef(false);
  const sqliteService = useContext(SqliteServiceContext);
  const storageService = useContext(StorageServiceContext);
  const initializeAppService = new InitializeAppService(
    sqliteService,
    storageService
  );
  useEffect(() => {
    const initApp = async (): Promise<void> => {
      try {
        await ensureDirectoryExists("Notes", Directory.Data);
        await ensureDirectoryExists("Rubrics", Directory.Data);

        const appInit = await initializeAppService.initializeApp();
        return;
      } catch (error: any) {
        const msg = error.message ? error.message : error;
        Toast.show({
          text: `${msg}`,
          duration: "long",
        });
      }
    };
    if (ref.current === false) {
      initApp();
      ref.current = true;
    }
  }, []);

  return <>{children}</>;
};

export default AppInitializer;
