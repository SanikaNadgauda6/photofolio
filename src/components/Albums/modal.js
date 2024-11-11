import React from "react";
import "./Modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const Modal = ({ photo, onClose, onNext, onPrev, onDelete }) => {
  if (!photo) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img src={photo.url} alt={photo.name} />
        <button className="modal-close" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <button className="modal-navigation prev" onClick={onPrev}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <button className="modal-navigation next" onClick={onNext}>
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
        <button className="modal-delete" onClick={onDelete}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default Modal;
