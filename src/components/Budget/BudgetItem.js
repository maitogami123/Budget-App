import { Fragment, useState } from "react";
import BudgetDetail from "./BudgetDetail/BudgetDetail";
import classes from "./BudgetItem.module.css";

function BudgetItem(props) {
  const [budgetDetailIsShow, setBudgetDetailIsShow] = useState(false);

  return (
    <Fragment>
      {budgetDetailIsShow && (
        <BudgetDetail
          category={props.category}
          type={props.type}
          total={props.total}
          img = {props.img}
          onClose={() => setBudgetDetailIsShow(false)}
        />
      )}
      <li
        className={classes[`budget-${props.type}__item`]}
        id={props.category}
        onClick={() => setBudgetDetailIsShow(true)}
      >
        <img
          src="./assets/img/bin.jpg"
          className={classes[`budget-${props.type}__item-delete`]}
          alt={`delete ${props.category}`}
          id={props.category}
        />
        <div className={classes[`${props.type}-item__img`]}>
          <img
            src={props.img ? props.img : "./assets/img/unavailable.png"}
            alt={props.category}
            className={classes["item-img"]}
          />
        </div>
        <div className={classes[`${props.type}-item__details`]}>
          <h4 className={classes[`${props.type}-item__heading`]}>
            {`${props.category} ${props.type}`}
          </h4>
          <p className={classes[`${props.type}-item__money`]}>${props.total}</p>
          <p className={classes[`${props.type}-item__create-date`]}>
            {props.date}
          </p>
        </div>
      </li>
    </Fragment>
  );
}

export default BudgetItem;
