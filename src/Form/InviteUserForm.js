import React, { useState } from 'react';
import axios from 'axios';

const InviteUserForm = ({ wishlistId, onClose }) => {

    const [invitationMail, setInvitationMail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            const response = await axios.post(
                `http://localhost:5000/wishlist/invite/${wishlistId}`,
                { invitationMail },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "x-access-token" : localStorage.getItem('token'),
                    },
                }
            );
            if (response.status === 200) {
                // Everything went well
                onClose();
            } else if (response.status === 404) {
                // userInvitation already exists
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <div className="w-9/12 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Send an invitation</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        User email
                    </label>
                    <input
                        type="text"
                        id="email"
                        value={invitationMail}
                        onChange={(e) => setInvitationMail(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="px-4 py-2 mr-2 text-gray-600 border rounded-md shadow-md hover:bg-gray-100 focus:outline-none"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InviteUserForm;
