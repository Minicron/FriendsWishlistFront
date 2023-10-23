import React, { useState, useEffect } from 'react';
import './App.css';
import LoginForm from './Form/LoginForm';
import SignupForm from "./Form/SignupForm";
import WishlistGrid from './components/WishlistGrid';
import WishlistForm from './components/WishlistForm';
import WishlistDetail from './components/WishlistDetail';
import ActivationForm from './components/ActivationForm';
import ForgetPasswordForm from './Form/ForgetPasswordForm';
import ResetPasswordForm from './Form/ResetPasswordForm';
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
    const [showForgetPassword, setShowForgetPassword] = useState(false);
    const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
    const [signupSuccessMessage, setSignupSuccessMessage] = useState('');
    const [resetPasswordSuccessMessage, setResetPasswordSuccessMessage] = useState('');

    const location = useLocation();

    let isRefreshing = false;
    let failedQueue = [];

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);

        // Token d'activation dans l'URL ?
        const urlActivationToken = urlParams.get('activationToken');
        if (urlActivationToken) {
            // Faites quelque chose avec le token, comme le vérifier ou afficher un formulaire spécial
            setShowActivationForm(true);
        }

        // Token de réinitialisation du mot de passe dans l'URL ?
        const urlResetPasswordToken = urlParams.get('resetPasswordToken');
        if (urlResetPasswordToken) {
            setShowResetPasswordForm(true);
        }

        // Vérifiez le localStorage pour le token et initialisez l'état
        const storedToken = localStorage.getItem('token');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUsername = localStorage.getItem('username');

        if (storedToken && storedRefreshToken && storedUsername) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
        } else {
            // Si le token n'est pas trouvé dans le localStorage, vérifiez les cookies
            const cookies = cookie.parse(document.cookie);
            const cookieToken = cookies.token;

            // Détermine si l'utilisateur est connecté en fonction de la présence du cookie "token"
            setIsLoggedIn(!!cookieToken);
        }

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
                    // Supprimez les tokens du local storage
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("username");
                    // Mettez à jour l'état pour déconnecter l'utilisateur
                    setIsLoggedIn(false);
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
        // Supprimer le cookie 'token'
        document.cookie = cookie.serialize('token', '', { maxAge: -1 });

        // Supprimer les éléments du localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');

        setIsLoggedIn(false);
    };

    const handleSignupSuccess = (message) => {
        setShowLogin(true);
        setSignupSuccessMessage(message);
    }

    const handleResetPasswordSuccess = (message) => {
        setShowResetPasswordForm(false);
        setShowLogin(true);
        setResetPasswordSuccessMessage(message);
    }

    const handleLoginAccessFromForgetPassword = () => {
        setShowForgetPassword(false);
        setShowLogin(true);
        setSignupSuccessMessage('');
    }

    const handleForgotPasswordLinkClick = () => {
        setShowLogin(false);
        setShowForgetPassword(true);
    };

    // Fonction pour gérer la connexion réussie
    const handleLoginSuccess = (token, refreshToken, username) => {
        setIsLoggedIn(true);
        setSignupSuccessMessage('');
        setResetPasswordSuccessMessage('');
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

    if(showResetPasswordForm) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <ResetPasswordForm onResetSuccess={handleResetPasswordSuccess}/>
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
                            <ToastComponent message={signupSuccessMessage} />
                        ) : null}
                        {resetPasswordSuccessMessage ? (
                            <ToastComponent message={resetPasswordSuccessMessage} />
                        ) : null}
                        <LoginForm
                            onSignupLinkClick={() => setShowLogin(false)}
                            onLoginSuccess={handleLoginSuccess}
                            onForgetPasswordLinkClick={handleForgotPasswordLinkClick}
                        />
                    </>
                ) : showForgetPassword ? (
                    <ForgetPasswordForm
                        onLoginLinkClick={handleLoginAccessFromForgetPassword}
                    />
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
