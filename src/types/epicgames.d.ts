export interface EpicGamesRequestData {
  data: {
    Catalog: Catalog;
  };
  extensions: Extensions;
}

export interface Catalog {
  searchStore: SearchStore;
}

export interface SearchStore {
  elements: Element[];
  paging: Paging;
}

export interface Element {
  title: string;
  id: string;
  namespace: string;
  description: string;
  effectiveDate: Date;
  offerType: "BASE_GAME" | "DLC" | "BUNDLE";
  expiryDate: null;
  status: string;
  isCodeRedemptionOnly: boolean;
  keyImages: KeyImage[];
  seller: Seller;
  productSlug: null | string;
  urlSlug: string;
  url: null;
  items: Item[];
  customAttributes: CustomAttribute[];
  categories: Category[];
  tags: Tag[];
  catalogNs: CatalogNS | null;
  offerMappings: Mapping[] | null;
  price: Price;
  promotions: Promotions | null;
}

export interface CatalogNS {
  mappings: Mapping[];
}

export interface Mapping {
  pageSlug: string;
  pageType: string;
}

export interface Category {
  path: string;
}

export interface CustomAttribute {
  key: string;
  value: string;
}

export interface Item {
  id: string;
  namespace: string;
}

export interface KeyImage {
  type: string;
  url: string;
}

export interface Price {
  totalPrice: TotalPrice;
  lineOffers: LineOffer[];
}

export interface LineOffer {
  appliedRules: AppliedRule[];
}

export interface AppliedRule {
  id: string;
  endDate: Date;
  discountSetting: AppliedRuleDiscountSetting;
}

export interface AppliedRuleDiscountSetting {
  discountType: string;
}

export interface TotalPrice {
  discountPrice: number;
  originalPrice: number;
  voucherDiscount: number;
  discount: number;
  currencyCode: string;
  currencyInfo: CurrencyInfo;
  fmtPrice: FmtPrice;
}

export interface CurrencyInfo {
  decimals: number;
}

export interface FmtPrice {
  originalPrice: string;
  discountPrice: string;
  intermediatePrice: string;
}

export interface Promotions {
  promotionalOffers: PromotionalOffer[];
  upcomingPromotionalOffers: PromotionalOffer[];
}

export interface PromotionalOffer {
  promotionalOffers: PromotionalOfferPromotionalOffer[];
}

export interface PromotionalOfferPromotionalOffer {
  startDate: Date;
  endDate: Date;
  discountSetting: PromotionalOfferDiscountSetting;
}

export interface PromotionalOfferDiscountSetting {
  discountType: string;
  discountPercentage: number;
}

export interface Seller {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
}

export interface Paging {
  count: number;
  total: number;
}

export interface Extensions {}
