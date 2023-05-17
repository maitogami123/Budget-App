import { useContext, useEffect, useState } from "react";
import { BudgetContext } from "../../../store/budget-context";
import Modal from "../../Modal/Modal";
import classes from "./BudgetDetail.module.css";
import BudgetDetailItem from "./BudgetDetailItem";

function BudgetDetail(props) {
  const [budgetDetailItems, setBudgetDetailItems] = useState([]);
  const { categories } = useContext(BudgetContext);
  const [paginationState, setPaginationState] = useState({
    width: 0,
    transLimit: 0,
    currentTransformValue: 0,
    pageLimit: 0,
    currentPage: 1,
  });

  useEffect(() => {
    fetch(
      `https://budget-app-81451-default-rtdb.asia-southeast1.firebasedatabase.app/${props.type}/${props.category}.json`
    )
      .then((res) => res.json())
      .then((data) => {
        const loadedBudgetItems = Object.keys(data).map((key) => {
          return {
            id: key,
            date: data[key].date,
            description: data[key].description,
            money: data[key].money,
            head: data[key].head,
          };
        });
        setBudgetDetailItems(loadedBudgetItems);
        const widthValue = Math.ceil(loadedBudgetItems.length / 3) * 100;
        const transLimit = -Math.ceil(loadedBudgetItems.length / 3) * 50;
        const pageLimit = Math.ceil(loadedBudgetItems.length / 3);
        setPaginationState((prevState) => {
          return {
            ...prevState,
            width: widthValue,
            transLimit: transLimit,
            pageLimit: pageLimit,
          };
        });
      });
  }, [props.type, props.category, categories]);

  const handleChangeSlide = (pageVal) => {
    setPaginationState(prevState => {
      return {
        ...prevState,
        currentPage: prevState.currentPage += pageVal,
        currentTransformValue: prevState.currentTransformValue += pageVal * -50
      }
    })
  }

  return (
    <Modal onClose={props.onClose}>
      <div className={classes["modal-details"]}>
        {paginationState.pageLimit > 1 && (
          <>
            <div
              className={`${classes["modal-pagination__left"]} ${
                paginationState.currentPage === 1 && classes["disabled"]
              }`}
              onClick={() => handleChangeSlide(-1)}
            >
              <span>{"<"}</span>
            </div>
            <div
              className={`${classes["modal-pagination__right"]} ${
                paginationState.currentPage === paginationState.pageLimit &&
                classes["disabled"]
              }`}
              onClick={() => handleChangeSlide(1)}
            >
              <span>{">"}</span>
            </div>
          </>
        )}
        <div className={classes["modal-details__heading"]}>
          <span className={classes["total-money"]}>${props.total}</span>{" "}
          {`${props.category} ${props.type}`}
        </div>
        <div className={classes["modal-details__pagination"]}>
          <ul
            className={classes["modal-details__list"]}
            style={{
              "--widthValue": `${paginationState.width}%`,
              "--transformValue": `${paginationState.currentTransformValue}%`,
            }}
          >
            {budgetDetailItems.map((item) => (
              <BudgetDetailItem
                key={item.id}
                img={props.img}
                head={item.head}
                money={item.money}
                description={item.description}
                date={item.date}
                type={props.type}
              />
            ))}
          </ul>
        </div>
        <button className={classes["close-btn"]} onClick={props.onClose}>
          Close !
        </button>
      </div>
    </Modal>
  );
}

export default BudgetDetail;
