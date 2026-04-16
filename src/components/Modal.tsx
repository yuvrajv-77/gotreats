import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[var(--brand-charcoal)] border border-[var(--brand-border)] rounded-2xl p-6 max-w-sm w-full shadow-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-heading text-[var(--brand-cream)] text-lg">{title}</h3>
              <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-white/6 text-[var(--brand-cream)]/50 hover:text-[var(--brand-cream)] transition-colors">
                <X size={16} />
              </button>
            </div>

            <p className="text-[var(--brand-cream)]/50 text-sm font-body leading-relaxed mb-6">{message}</p>

            <div className="flex gap-3 justify-end">
              <Button onClick={onCancel} variant="secondary" size="sm">
                {cancelLabel}
              </Button>
              <Button onClick={onConfirm} variant="danger" size="sm">
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;