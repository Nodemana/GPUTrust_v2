'use client';

import { useState } from 'react';
import { Button } from '@/app/shared/components/Button';

interface ContactPopupProps {
    seller_id: string;
    user_id: string;
    onSendMessage: (seller_id: string, user_id: string) => void;
}

export function ContactPopup({ seller_id, user_id, onSendMessage }: ContactPopupProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
    }

    return (
        <div>
        <Button onClick={() => {onSendMessage(seller_id, user_id);}} variant="primary" size="md">
            Send Message
        </Button>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full h-96 relative">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Send</h2>
            </div>
            <div className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                onClick={handleClose}
            >
                ×
            </div>
        </div>
        </div>
    )
}

