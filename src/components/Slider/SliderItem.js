import classes from './SliderItem.module.css'

function SliderItem(props) {
  return (
    <div className={classes.item} onClick={props.onClick}>
      <div className={classes['item-img']}>
        <img src={props.img ? props.img : './assets/img/unavailable.png'} alt="" style={{width:"100%"}}/>
      </div>
      <h4 className={classes['item-heading']}>{props.type}</h4>
    </div>
  );
}

export default SliderItem;
