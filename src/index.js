import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Product from './Containers/Product'
import Redeem from './Containers/Redeem'
import Profile from './Containers/Profile'
import Couponinfo from './Containers/CouponInfo'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PaymentErrorHandler from './Components/PaymentErrorHandler';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
     <Route path="/" element={<App />}/>
     <Route path="/product/:id" element={<Product />}/>
     <Route path="/product" element={<Product />}/>
     <Route path="/redeem" element={<Redeem />}/>
     <Route path="/coupons" element={<Profile />}/>
     <Route path="/couponinfo" element={<Couponinfo />}/>
     <Route path="/handlePayment" element={<PaymentErrorHandler />}/>

    </Routes>
    </BrowserRouter>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
