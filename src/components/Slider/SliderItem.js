import { useContext } from "react";
import classes from "./SliderItem.module.css";
import { BudgetContext } from "../../store/budget-context";
import useHttp from "../../hooks/useHttp";

function SliderItem(props) {
  const budgetCtx = useContext(BudgetContext);
  const { sendRequest } = useHttp();

  const handleDeleteBudgetType = (e) => {
    e.preventDefault();
    e.stopPropagation();

    sendRequest(
      `https://budget-app-81451-default-rtdb.asia-southeast1.firebasedatabase.app/category/${props.id}.json`,
      "DELETE",
      null
    );
    sendRequest(
      `https://budget-app-81451-default-rtdb.asia-southeast1.firebasedatabase.app/cost/${props.type}.json`,
      "DELETE",
      null
    );
    sendRequest(
      `https://budget-app-81451-default-rtdb.asia-southeast1.firebasedatabase.app/income/${props.type}.json`,
      "DELETE",
      null
    );

    budgetCtx.deleteCategory(props.id);
  };

  return (
    <div className={classes.item} onClick={props.onClick}>
      {props.id !== undefined && (
        <img
          src="./assets/img/bin.jpg"
          alt=""
          className={classes["delete-category"]}
          id={props.id}
          onClick={(e) => handleDeleteBudgetType(e)}
        ></img>
      )}
      <div className={classes["item-img"]}>
        <img
          src={props.img ? props.img : "./assets/img/unavailable.png"}
          alt=""
          style={{ width: "100%" }}
        />
      </div>
      <h4 className={classes["item-heading"]}>{props.type}</h4>
    </div>
  );
}

export default SliderItem;
