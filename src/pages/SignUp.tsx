import React from 'react'
import AuthForm from '../components/AuthForm'
import "../App.css";

const SignUp = () => {
  return (
    <div className='flex-center'><AuthForm mode='sign-up' /></div>
  )
}

export default SignUp