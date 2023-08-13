import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = ({ onLoginLinkClick }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        try {
            const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/signup', {
                username,
                password,
                email
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                setError('Account created successfully! You can now log in.');
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <div className="w-96 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSignup}>
                <div className="mb-4">
                    <label htmlFor="username" className="block font-semibold mb-1">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="w-full p-2 border rounded-md"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block font-semibold mb-1">Email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        className="w-full p-2 border rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block font-semibold mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="w-full p-2 border rounded-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block font-semibold mb-1">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="w-full p-2 border rounded-md"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">Sign Up</button>
            </form>
            <p className="mt-4">
                Already have an account?{' '}
                <button className="text-blue-500 font-semibold" onClick={onLoginLinkClick}>
                    Log In
                </button>
            </p>
        </div>
    );
};

export default SignupForm;
