import { useContext } from "react";
import { BudgetContext } from "../../store/budget-context";

import BudgetItem from "./BudgetItem";

import classes from "./BudgetList.module.css";

function BudgetList() {
  const budgetCtx = useContext(BudgetContext)

  return (
    <div className={classes["budget-details"]}>
      <div className={classes["budget-income"]}>
        <h2 className={classes["budget-income__heading"]}>Income</h2>
        <ul className={classes["budget-income__list"]}>
          {budgetCtx.incomeList.map((incomeItem) => (
            <BudgetItem
              key={incomeItem.budgetCategory}
              type="income"
              date={incomeItem.modified_date}
              category={incomeItem.budgetCategory}
              total={incomeItem.total}
              img = {incomeItem.budgetImageURL}
            />
          ))}
        </ul>
      </div>
      <div className={classes["budget-cost"]}>
        <h2 className={classes["budget-cost__heading"]}>Cost</h2>
        <ul className={classes["budget-cost__list"]}>
          {budgetCtx.costList.map((costItem) => (
            <BudgetItem
              key={costItem.budgetCategory}
              type="cost"
              date={costItem.modified_date}
              category={costItem.budgetCategory}
              total={costItem.total}
              img = {costItem.budgetImageURL}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BudgetList;
