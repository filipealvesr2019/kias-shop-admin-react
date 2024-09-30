import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Colors.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import styles from "./Colors.module.css";
import { useConfig } from "../../../context/ConfigContext";
import ModalColor from "./ModalColor/ModalColor";
const Categories = () => {
  const [newColorName, setNewColorName] = useState("");
  const [newColorCode, setNewColorCode] = useState("");
  const [colorInputError, setColorInputError] = useState("");
  const [colorCodeInputError, setColorCodeInputError] = useState("");
  const [colors, setColors] = useState([]);
  const [clickDeleteIcon, setclickDeleteIcon] = useState(null);

  const credentials = Cookies.get("role"); // Obtenha as credenciais do cookie
  const { apiUrl } = useConfig();
  const token = Cookies.get("token");

  const fetchColors = async () => {
    await setColors();
  };
  const validateColorForm = () => {
    const errors = {};

    if (!newColorName.trim()) {
      errors.newColorName = "Digite o nome da cor";
    }

    if (!newColorCode.trim()) {
      errors.newColorCode = "Digite o código da cor";
    }

    setColorInputError(errors.newColorName);
    setColorCodeInputError(errors.newColorCode);

    return Object.keys(errors).length === 0;
  };

  const getColors = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/colors`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Credentials: credentials,
        },
      });
      setColors(response.data.colors);
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao obter cores", error);
    }
  };

  useEffect(() => {
    getColors();
  }, []);

  const formatCategoryForDB = (color) => {
    return color
      .trim()
      .toLowerCase()
      .normalize("NFD") // Normaliza a string para decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, ""); // Remove os diacríticos (acentos)
  };
  const formattedCategory = formatCategoryForDB(newColorName);

  const addColor = async () => {
    if (!validateColorForm()) return;

    try {
      const response = await axios.post(
        `${apiUrl}/api/admin/new/color`,
        { name: formattedCategory, color: newColorCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Credentials: credentials,
          },
        }
      );

      if (response.data.success) {
        setNewColorName("");
        setNewColorCode("");
        getColors(); // função para buscar todas as cores
        toast.success("Cor adicionada com sucesso!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      } else {
        console.error("Erro ao adicionar cor", response.data.message);
      }
    } catch (error) {
      console.error("Erro ao adicionar cor", error);
    }
  };



  return (
    <div className="CategoriesContainer">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className={`addContainerColors ${colorInputError ? "error" : ""}`}>
        <div
          className={`colorInput ${colorInputError ? "error" : ""} ${
            styles.inputContainer
          }`}
        >
          <input
            type="text"
            value={newColorName}
            placeholder="Nome da cor..."
            onChange={(e) => setNewColorName(e.target.value)}
          />
          <input
            type="text"
            value={newColorCode}
            placeholder="Código da cor..."
            onChange={(e) => setNewColorCode(e.target.value)}
          />
          <div style={{ color: "red" }}>{colorInputError}</div>
        </div>
        <button
          onClick={addColor}
          className="categoryButtonColors"
          style={{ marginLeft: "1rem" }}
        >
          Adicionar Cor
        </button>
      </div>

      <table className="category-table">
        <thead>
          <tr>
            <th className="Categorias">Cores</th>
            <th className="Categorias">Codigo da cor</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {colors.map((color) => (
            <tr key={color._id}>
              <td style={{ display: "flex", flexDirection: "row" }}>
                {" "}
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    backgroundColor: `${color.color}`,
                    marginRight: "10px",

                    position: "relative",
                  }}
                ></div>
                {color.name}
              </td>
              <td>{color.color}</td>
              <td
                onClick={() => {
                  setclickDeleteIcon(color._id);
                }}
                style={{ color:'red'}}
              >
                <ModalColor
                  colorId={clickDeleteIcon}
                  getColors={getColors} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
