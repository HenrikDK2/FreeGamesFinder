import Browser from "webextension-polyfill";
import { Error } from "../types";
import { db } from "./db";

export const createError = (str: Error["msg"], error: any) => {
  const errors = db.get("errors");
  let errorMsg: string = "";

  if (error.message && typeof error.message === "string") {
    errorMsg = error.message;
  } else if (error && typeof error === "string") {
    errorMsg = error;
  } else if (error.msg && typeof error.msg === "string") {
    errorMsg = error.msg;
  }

  db.update("errors", [{ msg: str + errorMsg, details: error }, ...errors]);
};
