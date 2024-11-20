import React from 'react';
import { Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="text-center">
                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                    <h3 className="mb-4 text-lg font-semibold text-gray-700">
                        {message}
                    </h3>
                    <div className="flex justify-center gap-4 mt-6">
                        <Button
                            color="purple"
                            className="px-6 py-2 rounded-full text-white bg-black transition"
                            onClick={onConfirm}
                        >
                            Yes
                        </Button>
                        <Button
                            color="gray"
                            className="px-6 py-2 rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
                            onClick={onCancel}
                        >
                            No
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
