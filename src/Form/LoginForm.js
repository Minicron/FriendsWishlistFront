// LoginForm.js
import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = ({ onSignupLinkClick, onLoginSuccess, onForgetPasswordLinkClick }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);


    useEffect(() => {
        if (loginAttempts > 0 && message) {
            console.log(message)
            setIsShaking(true);
            const timer = setTimeout(() => setIsShaking(false), 500);
            return () => clearTimeout(timer);
        }
    }, [loginAttempts]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginAttempts(loginAttempts + 1);
        try {
            const trimmedEmail = email.trim(); // Retirer les espaces avant et après l'email
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: trimmedEmail, password }), // Utiliser l'email sans espaces
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message);
                onLoginSuccess(data.token, data.refreshToken, data.userLogin);
            } else {
                const data = await response.json();
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="w-80 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {/* Formulaire */}
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label htmlFor="email" className="block font-semibold mb-1">Email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        className="w-full p-2 border rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="relative mb-4">
                    <label htmlFor="password" className="block font-semibold mb-1">Password</label>
                    <div className="flex items-center border rounded-md">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            className="flex-1 p-2 focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                        <span
                            onClick={toggleShowPassword}
                            className="pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>
                <a href='#' className="text-blue-500 hover:underline float-right mb-4" onClick={onForgetPasswordLinkClick}>Forgot your password?</a>
                <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">Login</button>
            </form>
            <p key={loginAttempts} className={`text-red-500 mt-2 ${message ? 'shake' : ''}`}>
                {message}
            </p>
            <p className="mt-4">
                New user?{' '}
                <button className="text-blue-500 font-semibold" onClick={onSignupLinkClick}>
                    Sign Up
                </button>
            </p>
        </div>
    );
};

export default LoginForm;
