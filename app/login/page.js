"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Link from 'next/link';
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../register/Register.css'

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const newError = {};

    if (!email.trim()) newError.email = 'Email is required';
    else if (!emailRegex.test(email)) newError.email = 'Email is invalid';
    if (password.length < 6) newError.password = 'Password must be at least 6 characters';

    setErrors(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if(user){
        alert('Login Successful');
        router.push('/');
      }
      setErrors({});
    } 
    catch (error) {
      console.log(error);
      setErrors({ general: 'An error occurred during Login' });
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <div className='form-container'>
      <form onSubmit={handleSubmit} className='form'>
        <h1 className='form-title'>Login Account</h1>

        <div className='input-field'>
          <input
            type="email"
            placeholder='Email'
            className='input'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className='error-msg'>{errors.email}</span>}
        </div>

        <div className='input-field'>
          <input
            type="password"
            placeholder='Password'
            className='input'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className='error-msg'>{errors.password}</span>}
        </div>

        <div>
          <button type='submit' className='submit-btn' >
            {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Login'}
          </button>
          {errors.general && <p className='general-error'>{errors.general}</p>}
          <span className='login-link'>
            Don't have an Account <Link href='/register'> Signup </Link>
          </span>
        </div>

      </form>
    </div>

  );
};

export default Page;
