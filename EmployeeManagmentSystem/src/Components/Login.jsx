import React, { useRef, useState } from 'react';
import { Link, replace, useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { authService } from '../../Apis/authService';


const Login = () => {

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const emailInput = useRef();
  const passInput = useRef();
  const navigate = useNavigate();

  const togglePasswordstate = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!Email || !Password) {
      window.alert("Please Fill all Details");
      return;
    }

    try{
      const response = await authService.login(Email,Password)

      if(response.role === 'employee'){
        navigate('/employeeDashboard',{replace:true});
      }else if(response.role === 'manager'){
        navigate('/adminDashboard',{replace:true})
      }

    }catch(e){
      console.log(e)
    }
    setEmail('');
    setPassword('');
    emailInput.current.focus();
  }



  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-900">
      <div className="w-96 p-8 bg-gray-800 rounded-2xl shadow-lg flex flex-col items-center">
        <h1 className="text-4xl text-white mb-6">Login</h1>
        <form className="flex flex-col w-full" onSubmit={(e) => { handleLogin(e) }}>
          <label htmlFor="Email" className="text-white mb-2">Email</label>
          <input type="text" ref={emailInput} id="Email" className="bg-gray-700 text-white p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder='Enter Email' value={Email} onChange={(e) => { setEmail(e.target.value) }} />

          <label htmlFor="Password" className="text-white mb-2">Password</label>
          <div className="relative w-full">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              id="Password"
              ref={passInput}
              className="bg-gray-700 text-white p-2 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full pr-10"
              placeholder="Enter Password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaEye
              className="absolute right-3 top-[20px] transform -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={togglePasswordstate}
            />
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md text-lg font-semibold transition">Login</button>
        </form>

        <p className='text-white mt-4'>Not a Member?<Link className='text-blue-400 mt-4' to="/signup">  Sign Up</Link></p>
      </div>
    </div>
  );
};

export default Login;
