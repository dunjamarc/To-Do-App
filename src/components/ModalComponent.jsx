import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const modalStyle = {
  overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
  content: {
    width: "300px",
    height: "200px",
    margin: "auto",
    padding: "20px",
    display: "flex",
    flexFlow: "column",
    justifyContent: "space-between"
  },
};

const ModalComponent = ({ isOpen, onClose, onConfirm, confirmText, children }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyle}>
      {children}
      <div className="cta-buttons">
        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm}>{confirmText}</button>
      </div>
    </Modal>
  );
};

export default ModalComponent;

