export type PricingContractOption = {
  model:
    | "one_time"
    | "subscription"
    | "platform_subscription"
    | "free_audit"
    | "free";
  amount: number;
  normalizedUsdAmount: number;
  qualifier: "exact" | "starting_at";
  actionUrl: string;
  evidenceUrls: string[];
  observedAt: string;
};

export const isGenuinelyFreePricingOption = (option: PricingContractOption) =>
  option.model === "free" &&
  option.amount === 0 &&
  option.normalizedUsdAmount === 0 &&
  option.qualifier === "exact";

export const isPaidPricingOption = (option: PricingContractOption) =>
  option.model !== "free" &&
  option.model !== "free_audit" &&
  option.amount > 0 &&
  option.normalizedUsdAmount > 0;

export const isActionablePricingOption = (option: PricingContractOption) =>
  (isPaidPricingOption(option) || isGenuinelyFreePricingOption(option)) &&
  Boolean(option.actionUrl) &&
  option.evidenceUrls.length > 0 &&
  Boolean(option.observedAt);

export const isQualifiedPricingOption = (option: PricingContractOption) =>
  option.qualifier === "starting_at";
