import { useState } from "preact/hooks";
import { useBrowserRuntimeMsg } from "../hooks/useBrowserRuntimeMsg";
import { Errors } from "../../types";
import { styled } from "goober";
import { IoMdClose } from "react-icons/io";
import { truncateString } from "../utils";
import { db } from "../../utils/db";

const ErrorMessage = styled("aside")`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  width: 100vw;
  min-height: 30px;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: rgba(255, 0, 0, 0.7);
`;

const Message = styled("h4")`
  margin: 0;
  color: #fff;
  word-break: break-all;
  font-weight: bold;
`;

const DeleteButton = styled("button")`
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  color: #fff;
  flex-shrink: 0;
  width: 30px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const formatError = (errors: Errors) => {
  if (errors.length > 1) {
    return truncateString(`(${errors.length}) ` + errors[errors.length - 1], 1000);
  } else {
    return truncateString(errors[errors.length - 1], 1000);
  }
};

export const ErrorProvider = () => {
  const [errors, setErrors] = useState<Errors>(db.get("errors"));

  useBrowserRuntimeMsg((props) => {
    if (props.key === "errors") {
      setErrors(db.get("errors"));
    }
  });

  const clickDeleteHandler = () => {
    const newErrors: Errors = [...errors];
    newErrors.pop();

    db.update("errors", newErrors);
    setErrors(newErrors);
  };

  if (errors.length > 0) {
    return (
      <ErrorMessage>
        <Message>{formatError(errors)}</Message>
        <DeleteButton
          onClick={() => {
            clickDeleteHandler();
          }}
        >
          <IoMdClose />
        </DeleteButton>
      </ErrorMessage>
    );
  }

  return null;
};
