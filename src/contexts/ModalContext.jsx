import React, { createContext, useState, useContext } from "react";
import ModalComponent from "../components/common/ModalComponent";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalData, setModalData] = useState({
    isOpen: false,
    content: null,
    onConfirm: () => {},
    confirmText: "OK",
  });

  const openModalForm = (task, RenderComponent, onConfirm, confirmText = "OK") => {
    let formData = {};

    const handleDataChange = (data) => {
      formData = { ...data } // Update formData when changes occur
    };

    setModalData({
      isOpen: true,
      content:  <RenderComponent task={task} onDataChange={handleDataChange} />,
      onConfirm: () => {
        onConfirm(formData);
        closeModal();
      },
      confirmText,
    });
  };

  const openModal = (content, onConfirm, confirmText = "OK") => {
    setModalData({
      isOpen: true,
      content,
      onConfirm: () => {
        onConfirm();
        closeModal();
      },
      confirmText,
    });
  };

  const closeModal = () => {
    setModalData((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, openModalForm }}>
      {children}
      <ModalComponent
        isOpen={modalData.isOpen}
        onClose={closeModal}
        onConfirm={modalData.onConfirm}
        confirmText={modalData.confirmText}
      >
        {modalData.content}
      </ModalComponent>
    </ModalContext.Provider>
  );
};

// Custom hook to use modal context
export const useModal = () => {
  return useContext(ModalContext);
};
