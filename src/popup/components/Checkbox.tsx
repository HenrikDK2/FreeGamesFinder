import { styled } from "goober";
import { FunctionComponent } from "preact";
import { IoMdCheckmark } from "react-icons/io";
import { IoClose } from "react-icons/io5";

interface CheckboxProps {
  className?: string;
  onClick: () => void;
  label: string;
  isChecked: boolean;
}

const Container = styled("div")`
  position: relative;
  box-sizing: border-box;
  margin-left: -4px;
`;

const Button = styled("button")`
  appearance: none;
  background-color: transparent;
  color: var(--text-color);
  display: flex;
  align-items: center;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  border: none;
`;

const Box = styled("div")`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--background-level-3);
  background-color: var(--background-level-3);
  margin-right: 1rem;
  width: 20px;
  border-radius: 6px;
  height: 20px;

  svg {
    display: none;
    font-size: 24px;
  }
`;

const Checkmark = styled(IoMdCheckmark)`
  &[data-checked="true"] {
    display: block;
  }
`;

const RemoveOutline = styled(IoClose)`
  &[data-checked="false"] {
    display: block;
  }
`;

export const Checkbox: FunctionComponent<CheckboxProps> = ({ onClick, className, label, isChecked }) => (
  <Container className={className}>
    <Button onClick={onClick}>
      <Box>
        <Checkmark data-checked={isChecked} />
        <RemoveOutline data-checked={isChecked} />
      </Box>
      {label}
    </Button>
  </Container>
);
