import { useState } from "preact/hooks";
import { useBrowserRuntimeMsg } from "../hooks/useBrowserRuntimeMsg";
import { Errors } from "../../types";
import { styled } from "goober";
import { IoMdClose } from "react-icons/io";
import { truncateString } from "../utils";
import { db } from "../../utils/db";
import { IoCopy } from "react-icons/io5";
import Browser from "webextension-polyfill";

const ErrorMessage = styled("aside")`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  width: 100vw;
  min-height: 30px;
  padding: 1rem 1rem 3rem 1rem;
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
  opacity: 0.8;
  cursor: pointer;
  color: #fff;
  transition: all 0.2s ease;
  flex-shrink: 0;
  width: 30px;
  &:hover {
    opacity: 1;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

const CopyButton = styled(DeleteButton)`
  position: absolute;
  left: 1rem;
  bottom: 1rem;

  &:active {
    scale: 1.1;
  }
`;

const formatError = (errors: Errors) => {
  if (errors.length > 1) {
    return truncateString(`(${errors.length}) ` + errors[errors.length - 1], 1000);
  } else {
    return truncateString(errors[errors.length - 1].msg, 1000);
  }
};

export const ErrorProvider = () => {
  const [errors, setErrors] = useState<Errors>(db.get("errors"));
  const settings = db.get("settings");

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

  const clickCopyHandler = () => {
    navigator.clipboard.writeText(errors[errors.length - 1].details);
    Browser.tabs.create({
      url: "https://github.com/HenrikDK2/FreeGamesFinder/issues/new?assignees=HenrikDK2&labels=bug&projects=&template=bug_report.md&title=%5BBUG%5D+Something+went+wrong",
    });
  };

  if (settings.showErrors && errors.length > 0) {
    return (
      <ErrorMessage>
        <Message>{formatError(errors)}</Message>
        <DeleteButton onClick={() => clickDeleteHandler()}>
          <IoMdClose />
        </DeleteButton>
        <CopyButton onClick={() => clickCopyHandler()}>
          <IoCopy />
        </CopyButton>
      </ErrorMessage>
    );
  }

  return null;
};
