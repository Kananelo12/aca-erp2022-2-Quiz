import React from 'react'
import AuthForm from '../components/AuthForm'
import "../App.css";

const SignIn = () => {
  return (
    <div className='flex-center'><AuthForm mode='sign-in' /></div>
  )
}

export default SignIn