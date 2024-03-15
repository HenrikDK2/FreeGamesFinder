import { ComponentChildren, FunctionComponent } from "preact";
import { styled } from "goober";
import { BottomMenu } from "./BottomMenu";

export const Main = styled("main")`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 1rem 1rem 0 1rem;
  box-sizing: border-box;

  @media (max-width: 800px) {
    width: 400px;
    height: 600px;
  }
`;

interface LayoutProps {
  children?: ComponentChildren;
  className?: string;
}

export const Layout: FunctionComponent<LayoutProps> = ({ children, className }) => (
  <>
    <Main className={className}>{children}</Main>
    <BottomMenu />
  </>
);
