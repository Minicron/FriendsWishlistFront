// LoginForm.js
import React, { useState } from 'react';

const LoginForm = ({ onSignupLinkClick, onLoginSuccess, onForgetPasswordLinkClick }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {

        e.preventDefault();
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
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

    return (
        <div className="w-80 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {/* Formulaire */}
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label htmlFor="username" className="block font-semibold mb-1">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="w-full p-2 border rounded-md"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block font-semibold mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="w-full p-2 border rounded-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <a href='#' className="text-blue-500 hover:underline float-right mb-4" onClick={onForgetPasswordLinkClick}>Forgot your password?</a>
                <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">Login</button>
            </form>
            <p className="text-red-500 mt-2">{message}</p>
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
