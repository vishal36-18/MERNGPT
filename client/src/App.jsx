import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Display from './Display.jsx';
import Register from './Register.jsx';
import Signin from './Signin.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/home" element={
          <ProtectedRoute>
            <Display />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Register/>}></Route>
        <Route path="/signin" element={<Signin/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}
