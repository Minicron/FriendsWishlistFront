import React, { useState } from 'react';
import axios from 'axios';

const AddItemForm = ({ wishlistId, onItemAdded, onClose }) => {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            const response = await axios.post(
                process.env.REACT_APP_BACKEND_URL + `/wishlist/${wishlistId}/item`,
                { name, description, url },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "x-access-token" : localStorage.getItem('token'),
                    },
                }
            );

            // Fermer le formulaire d'invitation
            onItemAdded();
        } catch (error) {
            console.error('Error inviting user:', error);
            setError('Erreur lors de l\'invitation de l\'utilisateur');
        }
    };

    return (
        <div className="md:w-9/12 w-11/12 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add a new item to your list</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Item Name*
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Item Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        URL
                    </label>
                    <textarea
                        id="description"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 mr-2 text-white bg-green-500 rounded-md shadow-md hover:bg-green-600 focus:outline-none"
                    >
                        Add
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 mr-2 text-white bg-red-500 rounded-md shadow-md hover:bg-red-600 focus:outline-none"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddItemForm;