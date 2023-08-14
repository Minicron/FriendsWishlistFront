import React, { useState, useEffect } from 'react';
import './App.css';
import LoginForm from './Form/LoginForm';
import SignupForm from "./Form/SignupForm";
import WishlistGrid from './components/WishlistGrid';
import WishlistForm from './components/WishlistForm';
import WishlistDetail from './components/WishlistDetail';
import ActivationForm from './components/ActivationForm';
import cookie from 'cookie';
import Header from './components/Header';
import { useLocation } from 'react-router-dom';
import axios from "axios";
import ToastComponent from "./components/ToastComponent";

const App = () => {

    const [showLogin, setShowLogin] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [wishlists, setWishlists] = useState([]);
    const [selectedWishlist, setSelectedWishlist] = useState(null);
    const [username, setUsername] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showWishlistDetail, setShowWishlistDetail] = useState(false);
    const [showActivationForm, setShowActivationForm] = useState(false);
    const [signupSuccessMessage, setSignupSuccessMessage] = useState('');

    const location = useLocation();

    let isRefreshing = false;
    let failedQueue = [];

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const urlToken = urlParams.get('token');
        if (urlToken) {
            // Faites quelque chose avec le token, comme le vérifier ou afficher un formulaire spécial
            setShowActivationForm(true);
        }

        // Récupère le cookie "token" et vérifie s'il existe
        const cookies = cookie.parse(document.cookie);
        const token = cookies.token;
        // Détermine si l'utilisateur est connecté en fonction de la présence du cookie "token"
        setIsLoggedIn(!!token);
    }, [location]);

    const processQueue = (error, token = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        failedQueue = [];
    };

    // Fonction pour afficher les détails de la wishlist sélectionnée
    const handleWishlistClick = async (wishlistId) => {

        console.log('Wishlist clicked:', wishlistId);
        // Appel à l'API pour récupérer les détails de la wishlist sélectionnée
        try {
            const response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/wishlist/' + wishlistId, {
                headers: {
                    "x-access-token": localStorage.getItem('token'),
                },
            });
            // Stocke l'id de l'utilisateur dans l'état userId
            setSelectedWishlist(response.data);
            setShowWishlistDetail(true);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;
            const refreshToken = localStorage.getItem("refreshToken");
            const storedUsername = localStorage.getItem("username");

            if (error.response.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers["x-access-token"] = token;
                        return axios(originalRequest);
                    }).catch(err => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const res = await axios.post('/token', { username: storedUsername, refreshToken });
                    if (res.status === 200) {
                        localStorage.setItem("token", res.data.accessToken);
                        axios.defaults.headers.common["x-access-token"] = res.data.accessToken;
                        isRefreshing = false;
                        processQueue(null, res.data.accessToken);
                        return axios(originalRequest);
                    }
                } catch (err) {
                    processQueue(err, null);
                    return Promise.reject(err);
                }
            }
            return Promise.reject(error);
        }
    );

    const handleExitWishlistDetail = () => {
        setShowWishlistDetail(false);
    }

    const handleHideWishlistForm = () => {
        setShowCreateForm(false);
    };

    const handleLogout = () => {
        document.cookie = cookie.serialize('token', '', { maxAge: -1 });
        setIsLoggedIn(false);
    };

    const handleSignupSuccess = (message) => {
        setShowLogin(true);
        setSignupSuccessMessage(message);
    }

    // Fonction pour gérer la connexion réussie
    const handleLoginSuccess = (token, refreshToken, username) => {
        setIsLoggedIn(true);
        setSignupSuccessMessage('');
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('username', username);
        setUsername(username);
        setShowWishlistDetail(false);
        setShowCreateForm(false);
        setShowActivationForm(false);
    };

    // Si l'utilisateur a cliqué un lien d'activation, affiche le formulaire d'activation
    if (showActivationForm) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <ActivationForm />
            </div>
        );
    }

    // Si l'utilisateur n'est pas connecté, affiche simplement le formulaire de connexion
    if (!isLoggedIn) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                {showLogin ? (
                    <>
                        {signupSuccessMessage ? (
                            <ToastComponent signupSuccessMessage={signupSuccessMessage} />
                        ) : null}
                        <LoginForm
                            onSignupLinkClick={() => setShowLogin(false)}
                            onLoginSuccess={handleLoginSuccess} // Passe la fonction handleLoginSuccess au composant LoginForm
                        />
                    </>
                ) : (
                    <SignupForm
                        onLoginLinkClick={() => setShowLogin(true)}
                        onSignupSuccess={handleSignupSuccess}
                    />
                )}
            </div>
        );
    }

    // Si l'utilisateur est connecté, affiche ses listes de souhaits
    return (
        <div>
            <Header title="Friends Wishlist" user={username} onLogout={handleLogout} />
            {/* Affiche la grille de wishlists */}
            {showCreateForm ? (
                <WishlistForm onHideWishlistForm={handleHideWishlistForm} />
            ) : showWishlistDetail ? (
                <WishlistDetail wishlist={selectedWishlist} onBackClick={handleExitWishlistDetail} />
            ) : (
                <WishlistGrid wishlists={wishlists} onWishlistClick={handleWishlistClick} onDisplayWishlistForm={() => setShowCreateForm(true)} />
            )}
        </div>
    );
};

export default App;
