"use client";

import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Popup } from "./Popup";

interface CreditsModalProps {
  isOpen: boolean;
  isGuest: boolean;
  onClose: () => void;
}

// Out-of-requests modal: asks guests to log in, offers the credit pack to users.
export const CreditsModal: React.FC<CreditsModalProps> = ({
  isOpen,
  isGuest,
  onClose,
}) => {
  const [showPopUp, setShowPopUp] = useState(false);

  // Slide the popup in after the modal opens, and out when it closes.
  useEffect(() => {
    const timer = setTimeout(() => setShowPopUp(isOpen), 300);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative flex items-center justify-center md:h-[620px] w-[100vw] md:w-[90vw] lg:w-[860px] h-lvh">
        <div
          className={`absolute w-full h-full transition-all duration-1000 ease-in-out z-40 ${showPopUp ? "left-1/2 -translate-x-1/2" : "-left-[1280px]"}`}
        >
          <Popup isGuest={isGuest} onClose={onClose} />
        </div>
      </div>
    </Modal>
  );
};
