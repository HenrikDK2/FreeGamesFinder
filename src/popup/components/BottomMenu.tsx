import { styled } from "goober";
import { FunctionComponent } from "preact";
import { NavLink } from "./NavLink";
import { IoMdHome, IoMdSettings } from "react-icons/io";

const Menu = styled("footer")`
  background-color: var(--background-level-0);
  width: 100vw;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 80px;
`;

const Nav = styled("nav")`
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const BottomMenu: FunctionComponent = () => (
  <Menu>
    <Nav>
      <NavLink text="Home" icon={<IoMdHome />} subRoutes={["/index.html"]} to="/" />
      <NavLink text="Settings" icon={<IoMdSettings />} to="/settings" />
    </Nav>
  </Menu>
);
