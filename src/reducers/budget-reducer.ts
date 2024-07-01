import { v4 as uuidv4 } from "uuid";
import { Category, DraftExpense } from "../types";
import { Expense } from "../types/index";

export type BudgetActions =
  | {
      type: "add-budget";
      payload: { budget: number };
    }
  | { type: "show-modal" }
  | { type: "close-modal" }
  | { type: "add-expense"; payload: { expense: DraftExpense } }
  | { type: "remove-expense"; payload: { id: Expense["id"] } }
  | { type: "get-expense-by-id"; payload: { id: Expense["id"] } }
  | { type: "update-expense"; payload: { expense: Expense } }
  | { type: "reset-amount" }
  | { type: "add-filter-category"; payload: { id: Category["id"] } };

export type BudgetState = {
  budget: number;
  modal: boolean;
  expenses: Expense[];
  editingId: Expense["id"];
  currentCategory: Category["id"];
};

const initialBudge = (): number => {
  const localstorageBudge = localStorage.getItem("budget");
  return localstorageBudge ? +localstorageBudge : 0;
};

const localstorageExpense = (): Expense[] => {
  const localstorageBudge = localStorage.getItem("expenses");
  return localstorageBudge ? JSON.parse(localstorageBudge) : [];
};

const resetAmount = () => {
  localStorage.removeItem("expenses");
  localStorage.removeItem("budget");
};
export const initialState: BudgetState = {
  budget: initialBudge(),
  modal: false,
  expenses: localstorageExpense(),
  editingId: "",
  currentCategory: "",
};

const createdExpense = (draftExpense: DraftExpense): Expense => {
  return {
    ...draftExpense,
    id: uuidv4(),
  };
};

export const budgetReducer = (state: BudgetState, action: BudgetActions) => {
  if (action.type === "add-budget")
    return {
      ...state,
      budget: action.payload.budget,
    };
  if (action.type === "show-modal") {
    return {
      ...state,
      modal: true,
    };
  }
  if (action.type === "close-modal") {
    return {
      ...state,
      modal: false,
      editingId: "",
    };
  }
  if (action.type === "add-expense") {
    const expense = createdExpense(action.payload.expense);

    return {
      ...state,
      expenses: [...state.expenses, expense],
      modal: false,
    };
  }

  if (action.type === "remove-expense") {
    return {
      ...state,
      expenses: state.expenses.filter(
        (expense) => expense.id !== action.payload.id
      ),
    };
  }
  if (action.type === "get-expense-by-id") {
    return {
      ...state,
      editingId: action.payload.id,
      modal: true,
    };
  }
  if (action.type === "update-expense") {
    return {
      ...state,
      expenses: state.expenses.map((expense) =>
        expense.id === action.payload.expense.id
          ? action.payload.expense
          : expense
      ),
      modal: false,
      editingId: "",
    };
  }
  if (action.type === "reset-amount") {
    const resetApp = resetAmount();
    return {
      ...state,
      resetAmount: resetApp,
    };
  }
  if (action.type === "add-filter-category") {
    return {
      ...state,
      currentCategory: action.payload.id,
    };
  }

  return state;
};
