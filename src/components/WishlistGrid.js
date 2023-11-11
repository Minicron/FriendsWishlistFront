// components/WishlistGrid.js
import React, { useState, useEffect } from 'react';
import WishlistForm from './WishlistForm';
import Loader from './Loader';
import axios from "axios"; // Ajoute l'import du composant WishlistForm
import { BsPeople, BsFillGridFill, BsBrush } from 'react-icons/bs'; // Importez les icônes nécessaires
import { GiPresent } from 'react-icons/gi';

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

    if (!wishlists) {
        return <Loader />;
    }

    return (
        <div>
            <div className="flex p-8 justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">My Wishlists</h2>
                <button className="px-4 py-2 text-sm text-white bg-gray-800 rounded-md shadow-md hover:bg-gray-600" onClick={onDisplayWishlistForm}>
                    New Wishlist
                </button>
            </div>
            <div className="grid p-8 md:grid-cols-3 gap-4 grid-cols-1 overflow-y-auto max-h-[75vh]">
                {wishlists.map((wishlist) => (
                    <div
                        key={wishlist.id}
                        className="bg-white p-4 shadow-md rounded-md cursor-pointer hover:shadow-lg hover:bg-gray-100 flex flex-col justify-between"
                        onClick={() => onWishlistClick(wishlist.id)}
                        style={{ minHeight: '170px', maxWidth: '100%' }}
                    >
                        <div>
                            <h3 className="text-lg font-semibold">{wishlist.name}</h3>
                            <p className="truncate">{wishlist.description}</p>
                        </div>
                        <div className="grid grid-cols-3 divide-x divide-gray-200 text-center pt-4">
                            <div className="flex items-center justify-center">
                                <BsPeople className="text-xl" /> {/* Changez la classe ici */}
                                <span className="ml-1">{wishlist.userCount}</span>
                            </div>
                            <div className="flex items-center justify-center">
                                <GiPresent className="text-xl" /> {/* Changez la classe ici */}
                                <span className="ml-1">{wishlist.itemCount}</span>
                            </div>
                            <div className="flex items-center justify-center">
                                {wishlist.User.username}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showCreateForm && <WishlistForm onHideWishlistForm={handleHideWishlistForm} />}
            {wishlists.length === 0 && (
                <p className="text-center">You don't have any wishlists yet.</p>
            )}
        </div>
    );
};

export default WishlistGrid;
