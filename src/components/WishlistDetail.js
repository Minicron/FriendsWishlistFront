import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InviteUserForm from '../Form/InviteUserForm';
import AddItemForm from '../Form/AddItemForm';
import { BsFillCartCheckFill, BsFillCartFill, BsCartX, BsPencil } from 'react-icons/bs';
import Masonry from 'react-masonry-css';
import EditItemForm from "../Form/EditItemForm";

const WishlistDetail = ({ wishlist, onBackClick }) => {

    const [items, setItems] = useState([]);
    const [affectedUsers, setAffectedUsers] = useState([]);
    const [showInviteUserForm, setShowInviteUserForm] = useState(false);
    const [showAddItemForm, setShowAddItemForm] = useState(false);
    const [showEditItemForm, setShowEditItemForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [showAddUserForm, setAddUserUserForm] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const breakpointColumnsObj = {
        default: 3,  // 3 colonnes par défaut
        1100: 3,
        700: 2,
        500: 1
    };


    useEffect(() => {
        fetchAffectedUsers();
        fetchWishlistItems();
        fetchLoggedInUser();

    }, [wishlist.id]);

    const handleInviteUser = () => {
        setShowInviteUserForm(true);
    };

    const fetchLoggedInUser = async () => {
        try {
            const response = await axios.get(
                process.env.REACT_APP_BACKEND_URL + '/user/me',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "x-access-token" : localStorage.getItem('token'),
                    },
                });
            setLoggedInUser(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur connecté :', error);
        }
    };

    const fetchAffectedUsers = async () => {
        try {
            const response = await axios.get(
                process.env.REACT_APP_BACKEND_URL + `/wishlist/${wishlist.id}/users`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "x-access-token" : localStorage.getItem('token'),
                    },
                });
            setAffectedUsers(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs de la wishlist :', error);
        }
    };

    const fetchWishlistItems = async () => {
        try {
            const response = await axios.get(
                process.env.REACT_APP_BACKEND_URL + `/wishlist/${wishlist.id}/items`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "x-access-token" : localStorage.getItem('token'),
                    },
                });
            setItems(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des items de la wishlist :', error);
        }
    }

    const handleReserveItem = async (itemId) => {
        try {
            const response = await axios.post(
                process.env.REACT_APP_BACKEND_URL + `/reservation`,
                {
                    item_id: itemId,
                    reservingUser_id: loggedInUser.id,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "x-access-token": localStorage.getItem('token'),
                    },
                });

            // Mise à jour des items pour refléter la réservation
            fetchWishlistItems();
        } catch (error) {
            console.error('Erreur lors de la réservation de l\'item:', error);
        }
    };

    const handleCancelReserveItem = async (itemId) => {
        try {
            const response = await axios.delete(
                process.env.REACT_APP_BACKEND_URL + `/reservation/${itemId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "x-access-token": localStorage.getItem('token'),
                    },
                });

            // Mise à jour des items pour refléter la réservation
            fetchWishlistItems();
        } catch (error) {
            console.error('Erreur lors de la réservation de l\'item:', error);
        }
    };

    const handleCloseWishlist = async () => {

        const confirmed = window.confirm("Once closed, the wishlist won't be visible anymore. Are you sure you want to close it?");

        if (confirmed) {
            try {
                const response = await axios.put(
                    process.env.REACT_APP_BACKEND_URL + `/wishlist/${wishlist.id}/close`,
                    {},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            "x-access-token": localStorage.getItem('token'),
                        },
                    });
                // Mise à jour de l'état de la wishlist pour indiquer qu'elle est clôturée
                onBackClick();
            } catch (error) {
                console.error('Erreur lors de la clôture de la wishlist :', error);
            }
        }
    };

    const handleAddItem = async () => {
        setShowAddItemForm(true);
    };

    const handleEditItemClick = (item) => {
        setEditingItem(item);
        setShowEditItemForm(true);
    };

    const handleHideEditItemForm = () => {
        setShowEditItemForm(false);
        setEditingItem(null);
        fetchWishlistItems();
    };

    const handleHideAddItemForm = () => {
        setShowAddItemForm(false);
        fetchWishlistItems();
    }

    const handleHideInviteUserForm = () => {
        setShowInviteUserForm(false);
        fetchAffectedUsers(); // Appelle fetchAffectedUsers pour rafraîchir la liste des utilisateurs
    };

    return (
        <div>
            <div className="flex justify-between mb-4 p-8">
                <div>
                    <h2 className="text-xl font-semibold">{wishlist.name}</h2>
                    <p>{wishlist.description}</p>
                </div>
                {wishlist.User.username && (
                    <div className="space-x-2">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                            onClick={onBackClick}
                        >
                            Back to my wishlists
                        </button>
                        {loggedInUser!= null && wishlist.User.id === loggedInUser.id && !wishlist.isClosed && (
                            <>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                                    onClick={handleInviteUser}
                                >
                                    Send an invitation
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none"
                                    onClick={handleCloseWishlist}
                                >
                                    Close this wishlist
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
            {showInviteUserForm ? (
                <div className="flex justify-center items-center mt-8">
                    <InviteUserForm wishlistId={wishlist.id} onClose={handleHideInviteUserForm} />
                </div>
            ) : showAddItemForm ? (
                <div className="flex justify-center items-center mt-8">
                    <AddItemForm wishlistId={wishlist.id} onItemAdded={handleHideAddItemForm} onClose={handleHideAddItemForm} />
                </div>
            ) : showEditItemForm ? (
                <div className="flex justify-center items-center mt-8">
                    <EditItemForm wishlistId={wishlist.id} item={editingItem} onItemUpdated={handleHideEditItemForm} onClose={handleHideEditItemForm} />
                </div>
            ) : (
                <div className="gap-4 p-4">
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="masonry-grid"
                        columnClassName="masonry-grid_column"
                    >
                        {affectedUsers.map((user) => (
                            <div key={user.id} className="bg-white border border-gray-300 p-4 rounded-md shadow-md min-h-fit tuile" >
                                {loggedInUser!= null && loggedInUser.id === user.id ? (
                                    <h3 className="text-lg font-semibold">{user.username} (you) </h3>
                                ) : (
                                    <h3 className="text-lg font-semibold">{user.username}</h3>
                                )}
                                <ul>
                                    {items
                                        .filter((item) => item.userId === user.id)
                                        .map((item) => (
                                            <li className="bg-white mt-3 border border-gray-300 p-4 rounded-md hover:bg-gray-100 hover:shadow-md flex justify-between items-center" key={item.id}>
                                                <div className="flex flex-col justify-start">
                                                    <div>
                                                        <p className="font-bold">{item.itemName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="TileSub">{item.description}</p>
                                                    </div>
                                                    {item.url && (
                                                        <div className="truncate w-full max-w-xs">
                                                            <a
                                                                href={item.url}
                                                                title={item.url}
                                                                className="TileSub mt-3 italic truncate"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                {item.url}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center">
                                                    {!item.reserved && loggedInUser != null && loggedInUser.id !== user.id ? (
                                                        <button
                                                            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                                                            onClick={() => handleReserveItem(item.id)}
                                                        >
                                                            <BsFillCartFill />
                                                        </button>
                                                    ) : item.reserved && loggedInUser != null && loggedInUser.id !== user.id ? (
                                                        <div className="flex items-center">
                                                            <BsFillCartCheckFill className="text-green-500" />
                                                            {item.Reservations[0].User.id === loggedInUser.id ? (
                                                                <>
                                                                    <p className="text-sm text-gray-500 ml-2">You reserved this</p>
                                                                    <button
                                                                        className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none"
                                                                        onClick={() => handleCancelReserveItem(item.id)}
                                                                    >
                                                                        <BsCartX className="text-white-500" />
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <p className="text-sm text-gray-500 ml-2">Reserved by {item.Reservations[0].User.username}</p>
                                                            )}
                                                        </div>
                                                    ) : null}
                                                    {loggedInUser.id === item.userId && (
                                                        <button onClick={() => handleEditItemClick(item)} className="l-2 px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none">
                                                            <BsPencil />
                                                        </button>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                </ul>

                                {loggedInUser!= null && loggedInUser.id === user.id && (
                                    <button className="px-4 mt-3 py-2 bg-emerald-400 text-white rounded-md shadow-md hover:bg-emerald-600 min-w-full focus:outline-none" onClick={handleAddItem} > + </button>
                                )}
                            </div>
                        ))}
                    </Masonry>
                </div>
            )}
        </div>
    );
};

export default WishlistDetail;
