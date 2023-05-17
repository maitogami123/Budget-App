import classes from "./Slider.module.css";
import SliderItem from "./SliderItem";
import { useEffect, useReducer, useState, useContext } from "react";
import SliderNavigation from "./SliderNavigation";
import BudgetForm from "../BudgetModal/BudgetForm";
import { BudgetContext } from "../../store/budget-context";

const initialSliderState = {
  transition: 0,
  transitionLimit: 0,
}

const sliderReducer = (curState, action) => {
  switch(action.type) {
    case 'SET':
      return {...curState, transitionLimit: action.transLim}
    case 'MOVE':
      return {...curState, transition: curState.transition += action.transValue}
    default:
      throw new Error('Undefined action')
  }
}

function Slider(props) {
  const [sliderState, dispatch] = useReducer(sliderReducer, initialSliderState)
  const [budgetType, setBudgetType] = useState("");
  const [addBudgetIsShow, setAddBudgetIsShow] = useState(false);
  const { categories } = useContext(BudgetContext)

  useEffect(() => {
    const transLimit = -Math.floor((Object.keys(categories).length + 1) / 6) * 100
    dispatch({type: 'SET', transLim: transLimit})
  }, [categories]);

  const handleShiftSlider = (value) => {
    dispatch({type: 'MOVE', transValue: value})
  };

  const handleShowModal = (budgetType) => {
    setAddBudgetIsShow(true)
    setBudgetType(budgetType)
  }

  return (
    <section className={classes.slider}>
      {addBudgetIsShow && (
        <BudgetForm type={budgetType} onClose={() => setAddBudgetIsShow(false)} />
      )}
      <SliderNavigation onClick={handleShiftSlider} sliderPos={sliderState}/>
      <div className={classes["slider__budget-type-wrapper"]}>
        <div
          className={classes["slider__budget-type"]}
          style={{ transform: `translateX(${sliderState.transition}%)` }}
        >
          {categories.map((category) => (
            <SliderItem
              key={category.id}
              type={category.type}
              img={category.img}
              onClick={handleShowModal.bind(null, category.type)}
            />
          ))}
          <SliderItem type="add" img="./assets/img/add.png" onClick={props.onShowNewBudget}/>
        </div>
      </div>  
    </section>
  );
}

export default Slider;
