// Header.js
import React from 'react';

const Header = ({ title, user, onLogout }) => {
    return (
        <div className="flex justify-between items-center bg-gray-800 px-4 py-2">
            <h1 className="text-white font-bold text-xl">{title}</h1>
            {user ? (
                <div className="text-white">
                    <span className="mr-2">Hello, {user}</span>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded focus:outline-none"
                        onClick={onLogout}
                    >
                        Logoff
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
