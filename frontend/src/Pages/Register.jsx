import React, { useEffect, useState } from 'react'
import { FaPiggyBank, FaChevronRight } from 'react-icons/fa';
import InputComponent from '../components/inputComponent';
import validateUser from '../helper/validateUser';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserStatus, registerUser, resetStatus } from '../features/user/userSlice';
import Spinner from '../components/spinner';
import { openSpinner, showSpinner,closeSpinner } from '../features/page/pageSlice';
import { useNavigate, Link } from 'react-router-dom';

function Register(){
  const dispatch = useDispatch()
  const status = useSelector (fetchUserStatus)
  const enableSpinner = useSelector(showSpinner)
  const navigate = useNavigate()
  const [user, setUser] = useState(
    {
      firstname: '',
      lastname: '',
      email: '',
      username: '', 
      tel: '',
      password: '',
      confirmPassword: '',
      gender: '',
      dob: ''
    }
  )
  const [errors, setErrors] = useState({status: false})

   const signUp = async (e) => {
    e.preventDefault()
    console.log('Form submitted with user data:', user)
    const registrationErrors = validateUser(user)
    console.log('Validation errors:', registrationErrors)
    
    if(registrationErrors.hasErrors) {
      console.log('Form has validation errors, not submitting')
      setErrors(registrationErrors.errors)
      return
    }
    console.log('No validation errors, proceeding with registration')
    dispatch(openSpinner())
    dispatch(registerUser(user)) // Dispatch action to register user in the Redux store
  }

  const handleInputChange = (e) => {
    console.log('Input changed:', e.target.name, '=', e.target.value)
    const newUser = {...user, [e.target.name]: e.target.value }
    console.log('New user state:', newUser)
    setUser(newUser)
  }
  const errorStyle = (fieldname) => errors[fieldname] ? 'text-red-500' : ''
  const disabledStyle = validateUser(user).hasErrors ? 'bg-blue-300 hover:bg-blue-300' : 'hover:bg-opacity-90 bg-blue-500'
  
  useEffect(() => {
    if (status === 'SUCCESS') {
      setTimeout(() => {
        dispatch(closeSpinner());
        dispatch(resetStatus())
        navigate('/successful');
      }, 3000)
    } else if (status === 'FAILED') {
      setTimeout(() => {
        dispatch(closeSpinner());
        dispatch(resetStatus())
      }, 3000);
    }
  }, [status, dispatch, navigate]);

  return (
    <main className="font-roboto flex flex-col w-full min-h-screen 
    justify-center items-center bg-gradient-to-r from-gray-300 
    to-white-500 pb-8 relative">
      {enableSpinner && <Spinner />}
      <section className='flex flex-col justify-center p-2 w-full
      gap-8 items-center sm:w-3/5 xl:w-2/5 sm:p-6'>
          <h1 className='text-xl font-bold flex flex-col items-center'>
            <FaPiggyBank size={40}/>
            Bankify</h1>
         <form className='flex flex-col gap-4 bg-white p-5 rounded-md 
        sm:min-w-[500px] flex-1 w-full' onSubmit={signUp}>
              <h2 className='md font-bold'>Create your account</h2>
              <div className='flex flex-col sm:flex-row gap-1 flex-1 w-full sm:gap-6'>
                <InputComponent inputProp={{ name: "firstname", type: "text", label: "Provide Firstname", 
                    field: "firstname", placeholder: "Jhon", value: user.firstname, onChange: handleInputChange }}/>
                <InputComponent inputProp={{ name: "lastname", type: "text", label: "Provide Lastname", 
                    field: "lastname", placeholder: "Perera", value: user.lastname, onChange: handleInputChange }}/>
              </div>
              <InputComponent inputProp={{ name: "username", type: "email", label: "Provide Email", 
                field: "username", placeholder: "JhonPerera123@gmail.com", value: user.username, onChange: handleInputChange }}/>
              <InputComponent inputProp={{ name: "tel", type: "number", label: "Provide Tel", 
                field: "tel", placeholder: "+94259874135", value: user.tel, onChange: handleInputChange }}/>
              <div className='flex flex-col gap-1 flex-1 w-full mt-2'>
                <label htmlFor='gender'>Gender <span className={errorStyle('gender')}>*</span></label>
                <select value={user.gender} name='gender' onChange={handleInputChange} id='gender' className='flex w-full border border-blue-500 p-3 rounded-md focus:border-yellow-400 leading-none' required>
                    <option value="">Select Your Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
              </div>
              <InputComponent inputProp={{ name: "dob", type: "date", label: "Provide Date of birth", 
                field: "dob", value: user.dob, onChange: handleInputChange }}/>
              <div className='flex flex-col sm:flex-row gap-1 flex-1 w-full sm:gap-6'>
                <InputComponent inputProp={{ name: "password", type: "password", label: "Password", 
                    field: "password", placeholder: "Enter Your Password", value: user.password, onChange: handleInputChange }}/>
                <InputComponent inputProp={{ name: "confirmPassword", type: "password", label: "Confirm Password", 
                    field: "confirmPassword", placeholder: "Confirm Your Password", value: user.confirmPassword, onChange: handleInputChange }}/>
              </div>
              <button type="submit" disabled={validateUser(user).hasErrors} className={`${disabledStyle} 
              p-2 rounded-xl text-white font-bold mt-2 transition-all`}>SIGN UP</button>
          </form>
          <p>Have an account? <Link to='/login' className='underline text-blue-500 hover:text-blue-700'>Login</Link></p>
      </section>
    </main>
  )
}

export default Register