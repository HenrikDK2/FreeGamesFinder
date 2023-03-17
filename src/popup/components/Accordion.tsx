import clsx from "clsx";
import { css, styled } from "goober";
import { ComponentChildren, FunctionComponent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { IoCaretDown } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";

interface AccordionProps {
  children?: ComponentChildren;
  containerClassName?: string;
  contentClassName?: string;
  isDefaultOpen?: boolean;
  text: string;
}

const Button = styled("button")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: capitalize;
  width: 100%;
  background-color: var(--background-level-2);
  color: var(--text-color);
  font-size: 1.25rem;
  padding: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
  font-weight: 500;
  cursor: pointer;
  border: 0;
  border-bottom: 1px solid var(--background-level-1);

  &[aria-expanded="true"] {
    & > svg {
      transform: rotate(180deg);
    }
  }

  &:focus-visible {
    outline: none;
    background-color: var(--background-level-3);
  }
`;

const containerStyle = css`
  &:last-child > button {
    border: none;
  }
`;

const contentStyle = css`
  overflow: hidden;
  max-height: 0;
  transition: 0.2s all ease;
  opacity: 1;

  &[aria-hidden="true"] {
    margin: 0;
  }
`;

export const Accordion: FunctionComponent<AccordionProps> = ({
  children,
  containerClassName,
  contentClassName,
  text,
  isDefaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(isDefaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const id = uuidv4();

  useEffect(() => {
    if (contentRef.current) {
      const target = contentRef.current;

      if (isOpen) {
        target.style.maxHeight = target.scrollHeight + "px";
        target.style.opacity = "1";
        target.inert = false;
      } else {
        target.inert = true;
        target.style.maxHeight = 0 + "px";
        target.style.overflow = "hidden";
        target.style.opacity = "0";
      }

      const transitionHandler = (e: TransitionEvent) => {
        if (e.propertyName === "max-height" && isOpen) {
          target.style.overflow = "initial";
        }
      };

      target.addEventListener("transitionend", transitionHandler);

      return () => {
        target.removeEventListener("transitionend", transitionHandler);
      };
    }
  }, [isOpen, contentRef]);

  return (
    <div className={clsx(containerStyle, containerClassName)}>
      <Button aria-expanded={isOpen} aria-controls={id} onClick={() => setIsOpen(!isOpen)}>
        {text} <IoCaretDown />
      </Button>
      <div id={id} className={clsx(contentStyle, contentClassName)} aria-hidden={!isOpen} ref={contentRef}>
        {children}
      </div>
    </div>
  );
};
