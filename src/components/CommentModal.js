import React, { useState, useEffect } from 'react';

const CommentModal = ({ closeModal, itemId }) => {

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchComments();
    }, [itemId]);

    const handleBackgroundClick = (e) => {
        // Vérifiez si le clic provient directement de la div de fond
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/comments/item/${itemId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "x-access-token" : localStorage.getItem('token'),
                },
            });
            const data = await response.json();

            if (data) {
                setComments(data);
            } else {
                console.error('Error fetching comments:', data.message);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleCommentSubmit = async () => {
        if (newComment.trim() === '') return; // Pour éviter les commentaires vides

        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/comments/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "x-access-token" : localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    content: newComment,
                    itemId,
                }),
            });

            const data = await response.json();

            if (data) {
                fetchComments();
                setNewComment('');
            } else {
                console.error('Error adding comment:', data.message);
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" >
            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleBackgroundClick}></div>
            <div className="bg-white rounded-lg w-full max-w-md mx-auto p-4 shadow-lg relative">
                <button
                    onClick={closeModal}
                    className="absolute top-0 right-0 mt-4 mr-4 focus:outline-none"
                >
                    &times;
                </button>

                <div className="mb-4">
                    <h2 className="text-xl font-bold">Comments</h2>
                </div>

                <div className="mb-4 h-64 overflow-y-auto rounded-lg p-2">
                    {comments.length === 0 ? (
                        <p className="text-gray-500">No comment yet</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="mb-2 bg-gray-100 p-2 rounded-lg">
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold">{comment.User.username}</span>
                                    <span className="text-gray-600">{new Date(comment.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="mt-1">{comment.content}</div>
                            </div>
                        ))
                    )}
                </div>

                <div>
            <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="w-full p-2 rounded border mb-2"
                rows="1"
                placeholder="Add a comment..."
            ></textarea>
                    <button
                        onClick={handleCommentSubmit}
                        className="bg-gray-800 hover:bg-gray-500 text-white rounded-md px-4 py-2 w-full"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>

    );
};

export default CommentModal;
