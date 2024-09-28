import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "ionic.notebot",
  appName: "notebot",
  webDir: "dist",
  server: {
    cleartext: true, // Enable HTTP requests during development
  },
};

export default config;
