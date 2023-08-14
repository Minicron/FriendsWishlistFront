// components/WishlistGrid.js
import React, { useState, useEffect } from 'react';
import WishlistForm from './WishlistForm';
import axios from "axios"; // Ajoute l'import du composant WishlistForm

const WishlistGrid = ({ onWishlistClick, onDisplayWishlistForm }) => {

    // État pour afficher/masquer le formulaire de création de wishlist
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [hasWishlist, setHasWishlists] = useState(false);
    const [wishlists, setWishlists] = useState(null);

    // Utilise useEffect pour effectuer une requête à l'API lors du rendu initial du composant
    useEffect(() => {

        fetchUserWishlist();
    }, []);

    const fetchUserWishlist = async () => {

        try {
            const response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/user/wishlist', {
                headers: {
                    "x-access-token": localStorage.getItem('token'),
                },
            });

            if (response.status === 200) {

                // Stocke l'id de l'utilisateur dans l'état userId
                setWishlists(response.data);
                setHasWishlists(true);

            } else if (response.status === 404) {
                console.log('No wishlist found for this user.');
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Fonction pour masquer le formulaire de création de wishlist
    const handleHideWishlistForm = () => {
        setShowCreateForm(false);
        fetchUserWishlist();
    };

    return (
        <div>
            {/* Ajoute une "row" avant la grid */}
            <div className="flex p-8 justify-between items-center mb-4">
                {/* Dans cette row, aligné à gauche, un sous-titre */}
                <h2 className="text-lg font-semibold">My Wishlists</h2>
                {/* Dans cette row, aligné à droite, un bouton pour créer une nouvelle wishlist */}
                <button className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600" onClick={onDisplayWishlistForm}>
                    Create New Wishlist
                </button>
            </div>
            {hasWishlist ? (
                <div className="grid p-8 grid-cols-3 gap-4">
                    {wishlists.map((wishlist) => (
                        <div
                            key={wishlist.id}
                            className="bg-white p-4 shadow-md rounded-md cursor-pointer h-40 hover:shadow-md hover:bg-gray-100"
                            onClick={() => onWishlistClick(wishlist.id)}
                        >
                            <h3 className="text-lg font-semibold">{wishlist.name}</h3>
                            <p>{wishlist.description}</p>
                            <p className="text-l">Wishlist created by {wishlist.User.username}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">You don't have any wishlists yet.</p>
            )}

            {/* Affiche le formulaire de création de wishlist lorsque showCreateForm est vrai */}
            {showCreateForm && <WishlistForm onHideWishlistForm={handleHideWishlistForm} />}
        </div>
    );
};

export default WishlistGrid;
