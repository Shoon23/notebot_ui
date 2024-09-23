import React, { ReactNode, useEffect, useState } from "react";
import WebNavigation from "./WebNavigation";
import MobileNavigation from "./MobileNavigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      {isMobile ? (
        <MobileNavigation children={children} />
      ) : (
        <WebNavigation children={children} />
      )}
    </>
  );
};

export default Layout;
