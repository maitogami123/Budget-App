import Modal from "../Modal/Modal";

import classes from './BudgetForm.module.css'

function BudgetForm(props) {
  return (
    <Modal onClose={props.onClose}>
      <div className={classes["modal-add"]}>
        <h3 className={classes["modal-add__heading"]} id="modal-add__heading">
          Create new: {props.type}
        </h3>
        <div className={classes["modal-add__input"]}>
          <input
            type="number"
            id="input-money"
            placeholder="How much money will it be?"
          />
          <input type="text" id="input-heading" placeholder="header" />
        </div>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          className={classes["input-description"]}
          placeholder="description"
        ></textarea>
        <h3 className={classes["modal-add__heading"]}>Choose type:</h3>
        <div>
          <input type="radio" name="type" id="income" value="income" />
          <label htmlFor="income">Is this your income?</label>
        </div>
        <div>
          <input type="radio" name="type" id="cost" value="cost" />
          <label htmlFor="cost">Is this your cost?</label>
        </div>
        <div className={classes["button-wrapper"]}>
          <button className={classes["cancel-btn"]} onClick={props.onClose}>Cancel</button>
          <button className={classes["confirm-btn"]}>Create</button>
        </div>
      </div>
    </Modal>
  );
}

export default BudgetForm;
