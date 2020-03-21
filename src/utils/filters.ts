import get from "lodash.get";

const pascal = (val: string) => {
  return val
    .replace(/-(\S)/g, (_, $1) => $1.toUpperCase())
    .replace(/^(\w)/g, (_, $1) => $1.toUpperCase());
};

const camel = (val: string) => {
  return val.replace(/-(\S)/g, (_, $1) => $1.toUpperCase());
};

const authorSplit = (author: string) => {
  const regex = /^(.+) <(\S+)>$/;
  const match = author.match(regex) || [];

  return {
    name: match[1] || "your-name",
    email: match[2] || "your-email",
  };
};

const authorJoin = ({ name, email }: { name: string; email: string }) => {
  return `${name} <${email}>`;
};

const filters = {
  pascal,
  camel,
  authorSplit,
  authorJoin,
};

const parse = (str: string, context?: { [key: string]: any }) => {
  return str.replace(/{{(.*?)}}/g, (_, content: string) => {
    const arr = content.split("|");
    const tokens = {
      value: arr[0].trim(),
      filters: arr.slice(1).map((item) => item.trim()),
    };
    const source = tokens.value.trim();
    const val = tokens.filters.reduce((acc, key) => {
      return key in filters ? filters[key as keyof typeof filters](acc) : acc;
    }, get(context, source, source));

    return val;
  });
};

export { parse };

export default filters;
