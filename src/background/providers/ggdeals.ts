import { getProductType, getDOMFromUrl, getPlatform } from "../../utils";
import { IFreeGame } from "../../types/freegames";
import { db } from "../../utils/db";

export const getGGDeals = async (): Promise<IFreeGame[]> => {
  try {
    const htmlDocument = await getDOMFromUrl("https://gg.deals/deals/?maxPrice=0");

    if (htmlDocument) {
      return Array.from(htmlDocument.querySelectorAll("[data-container-game-id]")).map((el) => {
        const shopLink = el.querySelector(".shop-link") as HTMLAnchorElement;
        const titleLink = el.querySelector(".game-info-title") as HTMLAnchorElement;
        const img = el.querySelectorAll(".game-picture source")[1] as HTMLSourceElement;

        const url = "https://gg.deals" + shopLink.getAttribute("href");
        const title = titleLink.textContent || "";
        const imageSrc = img.getAttribute("srcset")!.split(",")[1].replace(" 2x", "");
        const platform = getPlatform(el.getAttribute("data-shop-name")!);

        const state = db.find("game", { url })?.state || {
          hasClicked: false,
          hasSendNotification: false,
        };

        return {
          url,
          productType: getProductType(),
          platform,
          state,
          title,
          imageSrc,
        };
      });
    }
  } catch (error) {
    console.error(error);
  }

  return [];
};
