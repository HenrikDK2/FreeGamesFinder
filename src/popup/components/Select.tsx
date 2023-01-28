import { css, styled } from "goober";
import { FunctionComponent } from "preact";
import { IoCaretDown } from "react-icons/io5";
import { useRef, useState } from "preact/hooks";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

interface SelectProps {
  className?: string;
  onChange: (item: string) => void;
  items: string[];
  value: string;
  id: string;
  label: string;
}

const SelectButton = styled("button")`
  appearance: none;
  background-color: transparent;
  border: none;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: var(--text-color);
  font-weight: 500;
  font-size: 1rem;
  border-bottom: 1px solid;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
  padding: 6px;
  width: 100%;
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const List = styled("ul")`
  margin: 0;
  padding: 0;
  z-index: 20;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  transform: translateY(100%);
  list-style: none;
  display: flex;
  flex-direction: column;
  background-color: var(--background-level-2);

  &[aria-hidden="false"] {
    display: none;
  }
`;

const SelectItemButton = styled("button")`
  font-size: 1rem;
  padding: 12px 6px;
  appearance: none;
  margin: 0;
  box-sizing: border-box;
  background-color: transparent;
  border: none;
  width: 100%;
  color: var(--text-color);
  text-align: left;
  cursor: pointer;
  outline: none;
  transition: all 50ms ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    outline: none;
  }

  &[data-active="true"] {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Caret = styled(IoCaretDown)`
  margin-left: auto;
`;

const containerClassName = css`
  position: relative;
  box-sizing: border-box;
`;

const Label = styled("label")`
  padding: 0 6px;
  font-weight: 500;
  margin-bottom: 4px;
  display: block;
  font-size: 1rem;
  color: var(--text-color);
`;

export const Select: FunctionComponent<SelectProps> = ({ onChange, id, className, label, value, items }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useOnClickOutside(ref, () => isOpen && setIsOpen(false));

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div ref={ref} className={containerClassName}>
        <SelectButton aria-expanded={isOpen} aria-controls={id} onClick={() => setIsOpen(!isOpen)}>
          {value}
          <Caret />
        </SelectButton>
        <List aria-hidden={isOpen} id={id}>
          {items.map((e) => (
            <li key={e}>
              <SelectItemButton
                data-active={value === e}
                onClick={() => {
                  setIsOpen(false);
                  if (value !== e) onChange(e);
                }}
              >
                {e}
              </SelectItemButton>
            </li>
          ))}
        </List>
      </div>
    </div>
  );
};
