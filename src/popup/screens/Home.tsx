import { styled } from "goober";
import { ComponentChildren, FunctionComponent } from "preact";
import { RootState } from "../../types";
import { IFreeGame } from "../../types/freegames";
import { ISettings } from "../../types/settings";
import { db } from "../../utils/storage";
import { Layout } from "../components/Layout";
import { StoreIcon } from "../components/StoreIcon";
import { IoMdSad } from "react-icons/io";
interface HomeScreenProps {
  children?: ComponentChildren;
  state: RootState;
}

const GamesList = styled("ul")`
  list-style: none;
  padding: 0 0 100px 0;
  margin: 0;
`;

const GameItem = styled("li")(({ game, settings }: { game: IFreeGame; settings: ISettings }) => ({
  display: settings.hideClickedGames && game.state.hasClicked ? "none" : "block",
  height: "100px",
  backgroundColor: "var(--background-level-2)",
  borderRadius: "6px",
  transition: "all 0.2s ease",
  opacity: game.state.hasClicked ? 0.2 : 1,
  "& > a": {
    display: "flex",
    alignItems: "flex-end",
    width: "100%",
    color: "var(--text-color)",
    height: "100%",
    textDecoration: "none",
  },

  "&:not(&:first-child)": {
    marginTop: "1rem",
  },

  "&:hover": {
    opacity: game.state.hasClicked ? 0.2 : 0.5,
  },
}));

const Details = styled("div")`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.5rem;
  margin-left: 0.5rem;
  box-sizing: border-box;

  & > h2 {
    margin: 0;
    padding: 0;
    font-size: 20px;
    overflow: hidden;
  }

  & > p {
    margin: auto 0 0 0;
    font-size: 14px;
    font-weight: 500;
  }
`;

const ImageContainer = styled("div")`
  position: relative;
  width: 80px;
  height: 100%;
  flex-shrink: 0;

  & > img {
    border-radius: 6px 0 0 6px;
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
`;

const NoGamesContainer = styled("div")`
  margin: auto 0;
  text-align: center;
  user-select: none;
  font-size: 1.5rem;
  opacity: 0.2;
  svg {
    margin-bottom: -2rem;
    font-size: 7rem;
  }
`;

const clickHandler = (e: MouseEvent, game: IFreeGame) => {
  e.preventDefault();
  db.update("game", { ...game, state: { ...game.state, hasClicked: true } });
  window.open(game.url);
};

const formatTitle = (str: string): string => {
  if (str.length >= 30) str = str.substring(0, 30) + "...";
  return str;
};

export const HomeScreen: FunctionComponent<HomeScreenProps> = ({ state }) => {
  const noGames = state.games === undefined || state.games.length < 1;

  return (
    <Layout>
      <GamesList>
        {state.games?.map((game) => (
          <GameItem key={game.url} settings={state.settings} game={game}>
            <a title={game.title} href={game.url} alt="" onClick={(e) => clickHandler(e, game)}>
              <ImageContainer>
                <img src={game.imageSrc} alt={"Image of " + game.title} />
                <StoreIcon platform={game.platform} />
              </ImageContainer>
              <Details>
                <h2>{formatTitle(game.title)}</h2>
                <p>{game.productType}</p>
              </Details>
            </a>
          </GameItem>
        ))}
      </GamesList>

      {noGames && (
        <NoGamesContainer>
          <IoMdSad />
          <h3>No free games</h3>
        </NoGamesContainer>
      )}
    </Layout>
  );
};
