export const hexToRgb = (hex: string) => {
  // Remove the '#' from the hex code if it exists
  hex = hex.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return [
    `rgba(${r}, ${g}, ${b}, 0.4)`,
    `rgba(${r}, ${g}, ${b}, 0.6)`,
    `rgba(${r}, ${g}, ${b}, 0.3)`,
  ]; // Set opacity for the shadow
};

export const capitlizedFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
