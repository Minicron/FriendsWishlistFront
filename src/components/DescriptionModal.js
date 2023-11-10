import React from 'react';

const DescriptionModal = ({ closeDescriptionModal, description }) => {

    const handleBackgroundClick = (e) => {
        // Vérifiez si le clic provient directement de la div de fond
        if (e.target.id === "modal-backdrop") {
            closeDescriptionModal();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                id="modal-backdrop"
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={handleBackgroundClick}
            ></div>
            <div className="bg-white rounded-lg w-full max-w-md mx-auto p-4 shadow-lg relative overflow-hidden">
                <button
                    onClick={closeDescriptionModal}
                    className="absolute top-0 right-0 mt-4 mr-4 focus:outline-none"
                >
                    &times;
                </button>

                <div className="mb-4">
                    <h2 className="text-xl font-bold">Description</h2>
                </div>

                <div className="mb-4 h-64 overflow-y-auto rounded-lg p-4">
                    {description}
                </div>
            </div>
        </div>
    );
};

export default DescriptionModal;
