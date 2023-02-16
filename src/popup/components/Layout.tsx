import { ComponentChildren, FunctionComponent } from "preact";
import { styled } from "goober";
import { BottomMenu } from "./BottomMenu";

export const Main = styled("main")`
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 500px;
  overflow: auto;
  padding: 1rem 1rem 0 1rem;
  box-sizing: border-box;
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
