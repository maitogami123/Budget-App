import classes from './SliderNavigation.module.css'

function SliderNavigation(props) {
  return (
    <div className={classes.heading}>
      <h1 className={classes.header}>Category</h1>
      <button
        className={classes["slider__btn-left"]}
        onClick={() => props.onClick(100)}
        disabled={props.sliderPos.transition >= 0}
      >
        Previous
      </button>
      <button
        className={classes["slider__btn-right"]}
        onClick={() => props.onClick(-100)}
        disabled={props.sliderPos.transition <= props.sliderPos.transitionLimit}
      >
        Next
      </button>
    </div>
  );
}

export default SliderNavigation;
