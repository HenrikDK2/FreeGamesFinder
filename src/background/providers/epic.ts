import { getProductType, getPlatform, getGameState } from "../../utils/game";
import { IFreeGame } from "../../types/freegames";
import { Element, EpicGamesRequestData } from "../../types/epicgames";
import axios from "axios";
import { createError } from "../../utils/errorHandler";

const getUrlSlug = (game: Element): string => {
  if (game.offerMappings[0]) {
    return game.offerMappings[0].pageSlug;
  }

  if (game.catalogNs.mappings[0]) {
    return game.catalogNs.mappings[0].pageSlug;
  }

  if (game.productSlug) {
    return game.productSlug;
  }

  return game.urlSlug;
};

const getImageSrc = (game: Element): string => {
  const thumbnail = game.keyImages.find((e) => e.type === "Thumbnail")?.url;

  if (typeof thumbnail === "string" && thumbnail.length > 0) {
    return thumbnail;
  } else {
    return game.keyImages[0].url;
  }
};

export const getEpicGames = async (): Promise<IFreeGame[]> => {
  try {
    const { status, data } = await axios<EpicGamesRequestData>({
      url: "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions",
    });

    if (status === 200) {
      const products = data.data.Catalog.searchStore.elements.filter((p) => {
        const effectiveDate = new Date(p.effectiveDate);
        const isActive = Date.now() - effectiveDate.getTime() < 0 ? false : true;

        if (p.price.totalPrice.discountPrice === 0 && isActive) return true;
      });

      const games: IFreeGame[] = products.map((product) => {
        const url = "https://store.epicgames.com/p/" + getUrlSlug(product);
        const state = getGameState(product.title, url);

        return {
          state,
          title: product.title,
          imageSrc: getImageSrc(product),
          url,
          platform: getPlatform("Epic Games Store"),
          productType: getProductType(product.offerType),
        };
      });

      return games;
    }
  } catch (error) {
    createError("An error occured with Epic provider: ", error);
    throw error;
  }

  return [];
};
