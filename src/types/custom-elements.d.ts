declare namespace JSX {
  interface IntrinsicElements {
    "hive-pdf-viewer": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & { src: string },
      HTMLElement
    >;
  }
}
