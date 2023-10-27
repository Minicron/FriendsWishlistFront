import React, { useState } from 'react';
import axios from 'axios';

const InviteUserForm = ({ wishlistId, onClose }) => {

    const [invitationMail, setInvitationMail] = useState('');
    const [existingUserMail, setExistingUserMail] = useState('');
    const [error, setError] = useState('');
    const [error2, setError2] = useState('');

    const handleInviteSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                process.env.REACT_APP_BACKEND_URL + `/wishlist/invite/${wishlistId}`,
                { invitationMail },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "x-access-token" : localStorage.getItem('token'),
                    },
                }
            );
            if (response.status === 200) {
                onClose();
            } else if (response.status === 404) {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const handleAddExistingUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                process.env.REACT_APP_BACKEND_URL + `/wishlist/${wishlistId}/addUser`,
                { email: existingUserMail },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "x-access-token" : localStorage.getItem('token'),
                    },
                }
            );
            if (response.status === 200) {
                onClose();
            } else if (response.status === 404) {
                setError2("User not found");
            }
        } catch (error) {
            setError2(error.response.data.message);
        }
    };

    return (
        <div className="md:w-4/12 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Send an invitation to a new user</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {/* Formulaire pour inviter un nouvel utilisateur */}
            <form onSubmit={handleInviteSubmit} className="space-y-4">
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
                        className="px-4 py-2 mr-2 text-white border rounded-md shadow-md hover:bg-red-600 bg-red-500  focus:outline-none"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="w-2/4 md:w-auto px-4 py-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-600 focus:outline-none"
                    >
                        Send Invitation
                    </button>
                </div>
            </form>
            <hr className="my-4" />
            <h2 className="text-xl font-semibold mb-4">Search for an existing user by email</h2>
            {error2 && <p className="text-red-500 mb-2">{error2}</p>}
            {/* Formulaire pour ajouter un utilisateur existant */}
            <form onSubmit={handleAddExistingUser} className="space-y-4">
                <div>
                    <label htmlFor="existingUser" className="block text-sm font-medium text-gray-700">
                        User email
                    </label>
                    <input
                        type="text"
                        id="existingUser"
                        value={existingUserMail}
                        onChange={(e) => setExistingUserMail(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="px-4 py-2 mr-2 text-white border rounded-md shadow-md hover:bg-red-600 bg-red-500  focus:outline-none"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="w-2/4 md:w-auto px-4 py-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-600 focus:outline-none"
                    >
                        Add User
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InviteUserForm;
