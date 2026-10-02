import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';

export function Modal({ children, onClose, title, drawer = false, wide = false }: { children: ReactNode; onClose: () => void; title: string; drawer?: boolean; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    if (!dialog?.open) dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      if (dialog?.open) dialog.close();
      document.body.style.overflow = previous;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return <dialog ref={ref} aria-label={title} className={`dialog-shell ${drawer ? 'drawer-shell' : ''} ${wide ? 'wide-dialog' : ''}`} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <motion.div className="dialog-content" initial={drawer ? { x: 50, opacity: 0 } : { y: 14, scale: .98, opacity: 0 }} animate={{ x: 0, y: 0, scale: 1, opacity: 1 }} transition={{ duration: .23, ease: 'easeOut' }}>
      {children}
    </motion.div>
  </dialog>;
}