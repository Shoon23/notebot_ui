import React from "react";
import { useInView } from "react-intersection-observer";
import { Page } from "react-pdf";

interface LazyPageProps {
  pageNumber: number;
  scale: number;
}

const LazyPage: React.FC<LazyPageProps> = ({ pageNumber, scale }) => {
  // The ref will be attached to the container that we want to observe.
  // triggerOnce ensures the page only loads once when it comes into view.
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  return (
    <div ref={ref}>
      {inView ? (
        <Page pageNumber={pageNumber} scale={scale} />
      ) : (
        // Render a placeholder with a minimum height to reserve space.
        <div style={{ minHeight: "800px" }} />
      )}
    </div>
  );
};

export default LazyPage;
