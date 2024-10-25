export const topicKey = "issue";
export const cantonKey = "canton";
export const tsKey = "year";
export const mainMetric = "num_bills_adj";
export const metrics = [
  "num_bills_national_adj",
  "num_bills_state_adj",
  "sentiment",
];

export const mergeObjects = (listOfObjects) => {
  return listOfObjects.reduce((merged, current) => {
    return { ...merged, ...current };
  }, {});
};
