
import React from 'react';
import AppRouter from './routers/AppRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App: React.FC = () => {
  return (
    <div>
      <AppRouter /> 
      <ToastContainer />
    </div>
  );
};

export default App;
