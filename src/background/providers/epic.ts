import { getProductType, getPlatform, getGameState } from "../../utils/game";
import { IFreeGame } from "../../types/freegames";
import { EpicGamesRequestData } from "../../types/epicgames";
import axios from "axios";

export const getEpicGames = async (): Promise<IFreeGame[]> => {
  try {
    const { status, data } = await axios<EpicGamesRequestData>({
      url: "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions",
      timeout: 10000,
    });

    if (status === 200) {
      const products = data.data.Catalog.searchStore.elements.filter((p) => {
        const effectiveDate = new Date(p.effectiveDate);
        const isActive = Date.now() - effectiveDate.getTime() < 0 ? false : true;

        if (p.price.totalPrice.discountPrice === 0 && isActive) return true;
      });

      const games: IFreeGame[] = products.map((product) => {
        const url = "https://store.epicgames.com/p/" + product.urlSlug;
        const state = getGameState(product.title, url);

        return {
          state,
          title: product.title,
          imageSrc: product.keyImages.find((e) => e.type === "Thumbnail")?.url,
          url,
          platform: getPlatform("Epic Games Store"),
          productType: getProductType(product.offerType),
        };
      });

      return games;
    }
  } catch (error) {
    console.error(error);
  }

  return [];
};
