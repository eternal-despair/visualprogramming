type StringFormatter = (str: string, uppercase?: boolean) => string;

const capitalize: StringFormatter = (str, uppercase = false) => {
  const result = str.charAt(0).toUpperCase() + str.slice(1);
  return uppercase ? result.toUpperCase() : result;
};

const trimAndFormat: StringFormatter = (str, uppercase = false) => {
  const trimmed = str.trim();
  return uppercase ? trimmed.toUpperCase() : trimmed;
};

console.log(capitalize("hello"));
console.log(trimAndFormat("  hi  ", true));
