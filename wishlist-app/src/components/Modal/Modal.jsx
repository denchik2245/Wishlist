import { useEffect } from "react";
import "./Modal.css";

export default function Modal({ isOpen, onClose, isEdit = false, children }) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modalOverlay" onMouseDown={onClose}>
      <div
        className={`modalWindow ${isEdit ? "modalWindowEdit" : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          className="modalClose"
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 5L15 15M15 5L5 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
}