"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { AvatarGenerator } from 'random-avatar-generator';
import Link from 'next/link';
import { auth, firestore } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import './Register.css'

const Page = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const generateRandomAvatar = () => {
        const generator = new AvatarGenerator();
        return generator.generateRandomAvatar();
    };

    const handleRefreshAvatar = () => {
        setAvatarUrl(generateRandomAvatar());
    };

    useEffect(() => {
        setAvatarUrl(generateRandomAvatar());
    }, []);

    const validateForm = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const newError = {};
    
        if (!name.trim()) newError.name = 'Name is required';
        if (!email.trim()) newError.email = 'Email is required';
        else if (!emailRegex.test(email)) newError.email = 'Email is invalid';
        if (password.length < 6) newError.password = 'Password must be at least 6 characters';
        if (password !== confirmPassword) newError.confirmPassword = 'Passwords do not match!';
    
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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const docRef = doc(firestore, "users", user.uid);
            await setDoc(docRef, { name, email, avatarUrl });
            alert('Signup Successful');
            router.push('/login');
        } catch (error) {
            console.log(error);
            setErrors({ general: 'An error occurred during registration' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='form-container'>
        <form onSubmit={handleSubmit} className='form'>
            <h1 className='form-title'>Create Account</h1>
    
            <div className="avatar-section">
                <img src={avatarUrl} alt="avatar" className='avatar-image' />
                <button onClick={handleRefreshAvatar} type='button' className='avatar-btn'>New Avatar</button>
            </div>
    
            <div className='input-field'>
                <input
                    type="text"
                    placeholder='Name'
                    className='input'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <span className='error-msg'>{errors.name}</span>}
            </div>
    
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
    
            <div className='input-field'>
                <input
                    type="password"
                    placeholder='Confirm Password'
                    className='input'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <span className='error-msg'>{errors.confirmPassword}</span>}
            </div>
    
            <div>
                <button type='submit' className='submit-btn' >
                    {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Register'}
                </button>
    
                {errors.general && <p className='general-error'>{errors.general}</p>}
    
                <span className='login-link'> 
                    Already have an account? <Link href='/login'>Login</Link>
                </span>
            </div>
        </form>
    </div>
    
    );
};

export default Page;
