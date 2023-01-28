import { styled } from "goober";
import { ComponentChildren, FunctionComponent } from "preact";
import { RootState } from "../../types";
import { IFreeGame } from "../../types/freegames";
import { ISettings } from "../../types/settings";
import { updateGameState } from "../../utils/storage";
import { Layout } from "../components/Layout";
import { StoreIcon } from "../components/StoreIcon";

interface HomeScreenProps {
  children?: ComponentChildren;
  state: RootState;
}

const GamesList = styled("ul")`
  list-style: none;
  padding: 0;
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

  & > img {
    border-radius: 6px 0 0 6px;
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
`;

const clickHandler = (e: MouseEvent, game: IFreeGame) => {
  e.preventDefault();
  updateGameState(game, { hasClicked: true });
  window.open(game.url);
};

export const HomeScreen: FunctionComponent<HomeScreenProps> = ({ state }) => {
  return (
    <Layout>
      <GamesList>
        {state.games?.map((game) => (
          <GameItem key={game.url} settings={state.settings} game={game}>
            <a href={game.url} alt="" onClick={(e) => clickHandler(e, game)}>
              <ImageContainer>
                <img src={game.imageSrc} alt={"Image of " + game.title} />
                <StoreIcon platform={game.platform} />
              </ImageContainer>
              <Details>
                <h2>{game.title}</h2>
                <p>{game.productType}</p>
              </Details>
            </a>
          </GameItem>
        ))}
      </GamesList>
    </Layout>
  );
};
