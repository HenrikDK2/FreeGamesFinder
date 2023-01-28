import { ComponentChildren, FunctionComponent } from "preact";
import { Link, getCurrentUrl } from "preact-router";
import clsx from "clsx";
import { css } from "goober";

interface NavLinkProps {
  to: string;
  icon: ComponentChildren;
  text: string;
  subRoutes?: string[];
}

const linkClassName = css`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  opacity: 0.7;
  color: var(--text-color);
  font-weight: 500;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }

  & > svg {
    font-size: 2rem;
  }
`;

const linkActive = css`
  opacity: 1;
`;

const isActive = (route: string, subRoutes?: string[]) => {
  if (getCurrentUrl() === route) return true;
  if (subRoutes) {
    for (const subRoute of subRoutes) {
      if (getCurrentUrl() === subRoute) return true;
    }
  }

  return false;
};

export const NavLink: FunctionComponent<NavLinkProps> = ({ text, icon, to, subRoutes }) => (
  <Link className={clsx(linkClassName, isActive(to, subRoutes) && linkActive)} href={to}>
    {icon}
    {text}
  </Link>
);
