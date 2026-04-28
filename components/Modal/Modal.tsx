'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Modal({ children, onClose }: ModalProps) {
    const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    useEffect(() => {
        if (!isClient) return;

        document.body.style.overflow = 'hidden';

         const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        
        window.addEventListener('keydown', handleKeyDown);

        return () => {
              document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isClient, onClose]);

    if (!isClient) return null;

    const container = document.getElementById('modal-root') || document.body;

        const handleBackdropClick = (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        if (e.target === e.currentTarget) onClose();
    };

  return createPortal(
        <div
            className={css.backdrop}
            role="dialog"
            aria-modal="true"
            onClick={handleBackdropClick}
        >
            <div className={css.modal}>
                {children}
            </div>
        </div>,
        container
    );
}