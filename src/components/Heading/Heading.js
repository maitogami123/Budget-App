import { useContext, useEffect, useState } from 'react';
import { BudgetContext } from '../../store/budget-context';
import classes from './Heading.module.css'

function Heading() {
  const [totalBudget, setTotalBudget] = useState(0)
  const budgetCtx = useContext(BudgetContext)
  
  useEffect(() => {
    let total = 0
    budgetCtx.costList.forEach(costItem => {
      total -= costItem.total
    })
    budgetCtx.incomeList.forEach(incomeItem => {
      total += incomeItem.total
    })
    setTotalBudget(total)
  },
  [budgetCtx])

  return <header className={classes['header-wrapper']}>
    <h1>Total Budget</h1>
    <p className={classes.totalBudget}>$ {totalBudget}</p>
  </header>;
}

export default Heading; 
