import { createContext, useContext } from "react";

export const SelectsContext = createContext();

export const useSelects = () => useContext(SelectsContext);