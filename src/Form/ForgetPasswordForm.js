import React, { useState } from 'react';
import {useLocation} from "react-router-dom";

const ForgetPasswordForm = ({ onLoginLinkClick }) => {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');


    const handleForgetPassword = async (e) => {

        e.preventDefault();

        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/forget-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.status === 200) {
                const data = await response.json();
                setMessage(data.message);
            }

        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="w-96 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Forget Password</h2>
            <form onSubmit={handleForgetPassword}>
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
                <div className="flex justify-between items-center">
                    <button
                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
                        type="submit"
                    >
                        Send
                    </button>
                    <button
                        className="text-blue-500 font-semibold"
                        onClick={onLoginLinkClick}
                    >
                        Back to Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ForgetPasswordForm;