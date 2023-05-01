import Browser from "webextension-polyfill";
import { Error, Errors } from "../types";

export const createError = (error: Error) => {
  const errors = getErrors();
  localStorage.setItem("errors", JSON.stringify([error, ...errors]));

  Browser.runtime.sendMessage(undefined, "errors");
};

export const getErrors = (): Errors => {
  const errors = localStorage.getItem("errors");

  if (errors) return JSON.parse(errors);
  return [];
};
