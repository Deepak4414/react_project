import React, { useState } from "react";
import "../../../Css/ConfirmDeleteModal.css"; // Optional styling file

const ConfirmDeleteModal =  ({ isOpen, onClose, onConfirm, itemName = "item" }) => {
  const [password, setPassword] = useState("");

  const handleConfirm = () => {
    onConfirm(password);
    setPassword(""); // reset for next time
  };

  if (!isOpen) return null;

  return (
    <div className="delete-modal-backdrop">
      <div className="delete-modal-container">
        <h3>Confirm Delete: {itemName}</h3>
        <p>To confirm deletion, enter your password below:</p>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="delete-modal-input"
        />
        <div className="delete-modal-actions">
          <button onClick={handleConfirm} className="delete-modal-confirm-btn">Confirm</button>
          <button onClick={onClose} className="delete-modal-cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};


export default ConfirmDeleteModal;
