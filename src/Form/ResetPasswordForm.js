import React, { useState } from 'react';
import axios from "axios";
import {useLocation} from "react-router-dom";

const ForgetPasswordForm = ({onResetSuccess}) => {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();

    // Extract the token from the URL
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('resetPasswordToken');

    const handleResetPassword = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        try {
            const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/reset-password', {
                password,
                token,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                onResetSuccess('Password updated with success, you can now log in.');
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    }

    return (
        <div className="w-96 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Reset your Password</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleResetPassword}>
                <div className="mb-4">
                    <label htmlFor="password" className="block font-semibold mb-1">New Password</label>
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
                <div className="flex justify-between items-center">
                    <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">Confirm</button>
                </div>
                <div className="flex justify-between items-center">
                    <button className="text-blue-500 font-semibold">Back to Login</button>
                </div>
            </form>
        </div>
    );
}

export default ForgetPasswordForm;