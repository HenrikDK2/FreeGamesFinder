import { css } from "goober";
import { FunctionComponent } from "preact";
import { Platform } from "../../types/freegames";
import EpicLogo from "../../assets/epic.svg";
import SteamLogo from "../../assets/steam.svg";
import GoGLogo from "../../assets/gog.svg";

interface StoreIconProps {
  platform?: Platform;
}

const IconClassName = css`
  position: absolute;
  right: 2px;
  top: 2px;
  width: 25px;
  height: 25px;
`;

export const StoreIcon: FunctionComponent<StoreIconProps> = ({ platform }) => {
  if (platform === "GoG") return <GoGLogo className={IconClassName} />;
  if (platform === "EpicGamesStore") return <EpicLogo className={IconClassName} />;
  if (platform === "Steam") return <SteamLogo className={IconClassName} />;

  return null;
};
