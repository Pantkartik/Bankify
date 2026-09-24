import React, { useState, useEffect } from 'react';
import { FaPiggyBank, FaChevronRight } from 'react-icons/fa';
import InputComponent from '../components/inputComponent';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/spinner';
import { openSpinner, showSpinner,closeSpinner } from '../features/page/pageSlice';
import { fetchUserStatus, authenticateUser, resetStatus } from '../features/user/userSlice';

function Login() {
  const [user, setUser] = useState({
    username: "",
    password: ""
  });

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const status = useSelector(fetchUserStatus)
  const enablespinner =useSelector(showSpinner)

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  
  const enableButton = user.username.length > 0 && user.password.length > 0;
  
  const login = () => {
   dispatch(openSpinner())
   dispatch(authenticateUser(user))
  };
  
  const disablestyle = !enableButton ? "bg-blue-300 hover:bg-blue-300" : "hover:bg-opacity-90 bg-blue-500";
    useEffect(() => {
    if (status === 'SUCCESS') {
      setTimeout(() => {
        dispatch(closeSpinner())
        navigate('/dashboard')
        dispatch(resetStatus())
      }, 3000)
    } else if (status === 'FAILED') {
      setTimeout(() => {
        dispatch(resetStatus())
        dispatch(closeSpinner())
      }, 3000)
    }
  }, [dispatch, status, navigate])

  return (
    <main className='font-roboto flex flex-col w-screen sm:w-full lg:w-screen 
    md:w-screen h-screen justify-center items-center bg-gradient-to-r
    from-gray-300 to-white-500 relative'>
      {enablespinner && <Spinner/>}
      <section className='flex flex-col justify-center p-2 w-full
      gap-8 items-center sm:w-3/5 xl:w-2/5 sm:p-6'>
        <h1 className='text-xl font-bold flex flex-col items-center'>
          <FaPiggyBank size={40}/> 
          Bankify
        </h1>
        <form className='flex flex-col gap-4 bg-white p-5 rounded-md 
        sm:min-w-[500px] flex-1 w-full'>
          <h2 className='text-lg text-black'>Login in to your account</h2>
          <InputComponent inputProp={{ 
            name: "username", 
            type: "email", 
            label: "Email", 
            value: user.username,
            placeholder: "Enter Your Email", 
            onChange: handleInputChange 
          }}/>
          <InputComponent inputProp={{ 
            name: "password", 
            type: "password", 
            label: "Password", 
            value: user.password,
            placeholder: "Enter Your Password", 
            onChange: handleInputChange 
          }}/>
          <a className='underline text-blue-500 flex items-center' href='/'>
            Forgot Password <FaChevronRight />
          </a>
          <button 
            disabled={!enableButton} 
            onClick={login} 
            type="button" 
            className={`${disablestyle} p-2 rounded-xl text-white font-bold mt-2 transition-all`}>
            LOGIN
          </button>
        </form>
        <p>Don't have an account? <Link to='/register' className='underline 
        text-blue-500 hover:text-blue-700' onClick={(e) => {
          e.preventDefault();
          navigate('/register');
        }}>Create One</Link></p>
      </section>
    </main>
  );
}

export default Login;