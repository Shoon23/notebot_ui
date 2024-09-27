import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  server: {
    cleartext: true,
  },
  appId: "ionic.notebot",
  appName: "notebot",
  webDir: "dist",
};

export default config;
