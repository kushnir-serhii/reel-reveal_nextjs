"use client";

import React, { useEffect, ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../Icon";
import { modalVariants } from "./Modal.variants";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  toggleDuration?: number;
  isHideCross?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  onClose,
  isHideCross = false,
  className,
}) => {
  const { overlay, content, closeBtn, closeIcon } = modalVariants();
const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if(!document) return
    const handleBodyScroll = () => {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      if (isOpen) {
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      } else {
        document.body.style.overflow = "unset";
        document.body.style.paddingRight = "0px";
      }
    };

    handleBodyScroll();

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen]);

  useEffect(() => {
    if (onClose) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      if (isOpen) {
        document.addEventListener("keydown", handleKeyDown);
      } else {
        document.removeEventListener("keydown", handleKeyDown);
      }

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose && onClose();
    }
  };

  
  useEffect(() => {
    const modalRoot = document?.getElementById("modal");
    setModalRoot(modalRoot);
  }, [])
  
  if (!modalRoot || !isOpen) return null;
  
  return createPortal(
    <div
      onClick={handleClickOutside}
      className={overlay({ className })}
    >
      {/* This is the dynamic sizing wrapper */}
      <div className={content()}>
        {children}
        {onClose && !isHideCross && (
          <button
            onClick={onClose}
            className={closeBtn()}
            aria-label="Close Modal"
          >
            <Icon
              id={"cross"}
              width={20}
              height={20}
              className={closeIcon()}
            />
          </button>
        )}
      </div>
    </div>,
    modalRoot
  );
};
