import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import EmployeeDashboard from './Components/EmployeeDashboard'
import AdminDashboard from './Components/AdminDashboard'
import Login from './Components/Login'
import Signup from './Components/Signup'
// import { ProtectedRoute } from './Utils/auth'
import { Navigate } from 'react-router-dom'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/employeeDashboard' element={
              <EmployeeDashboard/>}/>
          <Route path='/adminDashboard' element={<AdminDashboard/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App