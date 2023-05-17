import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import BudgetContextProvider from './store/budget-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BudgetContextProvider>
        <App />
    </BudgetContextProvider>
);
