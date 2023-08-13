// components/WishlistForm.js
import React, { useState, useEffect } from 'react';
import axios from "axios";

const WishlistForm = ({ onHideWishlistForm }) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [userId, setUserId] = useState(null);

    // Utilise useEffect pour effectuer une requête à l'API lors du rendu initial du composant
    useEffect(() => {
        // Fonction pour obtenir les informations de l'utilisateur connecté
        const fetchUserData = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/user/me', {
                    headers: {
                        "x-access-token": localStorage.getItem('token'),
                    },
                });
                // Stocke l'id de l'utilisateur dans l'état userId
                setUserId(response.data.id);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData(); // Appelle la fonction pour obtenir les informations de l'utilisateur
    }, []);

    const handleSubmit = (e) => {

        e.preventDefault();

        // Crée une nouvelle wishlist en utilisant les valeurs actuelles du formulaire
        const newWishlist = {
            title,
            description,
            userId,
        };

        try {
            // Envoie une requête POST au backend pour créer une nouvelle wishlist
            const response = axios.post(process.env.REACT_APP_BACKEND_URL + '/wishlist', newWishlist, {
                headers: {
                    "x-access-token" : localStorage.getItem('token'),
                },
            });
            onHideWishlistForm();

        } catch (error) {
            console.error('Error creating wishlist:', error);
        }
    };

    const cancel = () => {
        onHideWishlistForm();
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div  className="w-9/12 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Créer une nouvelle wishlist</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Titre
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            required
                        />
                    </div>
                    <button
                        className="px-4 w-2/12 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                        onClick={cancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 w-2/12 float-right py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                    >
                        Créer
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WishlistForm;
