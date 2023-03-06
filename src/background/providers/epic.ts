import { getProductType, getPlatform } from "../../utils";
import { IFreeGame } from "../../types/freegames";
import { db } from "../../utils/db";
import { EpicGamesRequestData } from "../../types/epicgames";
import axios from "axios";

export const getEpicGames = async (): Promise<IFreeGame[]> => {
  try {
    const { status, data } = await axios<EpicGamesRequestData>({
      url: "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions",
      timeout: 10000,
    });

    if (status === 200) {
      const products = data.data.Catalog.searchStore.elements.filter(
        (p) => p.offerMappings.length > 0 && p.price.totalPrice.discountPrice === 0
      );

      const games: IFreeGame[] = products.map((product) => {
        const url = "https://store.epicgames.com/p/" + product.offerMappings[0].pageSlug;
        const state = db.find("game", { title: product.title, url })?.state || {
          hasClicked: false,
          hasSendNotification: false,
        };

        return {
          state: state,
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
