import { useState } from "react";

import NewBudget from "../BudgetModal/NewBudget";
import Heading from "../Heading/Heading";
import Slider from "../Slider/Slider";
import Wrapper from "../UI/Wrapper";
import BudgetList from '../Budget/BudgetList'

function HomePage() {
  const [newBudgetIsShow, setNewBudgetIsShow] = useState(false);
  
  const showNewBudgetHandler = () => {
    setNewBudgetIsShow(true);
  }

  const hideNewBudgetHandler = () => {
    setNewBudgetIsShow(false)
  }

  return ( 
    <Wrapper>
      {newBudgetIsShow && (
        <NewBudget onClose={hideNewBudgetHandler}/>
      )}
      <Heading />
      <Slider
        onShowNewBudget={showNewBudgetHandler}
      />
      <BudgetList />
    </Wrapper>
   );
}

export default HomePage;