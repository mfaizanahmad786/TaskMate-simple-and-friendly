import React, { useState, useRef } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { authService } from '../../Apis/authService';

const Signup = () => {

  const [Email, setEmail] = useState('');
  const [name,setName] = useState('')
  const [Password, setPassword] = useState('');
  const [Confirmpass, setConfirmpass] = useState('');
  const [isConfirmPassTouched, setIsConfirmPassTouched] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [Option, setOption] = useState('employee');
  const emailInput = useRef();
  const passInput = useRef();
  const checkPass = useRef();
  const navigate = useNavigate();

  const togglePasswordstate = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }



  const handleSubmit = (e) => {
    e.preventDefault();
    if (!Email || !Password) {
      window.alert("Please Fill all Details");
      return;
    }
    setEmail('');
    setPassword('');
    setConfirmpass('');
    setName('')
    setIsConfirmPassTouched(false);
    emailInput.current.focus();
  }

  const checkPassword = () => {
    if (Password !== '') {
      return Password === Confirmpass;
    } else {
      return false;
    }
  }



  const handleSignup = async (e) => {
    e.preventDefault();
    if (!Email || !Password) {
      window.alert("Please Fill all Details");
      return;
    }
    if (!checkPassword()) {
      return;
    }

    try {
      const data = await authService.signup(name,Email, Password, Option);
      console.log(data)
      setEmail('');
      setPassword('');
      setConfirmpass('');
      setName('')
      setIsConfirmPassTouched(false);
      emailInput.current.focus();

      navigate('/',{replace:true})
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-900">
      <div className="w-96 p-8 bg-gray-800 rounded-2xl shadow-lg flex flex-col items-center">
        <h1 className="text-4xl text-white mb-6">Sign Up</h1>
        <form className="flex flex-col w-full" onSubmit={(e) => { handleSignup(e) }}>
          <label htmlFor="Email" className="text-white mb-2">Email</label>

          <input type="text" ref={emailInput} id="Email" className="bg-gray-700 text-white p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder='Enter Email' value={Email} onChange={(e) => { setEmail(e.target.value) }} />

          <label htmlFor="name" className="text-white mb-2">Name</label>

          <input type="text"  id="name" className="bg-gray-700 text-white p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder='Enter Name' value={name} onChange={(e) => { setName(e.target.value) }} />


          <label htmlFor="Password" className="text-white mb-2">Password</label>
          <div className='relative full'>
            <input type={isPasswordVisible ? "text" : "password"} id="Password" ref={passInput} className="bg-gray-700 text-white p-2 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full" placeholder='Enter Password' value={Password} onChange={(e) => { setPassword(e.target.value) }} />
            <FaEye
              className="absolute right-3 top-[20px] transform -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={togglePasswordstate}
            />
          </div>
          <label htmlFor="Confirm Password" className="text-white mb-2">Confirm Password</label>
          <div className='relative w-full'>
            <input type={isPasswordVisible ? "text" : "password"} id="Confirm Password" className="bg-gray-700 text-white p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full" placeholder='Confirm Password' value={Confirmpass} onChange={(e) => { setConfirmpass(e.target.value); setIsConfirmPassTouched(true) }} />
            <FaEye
              className="absolute right-3 top-[20px] transform -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={togglePasswordstate}
            />
          </div>

          {isConfirmPassTouched &&
            <div ref={checkPass} className={`mb-2 ${checkPassword() ? 'text-green-500' : 'text-red-500'}`}>{checkPassword() ? 'Password Matched' : 'Password Does not Match'}</div>
          }

          <label htmlFor="options" className="text-white mb-2">Select Designation</label>
          <select id="options" className='bg-gray-700 text-white p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer'
            value={Option} onChange={(e) => setOption(e.target.value)}>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md text-lg font-semibold transition">Sign Up</button>

        </form>

        <p className='text-white mt-4'>Already a Member? <Link className='text-blue-400 mt-4' to='/'>  Log in</Link></p>
      </div>
    </div>
  );
}

export default Signup