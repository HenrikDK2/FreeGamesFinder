import { getProductType, getDOMFromUrl, getPlatform, sortGames, switchIcon, getGame } from ".";
import { FreeGamesData } from "../types/freegames";

/* export const getEpicGames = async (): Promise<FreeGamesData | undefined> => {
  try {
    const { status, data } = await axios.get<EpicGamesRequestData>(
      "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions"
    );

    if (status === 200) {
      const products = data.data.Catalog.searchStore.elements.filter(
        (p) => p.offerMappings.length > 0 && p.price.totalPrice.discountPrice === 0
      );

      return products.map((product) => {
        const url = "https://store.epicgames.com/p/" + product.offerMappings[0].pageSlug;

        return {
          state: getGameState(product.title),
          title: product.title,
          imageSrc: product.keyImages.find((e) => e.type === "Thumbnail")?.url,
          url,
          productType: getProductType(product.offerType),
        };
      });
    }
  } catch (error) {
    console.error(error);
  }
}; */

const ggDeals = async (): Promise<FreeGamesData | undefined> => {
  const htmlDocument = await getDOMFromUrl("https://gg.deals/deals/?maxPrice=0");

  if (htmlDocument) {
    return Array.from(htmlDocument.querySelectorAll("[data-container-game-id]")).map((el) => {
      const shopLink = el.querySelector(".shop-link") as HTMLAnchorElement;
      const titleLink = el.querySelector(".game-info-title") as HTMLAnchorElement;
      const img = el.querySelectorAll(".game-picture source")[1] as HTMLSourceElement;

      const url = "https://gg.deals" + shopLink.getAttribute("href");
      const title = titleLink.textContent || "";
      const imageSrc = img.getAttribute("srcset")!.split(",")[1].replace(" 2x", "");
      const state = getGame(title)?.state || { hasClicked: false, hasSendNotification: false };

      return {
        url,
        productType: getProductType(),
        platform: getPlatform(el.getAttribute("data-shop-name")!),
        state,
        title,
        imageSrc,
      };
    });
  }

  return undefined;
};

export const getGames = async (): Promise<FreeGamesData | undefined> => {
  const games = sortGames(await ggDeals());
  localStorage.setItem("games", JSON.stringify(games));
  switchIcon(games);

  return games;
};
