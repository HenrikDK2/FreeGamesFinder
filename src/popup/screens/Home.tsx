import { styled } from "goober";
import { ComponentChildren, FunctionComponent } from "preact";
import { RootState } from "../../types";
import { IFreeGame } from "../../types/freegames";
import { db } from "../../utils/db";
import { Layout } from "../components/Layout";
import { StoreIcon } from "../components/StoreIcon";
import { IoMdSad } from "react-icons/io";
import { truncateString } from "../utils";
interface HomeScreenProps {
  children?: ComponentChildren;
  state: RootState;
}

const GamesList = styled("ul")`
  list-style: none;
  padding: 0 0 100px 0;
  margin: 0;
`;

const GameItem = styled("li")(({ game }: { game: IFreeGame }) => ({
  display: "block",
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

  "&:hover, &:focus-visible": {
    outline: "none",
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
`;

const NoGamesContainer = styled("div")`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  text-align: center;
  user-select: none;
  font-size: 1.5rem;
  opacity: 0.2;
  svg {
    margin-bottom: -2rem;
    font-size: 7rem;
  }
`;

const Image = styled("img")`
  border-radius: 6px 0 0 6px;
  object-fit: cover;
  font-size: 0;
  height: 100%;
  width: 100%;
`;

const clickHandler = (e: MouseEvent, game: IFreeGame) => {
  e.preventDefault();
  db.update("game", { ...game, state: { ...game.state, hasClicked: true } });
  window.open(game.url);
};

export const HomeScreen: FunctionComponent<HomeScreenProps> = ({ state }) => (
  <Layout>
    <GamesList>
      {state.games?.map((game) => (
        <GameItem key={game.url} settings={state.settings} game={game}>
          <a title={game.title} href={game.url} alt="" onClick={(e) => clickHandler(e, game)}>
            <ImageContainer>
              <Image loading="lazy" src={game.imageSrc} alt={"Image of " + game.title} />
              <StoreIcon platform={game.platform} />
            </ImageContainer>
            <Details>
              <h2>{truncateString(game.title, 38)}</h2>
              <p>{game.productType}</p>
            </Details>
          </a>
        </GameItem>
      ))}
    </GamesList>

    {state.games?.length === 0 && (
      <NoGamesContainer>
        <IoMdSad />
        <h3>No free games</h3>
      </NoGamesContainer>
    )}
  </Layout>
);
