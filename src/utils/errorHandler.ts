import Browser from "webextension-polyfill";
import { Error, Errors } from "../types";

export const createError = (str: Error, error: any) => {
  const errors = getErrors();
  let errorMsg: string = "";

  if (error.message && typeof error.message === "string") {
    errorMsg = error.message;
  } else if (error && typeof error === "string") {
    errorMsg = error;
  } else if (error.msg && typeof error.msg === "string") {
    errorMsg = error.msg;
  }

  localStorage.setItem("errors", JSON.stringify([str + errorMsg, ...errors]));

  Browser.runtime.sendMessage(undefined, "errors");
};

export const getErrors = (): Errors => {
  const errors = localStorage.getItem("errors");

  if (errors) return JSON.parse(errors);
  return [];
};
