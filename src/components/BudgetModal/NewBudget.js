import { useContext, useRef } from "react";

import useHttp from "../../hooks/useHttp";
import { BudgetContext } from "../../store/budget-context";

import Modal from "../Modal/Modal";
import classes from "./NewBudget.module.css";

function NewBudget(props) {
  const budgetCtx = useContext(BudgetContext);
  const { sendRequest, clear } = useHttp();
  const categoryNameRef = useRef();
  const categoryImgRef = useRef();

  const handleSubmitCategoryForm = (e) => {
    e.preventDefault();
    const newBudgetType = {
      type: categoryNameRef.current.value,
      imgPath: categoryImgRef.current.value,
    };
    sendRequest(
      "https://budget-app-81451-default-rtdb.asia-southeast1.firebasedatabase.app/category.json",
      "POST",
      JSON.stringify(newBudgetType)
    );
    clear();
    budgetCtx.addCategory({
      ...newBudgetType,
      id: newBudgetType.type
    });
  };

  return (
    <Modal onClose={props.onClose}>
      <div className={classes["modal-add"]}>
        <h3 className={classes["modal-add__heading"]}>Create new category</h3>
        <div className={classes["modal-add__input"]}>
          <input
            type="text"
            id="input-category-name"
            placeholder="Category name"
            ref={categoryNameRef}
          />
          <input
            type="text"
            id="input-category-img"
            placeholder="Enter image URL"
            ref={categoryImgRef}
          />
        </div>
        <div className={classes["button-wrapper"]}>
          <button className={classes["cancel-btn"]} onClick={props.onClose}>
            Cancel
          </button>
          <button
            className={classes["confirm-btn"]}
            onClick={handleSubmitCategoryForm}
          >
            Create
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default NewBudget;
