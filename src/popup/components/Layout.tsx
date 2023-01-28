import { ComponentChildren, FunctionComponent } from "preact";
import { styled } from "goober";
import { BottomMenu } from "./BottomMenu";

export const Main = styled("main")`
  display: flex;
  flex-direction: column;
  min-width: 350px;
  min-height: 500px;
  padding: 1rem;
  padding-bottom: 80px;
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
