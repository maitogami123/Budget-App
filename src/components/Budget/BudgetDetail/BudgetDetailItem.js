import classes from './BudgetDetailItem.module.css'

function BudgetDetailItem(props) {
  return (
    <li className={classes["budget-item"]}>
      <div className={classes[`${props.type}-item__img`]}>
        <img src={props.img ? props.img : "./assets/img/unavailable.png"} alt="" />
      </div>
      <div className={classes["budget-content"]}>
        <div className={classes["budget-heading"]}>
          <span className={classes["budget-name"]}>{props.head}</span>
          <span className={classes["budget-money"]}>: {props.money}$</span>
        </div>
        <p className={classes["budget-description"]}>{props.description}</p>
        <p className={classes["budget-create-date"]}>{props.date}</p>
      </div>
    </li>
  );
}

export default BudgetDetailItem;
