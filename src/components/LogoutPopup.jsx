import React from "react";
import { useTranslation } from "react-i18next";

const LogoutPopup = ({ onConfirm, onCancel }) => {
  const { t } = useTranslation();
  return (
    <div className="logout-popup">
      <div className="popup-contentl">
        <h4>{t("Are you sure you want to logout?")}</h4>
        <div className="popup-buttons">
          <button className="confirm-button" onClick={onConfirm}>
            {t("Yes")}
          </button>
          <button className="cancel-button" onClick={onCancel}>
            {t("No")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopup;
