import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditItemForm = ({ wishlistId, item, onItemUpdated, onClose }) => {
    const [name, setName] = useState(item ? item.itemName : '');
    const [description, setDescription] = useState(item ? item.description : '');
    const [url, setUrl] = useState(item ? item.url : '');
    const [error, setError] = useState('');

    useEffect(() => {
        if (item) {
            setName(item.itemName);
            setDescription(item.description);
            setUrl(item.url);
        }
    }, [item]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/wishlist/${wishlistId}/item/${item.id}`,
                { name, description, url },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "x-access-token": localStorage.getItem('token'),
                    },
                }
            );

            onItemUpdated();
        } catch (error) {
            console.error('Error updating item:', error);
            setError('Erreur lors de la mise à jour de l\'item');
        }
    };


    return (
        <div className="w-9/12 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Edit your item</h2>
            <p><b>Modifications may confuse your friends ! Use this form carefully !</b></p>
            <br/>
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
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                        URL
                    </label>
                    <input
                        type="text"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 mr-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                    >
                        Save
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

export default EditItemForm;