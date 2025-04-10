export function capitalizeFirstLetter(str: string) {
  return str.replace(/\b\w/g, function (match) {
    return match.toUpperCase();
  });
}

export const getImagePath = (imageName: string): string => {
  return `/public/assets/${imageName}`;
};
