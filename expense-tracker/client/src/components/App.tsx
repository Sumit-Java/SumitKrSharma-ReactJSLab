import { Routes, Route } from 'react-router-dom';
import ExpenseTracker from './ExpenseTracker';
import AddExpenseForm from './AddExpenseForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/add' element={<AddExpenseForm />}></Route>
        <Route path='/' element={<ExpenseTracker />}></Route>
      </Routes>
    </div>
  );
}

export default App;
