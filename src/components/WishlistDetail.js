import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InviteUserForm from '../Form/InviteUserForm';
import AddItemForm from '../Form/AddItemForm';
import { BsFillCartCheckFill, BsFillCartFill, BsCartX, BsPencil, BsTrashFill, BsBoxArrowUpRight  } from 'react-icons/bs';
import Masonry from 'react-masonry-css';
import EditItemForm from "../Form/EditItemForm";
import { Tooltip, TooltipProvider } from 'react-tooltip';



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
        default: 4,  // 3 colonnes par défaut
        1100: 4,
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

    const handleDeleteItemClick = async (item) => {

        const confirmed = window.confirm("Beware, if you delete this item, it will be gone forever. Are you sure you want to delete it?");

        if (confirmed) {
            try {
                const response = await axios.delete(
                    process.env.REACT_APP_BACKEND_URL + `/item/${item.id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            "x-access-token": localStorage.getItem('token'),
                        },
                    });

                // Mise à jour de l'état de la wishlist pour indiquer qu'elle est clôturée
                fetchWishlistItems();
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'item :', error);
            }
        }
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
                        <TooltipProvider>
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
                                            <li className="bg-white mt-2 border border-gray-300 p-2 rounded-md hover:bg-gray-100 hover:shadow-md flex justify-between items-center text-sm" key={item.id}>
                                                <div className="flex flex-row justify-between w-full">
                                                    <div className="flex flex-col justify-start">
                                                        <p className="font-bold">{item.itemName}</p>

                                                        <p
                                                            className="TileSub text-ellipsis overflow-hidden whitespace-nowrap max-w-xs"
                                                            data-tooltip-id={`itemDescription-${item.id}`}
                                                        >
                                                            {item.description}
                                                        </p>
                                                        <Tooltip id={`itemDescription-${item.id}`} place="top" effect="solid">
                                                            {item.description}
                                                        </Tooltip>
                                                    </div>
                                                    <div className="flex items-center">
                                                        {item.url && (
                                                            <a
                                                                href={item.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                                                            >
                                                                <BsBoxArrowUpRight size="16" />
                                                            </a>
                                                        )}
                                                        {!item.reserved && loggedInUser != null && loggedInUser.id !== user.id && (
                                                            <button
                                                                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                                                                onClick={() => handleReserveItem(item.id)}
                                                            >
                                                                <BsFillCartFill size="16" />
                                                            </button>
                                                        )}
                                                        {item.reserved && loggedInUser != null && loggedInUser.id !== user.id && (
                                                            <div className="flex items-center">
                                                                <BsFillCartCheckFill className="text-green-500" size="16" />
                                                                {item.Reservations[0].User.id === loggedInUser.id ? (
                                                                    <>
                                                                        <button
                                                                            className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none"
                                                                            onClick={() => handleCancelReserveItem(item.id)}
                                                                        >
                                                                            <BsCartX size="16" />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <p className="text-xs text-gray-500 ml-2">{item.Reservations[0].User.username}</p>
                                                                )}
                                                            </div>
                                                        )}
                                                        {loggedInUser.id === item.userId && (
                                                            <>
                                                                <button onClick={() => handleEditItemClick(item)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none">
                                                                    <BsPencil size="16" />
                                                                </button>
                                                                <button onClick={() => handleDeleteItemClick(item)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none">
                                                                    <BsTrashFill size="16" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>

                                        ))}
                                </ul>

                                {loggedInUser!= null && loggedInUser.id === user.id && (
                                    <button className="px-4 mt-3 py-2 bg-emerald-400 text-white rounded-md shadow-md hover:bg-emerald-600 min-w-full focus:outline-none" onClick={handleAddItem} > + </button>
                                )}
                            </div>
                        ))}
                        </TooltipProvider>
                    </Masonry>
                </div>
            )}
        </div>
    );
};

export default WishlistDetail;
