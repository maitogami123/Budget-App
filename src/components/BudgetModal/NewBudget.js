import Modal from "../Modal/Modal";
import classes from './NewBudget.module.css'

function NewBudget(props) {
  return (
    <Modal onClose={props.onClose}>
      <div className={classes["modal-add"]}>
        <h3 className={classes["modal-add__heading"]}>Create new category</h3>
        <div className={classes["modal-add__input"]}>
          <input
            type="text"
            id="input-category-name"
            placeholder="Category name"
          />
          <input
            type="text"
            id="input-category-img"
            placeholder="Enter image URL"
          />
        </div>
        <div className={classes["button-wrapper"]}>
          <button className={classes["cancel-btn"]} onClick={props.onClose}>Cancel</button>
          <button className={classes["confirm-btn"]}>Create</button>
        </div>
      </div>
    </Modal>
  );
}

export default NewBudget;
