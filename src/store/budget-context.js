import { createContext, useReducer, useEffect } from "react";

const initialBudgetContext = {
  costList: [],
  incomeList: [],
  addBudgetItem: () => {},
  deleteBudgetItem: (id) => {},
  categories: [],
  addCategory: () => {},
  deleteCategory: (id) => {},
};

export const BudgetContext = createContext(initialBudgetContext);

const transformObjectHandler = (budgetItems, categories) => {
  return Object.keys(budgetItems).map((key) => {
    let total = 0;
    let modified_date = 0;
    let category = categories.find(categoryItem => categoryItem.type.toLowerCase() === key.toLowerCase())
    Object.keys(budgetItems[key]).forEach((item) => {
      total += +budgetItems[key][item].money;
      modified_date = budgetItems[key][item].date;
    });
    return {
      id: category.id,
      budgetCategory: key,
      total,
      modified_date,
      category: category.img,
    };
  });
};

const budgetReducer = (state, action) => {
  if (action.type === "SET_COST_LIST") {
    return {
      ...state,
      costList: action.payload,
    };
  }
  
  if (action.type === "SET_INCOME_LIST") {
    return {
      ...state,
      incomeList: action.payload,
    };
  }
  
  if (action.type === "SET_CATEGORY") {
    return {
      ...state,
      categories: action.payload,
    };
  }

  if (action.type === "ADD_BUDGET") {
    return {
      ...state,
      categories: [...state.categories, action.payload]
    }
  }

  if (action.type === "DELETE_BUDGET") {
    const newCategoryList = state.categories.filter(item => item.id !== action.payload)
    const newIncomeList = state.incomeList.filter(item => item.id !== action.payload)
    const newCostList = state.costList.filter(item => item.id !== action.payload)

    return {
      ...state,
      categories: newCategoryList,
      incomeList: newIncomeList,
      costList: newCostList
    }
  }

  if (action.type === "ADD_COST_ITEM") {

  }

  if (action.type === "DELETE_COST_ITEM") {

  }
  
  if (action.type === "ADD_INCOME_ITEM") {

  }

  if (action.type === "DELETE_INCOME_ITEM") {

  }
};

const BudgetContextProvider = (props) => {
  const [budgetState, dispatch] = useReducer(
    budgetReducer,
    initialBudgetContext
  );
  useEffect(() => {
    Promise.all([
      fetch(
        "https://budget-app-81451-default-rtdb.asia-southeast1.firebasedatabase.app/income.json"
      ).then((res) => res.json()),
      fetch(
        "https://budget-app-81451-default-rtdb.asia-southeast1.firebasedatabase.app/cost.json"
      ).then((res) => res.json()),
      fetch(
        "https://budget-app-81451-default-rtdb.asia-southeast1.firebasedatabase.app/category.json"
      ).then((res) => res.json()),
    ]).then((res) => {
      const [incomeItems, costItems, categories] = res;
      const loadedCategories = Object.keys(categories).map((key) => {
        return {
          id: key,
          type: categories[key].type,
          img: categories[key].img,
        };
      });
      const loadedCostItems = transformObjectHandler(costItems, loadedCategories);
      const loadedIncomeItems = transformObjectHandler(incomeItems, loadedCategories);
      dispatch({
        type: "SET_CATEGORY",
        payload: loadedCategories,
      });
      dispatch({
        type: "SET_COST_LIST",
        payload: loadedCostItems,
      });
      dispatch({
        type: "SET_INCOME_LIST",
        payload: loadedIncomeItems,
      });
    });
  }, []);

  const addCategoryHandler = (newItem) => {
    dispatch({
      type: "ADD_BUDGET",
      payload: newItem
    })
  };

  const deleteCategoryHandler = (id) => {
    dispatch({
      type: "DELETE_BUDGET",
      payload: id
    })
  };

  const addBudgetItemHandler = () => {

  };

  const deleteBudgetItemHandler = () => {

  };

  const budgetContext = {
    costList: budgetState.costList,
    incomeList: budgetState.incomeList,
    categories: budgetState.categories,
    addBudgetItem: addBudgetItemHandler,
    deleteBudgetItem: deleteBudgetItemHandler,
    addCategory: addCategoryHandler,
    deleteCategory: deleteCategoryHandler,
  };

  return (
    <BudgetContext.Provider value={budgetContext}>
      {props.children}
    </BudgetContext.Provider>
  );
};

export default BudgetContextProvider;
