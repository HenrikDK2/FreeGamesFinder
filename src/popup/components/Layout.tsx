import { ComponentChildren, FunctionComponent } from "preact";
import { styled } from "goober";
import { BottomMenu } from "./BottomMenu";

export const Main = styled("main")`
  min-width: 350px;
  min-height: 500px;
  padding: 1rem;
  box-sizing: border-box;
`;

interface LayoutProps {
  children?: ComponentChildren;
}

export const Layout: FunctionComponent<LayoutProps> = ({ children }) => (
  <>
    <Main>{children}</Main>
    <BottomMenu />
  </>
);
