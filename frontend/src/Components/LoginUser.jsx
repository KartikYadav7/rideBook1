import React from 'react'
import Button from './Button'
import { Link } from 'react-router-dom'
const LoginUser = () => {
  return (
    <>

      <section className="px-6 bg-[#e9f5ff] text-center py-12">
        <p className="text-primary text-4xl font-bold mb-4">Provide Your Services</p>
        <p className="text-[#333] text-lg mb-8">Sign in to start earning money by providing rides and services.</p>
        <form className="max-w-md mx-auto">
          <div className="mb-6 text-left">
            <label className="block mb-2 text-primary font-medium">Email</label>
            <input type="email"
              placeholder='Enter your email'
              className="w-full p-3 border-none outline-none rounded text-[#333] bg-white" />
          </div>
          <div className="mb-8 text-left">
            <label className="block mb-2 text-primary font-medium">Password</label>
            <input type="password"
              placeholder='Enter your password'
              className="w-full p-3 border-none outline-none rounded text-[#333] bg-white" />
          </div>
          <Button text="Login" className={`w-full`} />
         <p className='text-xl my-3'>Don't have an account? <span className='text-primary hover:underline'><Link href="/">Sign up here</Link></span></p>
        </form>
      </section>
    </>
  )
}

export default LoginUser
