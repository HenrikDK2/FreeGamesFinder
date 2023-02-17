export const truncateString = (str: string, charLength: number): string => {
  if (str.length >= charLength) str = str.substring(0, charLength) + "...";
  return str;
};
