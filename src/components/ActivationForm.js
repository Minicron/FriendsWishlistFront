import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ActivationForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const location = useLocation();

    // Extract the token from the URL
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('activationToken');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/activate', {
                token,
                username,
                password
            });

            if (response.data.success) {
                setMessage('Your account has been successfully created and activated! You can now log in.');
            } else {
                setMessage('Activation failed. The token might be invalid or expired.');
            }
        } catch (error) {
            setMessage('There was an error activating and creating your account. Please try again later.');
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-gray-100 h-screen flex items-center justify-center">
            <div className="bg-white p-10 rounded-lg shadow-md w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-center">Account Activation</h2>
                <p className="mb-6 text-center">
                    Welcome! Please provide your desired username and password to finalize the activation of your account.
                </p>
                {message ? (
                    <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                        <strong className="font-bold">Success!</strong><br/>
                        <span className="block sm:inline"> Your account has been activated.</span><br/>
                        <button onClick={() => window.location.href='/'} className="mt-3 ml-3 w-11/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Go to Login</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Confirm Password:</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-blue-500 text-white rounded-md px-4 py-2">
                            {isLoading ? "Activating..." : "Activate"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ActivationForm;
