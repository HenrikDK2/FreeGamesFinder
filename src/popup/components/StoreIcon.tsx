import { css } from "goober";
import { FunctionComponent } from "preact";
import { Platform } from "../../types/freegames";
import EpicLogo from "../../assets/epic.svg";
import SteamLogo from "../../assets/steam.svg";
import GoGLogo from "../../assets/gog.svg";
import itchioSrc from "../../assets/itchio.jpg";
import indiegalaSrc from "../../assets/indiegala.png";

interface StoreIconProps {
  platform?: Platform;
}

const IconClassName = css`
  position: absolute;
  right: 2px;
  top: 2px;
  width: 25px;
  border-radius: 6px;
  height: 25px;
`;

export const StoreIcon: FunctionComponent<StoreIconProps> = ({ platform }) => {
  if (platform === "GoG") return <GoGLogo className={IconClassName} />;
  if (platform === "Epic Games Store") return <EpicLogo className={IconClassName} />;
  if (platform === "Steam") return <SteamLogo className={IconClassName} />;
  if (platform === "Itch.io") return <img className={IconClassName} src={itchioSrc} />;
  if (platform === "IndieGala") return <img className={IconClassName} src={indiegalaSrc} />;

  return null;
};
