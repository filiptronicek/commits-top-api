// "Borrowed" from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/PluralRules#using_options
const ordinalPluralRules = new Intl.PluralRules("en-US", { type: "ordinal" });

const ordinalSuffixes = new Map([
  ["one", "st"],
  ["two", "nd"],
  ["few", "rd"],
  ["other", "th"],
]);

export const formatOrdinals = (number: number) => {
  const rule = ordinalPluralRules.select(number);
  const suffix = ordinalSuffixes.get(rule);
  return `${number}${suffix}`;
};

