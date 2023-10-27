import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import InviteUserForm from '../Form/InviteUserForm';
import AddItemForm from '../Form/AddItemForm';
import { BsInfoCircle, BsLink, BsFillCartFill, BsCartX, BsPencil, BsTrashFill, BsBoxArrowUpRight  } from 'react-icons/bs';
import Masonry from 'react-masonry-css';
import EditItemForm from "../Form/EditItemForm";

const WishlistDetail = ({ wishlist, onBackClick }) => {

    const [items, setItems] = useState([]);
    const [affectedUsers, setAffectedUsers] = useState([]);
    const [showInviteUserForm, setShowInviteUserForm] = useState(false);
    const [showAddItemForm, setShowAddItemForm] = useState(false);
    const [showEditItemForm, setShowEditItemForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const tooltipRef = useRef(null); // Référence à l'infobulle

    const breakpointColumnsObj = {
        default: 4,  // 3 colonnes par défaut
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

    const handleMouseOver = (itemId, e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        // Définir le positionnement par défaut à droite
        let leftPosition = rect.right + scrollLeft - 30; // décaler légèrement vers la droite

        // Vérifiez si nous sommes à moins de 100 pixels du bord droit de l'écran
        if (window.innerWidth - rect.right < 100) {
            // Dans ce cas, ajustez pour afficher l'infobulle vers la gauche
            leftPosition = rect.left + scrollLeft - 300; // ajustez selon vos besoins
        }

        setTooltipPosition({
            top: rect.top + scrollTop - 50, // décaler légèrement vers le haut
            left: leftPosition
        });
        setHoveredItemId(itemId);
    };


    const handleMouseOut = () => {
        setHoveredItemId(null);
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
            <div className="md:flex md:justify-between mb-4 p-4 flex-col">
                <div className="mb-4 md:mb-0 text-center md:text-left">
                    <h2 className="text-xl font-semibold">{wishlist.name}</h2>
                    <p>{wishlist.description}</p>
                </div>
                {wishlist.User.username && (
                    <div className="space-y-2 md:space-x-2 md:space-y-0">
                        <button
                            className="w-full md:w-auto text-center px-4 py-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-600 focus:outline-none"
                            onClick={onBackClick}
                        >
                            Back to my wishlists
                        </button>
                        {loggedInUser != null && wishlist.User.id === loggedInUser.id && !wishlist.isClosed && (
                            <>
                                <button
                                    className="w-full md:w-auto text-center mt-2 md:mt-0 px-4 py-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-600 focus:outline-none"
                                    onClick={handleInviteUser}
                                >
                                    Send an invitation
                                </button>
                                <button
                                    className="w-full md:w-auto text-center mt-2 md:mt-0 px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none"
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
                <div className="gap-4 p-0">
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="masonry-grid"
                        columnClassName="masonry-grid_column"
                    >
                        {affectedUsers.map((user) => (
                            <div key={user.id} className="bg-white border border-gray-300 p-2 rounded-md shadow-md min-h-fit tuile">
                                {loggedInUser != null && loggedInUser.id === user.id ? (
                                    <h3 className="text-lg font-semibold">{user.username} (you) </h3>
                                ) : (
                                    <h3 className="text-lg font-semibold">{user.username}</h3>
                                )}
                                <ul>
                                    {items
                                        .filter((item) => item.userId === user.id)
                                        .map((item) => (
                                            <li className="bg-white mt-1 border border-gray-300 p-2 rounded-md hover:bg-gray-100 hover:shadow-md flex flex-col md:flex-row items-center justify-between text-sm max-h-[300px] overflow-hidden">
                                                <div className="flex flex-col pr-4 flex-grow mb-2 md:mb-0 md:flex-grow">
                                                    <div className="flex flex-row items-center justify-between">
                                                        <p className="break-word">{item.itemName}
                                                            {item.reserved && loggedInUser != null && loggedInUser.id !== user.id && (
                                                                <span className="text-xs text-green-600"> - Reserved by {item.Reservations[0].User.username}</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {item.description && (
                                                        <button
                                                            className="ml-2 px-2 py-1 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-600 focus:outline-none"
                                                            onMouseOver={(e) => handleMouseOver(item.id, e)}
                                                            onMouseOut={handleMouseOut}
                                                        >
                                                            <BsInfoCircle size="16" />
                                                        </button>
                                                    )}
                                                    {hoveredItemId === item.id && (
                                                        <div
                                                            ref={tooltipRef}
                                                            style={{
                                                            position: 'absolute',
                                                            top: `${tooltipPosition.top}px`,
                                                            left: `${tooltipPosition.left}px`,
                                                            backgroundColor: 'white',
                                                            border: '1px solid gray',
                                                            padding: '5px',
                                                            borderRadius: '5px',
                                                            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                                                            zIndex: 10,
                                                            animation: 'fadeIn 0.5s forwards'
                                                        }}>
                                                            {item.description}
                                                        </div>
                                                    )}
                                                    {item.url && (
                                                        <a
                                                            href={item.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ml-2 px-2 py-1 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-600 focus:outline-none"
                                                        >
                                                            <BsLink size="16" />
                                                        </a>
                                                    )}
                                                    {!item.reserved && loggedInUser != null && loggedInUser.id !== user.id && (
                                                        <button
                                                            className="ml-2 px-2 py-1 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-600 focus:outline-none"
                                                            onClick={() => handleReserveItem(item.id)}
                                                        >
                                                            <BsFillCartFill size="16" />
                                                        </button>
                                                    )}
                                                    {item.reserved && loggedInUser != null && loggedInUser.id !== user.id && (
                                                        <>
                                                            {item.Reservations[0].User.id === loggedInUser.id && (
                                                                <button
                                                                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none"
                                                                    onClick={() => handleCancelReserveItem(item.id)}
                                                                >
                                                                    <BsCartX size="16" />
                                                                </button>
                                                            )}
                                                        </>
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
                                            </li>
                                        ))}
                                </ul>
                                {loggedInUser != null && loggedInUser.id === user.id && (
                                    <button className="px-2 mt-1 py-2 bg-emerald-400 text-white rounded-md shadow-md hover:bg-emerald-600 min-w-full focus:outline-none" onClick={handleAddItem}> + </button>
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
