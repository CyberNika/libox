export const classnames = (
  data: string | string[] | { [key: string]: boolean }
) => {
  if (typeof data === "string") return data.trim();

  if (Array.isArray(data)) {
    return data.filter((item) => Boolean(item)).join(" ");
  }

  return Object.keys(data).reduce((acc, key) => {
    if (key && data[key]) {
      acc += ` ${key}`;
    }

    return acc;
  }, "");
};
