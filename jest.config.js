module.exports = {
  preset: "ts-jest",
  roots: ["__tests__"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
