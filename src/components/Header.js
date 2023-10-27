// Header.js
import React from 'react';
import { BsBoxArrowRight } from 'react-icons/bs';

const Header = ({ title, user, onLogout }) => {
    return (
        <div className="flex justify-between items-center bg-gray-800 px-2 md:px-4 py-2">
            <h1 className="text-white font-bold text-xl">{title}</h1>
            {user ? (
                <div className="text-white flex items-center">
                    <span className="mr-2 hidden md:inline-flex">Hello, {user}</span>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded focus:outline-none md:inline-flex hidden"
                        onClick={onLogout}
                    >
                        Logoff
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded focus:outline-none md:hidden"
                        onClick={onLogout}
                        aria-label="Logout"
                    >
                        <BsBoxArrowRight size={20} />
                    </button>
                </div>
            ) : (
                <div>
                    {/* Met ici le code pour le cas où l'utilisateur n'est pas connecté */}
                </div>
            )}
        </div>
    );
};

export default Header;
