import React, { useState, useEffect, useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useConfig } from "../../../../context/ConfigContext";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./ModalColor.module.css";
export default function InitialFocus({ colorId, getColors }) {
  const credentials = Cookies.get("role"); // Obtenha as credenciais do cookie
  const { apiUrl } = useConfig();
  const token = Cookies.get("token");
  const modalRef = useRef(null);

  const [openModal, setOpenModal] = useState(false);
  const handleClickOpenModal = () => {
    setOpenModal(true);
  };

  const handleClickCloseModal = () => {
    setOpenModal(false);
  };

  const handleDeleteColor = async (colorId) => {
    const token = Cookies.get("token"); // Obtenha o token do cookie
    const credentials = Cookies.get("role"); // Obtenha as credenciais do cookie

    try {
      const response = await axios.delete(
        `${apiUrl}/api/admin/colors/${colorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Credentials: credentials,
          },
        }
      );

      if (response.data.success) {
        toast.success("Cor excluída com sucesso!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        getColors(); // Atualize a lista de cores
        onDeletedColor();
      } else {
        toast.error(response.data.message || "Erro ao excluir a cor", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.error("Erro ao excluir a cor:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        openModal
      ) {
        setOpenModal(false);
        setOpenSecondCartModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModal]);
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />

      <DeleteIcon
        onClick={handleClickOpenModal}
        style={{ cursor: "pointer" }}
      />

      {openModal && (
        <div className={styles.Modal}>
          <div ref={modalRef} className={styles.ModalContent}>
            <span className={styles.Close} onClick={handleClickCloseModal}>
              <CloseIcon />
            </span>
            <h1
              style={{ fontSize: "1.5rem" }}
              className={styles.ModalContent__p}
            >
              Essa ação e irreversível você quer Excluir esse produto do
              carrinho?
            </h1>
            <div className={styles.buttonContainer}>
              <button
                onClick={() => {
                  handleDeleteColor(colorId); // Certifique-se de passar colorId aqui
                  handleClickCloseModal();
                }}
                className={styles.confirmButton}
              >
                SIM
              </button>

              <button
                type="button"
                onClick={handleClickCloseModal}
                className={styles.cancel}
              >
                NÃO
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
