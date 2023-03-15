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
  width: 100%;
  background-color: var(--background-level-3);
  color: var(--text-color);
  font-size: 1rem;
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  font-weight: bold;
  cursor: pointer;
  border: 0;
  border-bottom: 1px solid var(--background-level-2);

  &[aria-expanded="true"] {
    & > svg {
      transform: rotate(180deg);
    }
  }
`;

const contentStyle = css`
  overflow: hidden;
  transition: 0.2s all ease;
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
      } else {
        target.style.maxHeight = 0 + "px";
      }
    }
  }, [isOpen, contentRef]);

  return (
    <div className={containerClassName}>
      <Button aria-expanded={isOpen} aria-controls={id} onClick={() => setIsOpen(!isOpen)}>
        {text} <IoCaretDown />
      </Button>
      <div id={id} className={clsx(contentStyle, contentClassName)} aria-hidden={isOpen} ref={contentRef}>
        {children}
      </div>
    </div>
  );
};
