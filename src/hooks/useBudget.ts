import { useContext } from "react";
import { BudgetContext } from "../context/BudgetContext";

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("Use must be used within BudgetProvider");
  }
  return context;
};
