import { styled } from "goober";
import { ComponentChildren, FunctionComponent } from "preact";
import { FreeGamesData, GameState, IFreeGameData } from "../../types/freegames";
import { setGameData } from "../../utils";
import { StoreIcon } from "../components/StoreIcon";
import pkg from "../../../public/manifest.json";

interface HomeScreenProps {
  children?: ComponentChildren;
  freeGames?: FreeGamesData;
}

const Main = styled("main")`
  display: flex;
  flex-direction: column;
  min-width: 350px;
  min-height: 500px;
`;

const GamesList = styled("ul")`
  padding: 1rem;
  list-style: none;
  margin: 0;
`;

const GameItem = styled("li")(({ state }: { state: GameState }) => ({
  height: "100px",
  backgroundColor: "#353347",
  borderRadius: "6px",
  transition: "all 0.2s ease",
  opacity: state.hasClicked ? 0.2 : 1,
  "& > a": {
    display: "flex",
    alignItems: "flex-end",
    width: "100%",
    color: "#fff",
    height: "100%",
    textDecoration: "none",
  },

  "&:not(&:first-child)": {
    marginTop: "1rem",
  },

  "&:hover": {
    opacity: state.hasClicked ? 0.2 : 0.5,
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

const Version = styled("p")`
  font-family: "Poppins";
  text-align: center;
  margin-top: auto;
  font-weight: medium;
  padding: 2rem 0;
`;

export const HomeScreen: FunctionComponent<HomeScreenProps> = ({ freeGames }) => {
  const clickHandler = (e: MouseEvent, game: IFreeGameData) => {
    e.preventDefault();
    setGameData({ ...game, state: { ...game.state, hasClicked: true } });

    window.open(game.url);
    window.close();
  };

  return (
    <Main>
      <GamesList>
        {freeGames?.map((game) => (
          <GameItem state={game.state}>
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
      <Version>Version {pkg.version}</Version>
    </Main>
  );
};
