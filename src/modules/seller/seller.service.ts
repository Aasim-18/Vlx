export interface ShopProfile {
  ownerId: string;
  shopName: string;
  description: string;
}

const shops = new Map<string, ShopProfile>();

export const upsertShopProfile = (
  ownerId: string,
  shopName: string,
  description: string
): ShopProfile => {
  const profile: ShopProfile = { ownerId, shopName, description };
  shops.set(ownerId, profile);
  return profile;
};

export const getShopProfile = (ownerId: string): ShopProfile | null =>
  shops.get(ownerId) ?? null;
