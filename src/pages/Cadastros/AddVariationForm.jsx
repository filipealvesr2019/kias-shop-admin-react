import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Certifique-se de ter importado isso para autenticação via token
import './AddVariationForm.css';
import { useConfig } from '../../context/ConfigContext';

const AddVariationForm = ({ productId }) => {
  const [color, setColor] = useState(''); // Estado para a cor selecionada
  const [urls, setUrls] = useState([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [sizes, setSizes] = useState([]);
  const [size, setSize] = useState('');
  const [prices, setPrices] = useState([]);
  const [price, setPrice] = useState('');
  const [quantities, setQuantities] = useState([]);
  const [quantityAvailable, setQuantityAvailable] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { apiUrl } = useConfig();
  
  // Função para obter as cores do backend
  const [colors, setColors] = useState([]);
  const getColors = async () => {
    try {
      const token = Cookies.get("token");
      const credentials = Cookies.get("role");
      const response = await axios.get(`${apiUrl}/api/admin/colors`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Credentials: credentials,
        },
      });
      setColors(response.data.colors);
    } catch (error) {
      console.error("Erro ao obter cores", error);
    }
  };

  // Chamar a função para obter cores ao carregar o componente
  useEffect(() => {
    getColors();
  }, []);

  // Habilita o botão "Adicionar" baseado no estado de tamanho, preço e quantidade
  useEffect(() => {
    if (size && price && quantityAvailable) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [size, price, quantityAvailable]);

  const handleAddVariation = async () => {
    try {
      const newVariation = {
        color,
        urls,
        sizes: sizes.map((size, index) => ({
          size,
          price: prices[index],
          quantityAvailable: quantities[index],
        })),
      };

      const response = await axios.post(`${apiUrl}/api/product/${productId}/add-variation`, newVariation);

      if (response.data.success) {
        console.log("Variação adicionada com sucesso!");
        setColor('');
        setUrls([]);
        setCurrentUrl('');
        setSizes([]);
        setPrices([]);
        setQuantities([]);
        setSize('');
        setPrice('');
        setQuantityAvailable('');
        setFeedback([]);
      } else {
        console.error("Erro ao adicionar variação:", response.data.message);
      }
    } catch (error) {
      console.error("Erro ao adicionar variação:", error);
    }
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    setUrls([...urls, currentUrl]);
    setCurrentUrl('');
  };

  const handleAddSizePriceQuantity = () => {
    setSizes([...sizes, size]);
    setPrices([...prices, price]);
    setQuantities([...quantities, quantityAvailable]);
    setSize('');
    setPrice('');
    setQuantityAvailable('');
    setFeedback([...feedback, `Tamanho: ${size}, Preço: ${price}, Quantidade: ${quantityAvailable}`]);
  };

  return (
    <div className="variation-form-container">
      <h2>Adicionar Variação</h2>

      {/* Campo para selecionar a cor */}
      <label htmlFor="color">Cor:</label>
      <select
        name="color"
        value={color} // Vincula o estado color
        onChange={(e) => setColor(e.target.value)} // Atualiza o estado color
        style={{ marginTop: "10px", width: "15vw", padding: "10px", fontSize: "16px" }}
      >
        <option value="">Selecione uma cor</option>
        {colors.map((color) => (
          <option key={color.id} value={color.name.toLowerCase()}>
            {color.name}
          </option>
        ))}
      </select>

      {/* Campo para URLs de imagens */}
      <label htmlFor="url">URLs:</label>
      <input
        type="text"
        id="url"
        value={currentUrl}
        onChange={(e) => setCurrentUrl(e.target.value.trim())}
      />
      <button className="AddUrlButton" onClick={handleAddUrl}>Adicionar URL</button>

      <ul>
        {urls.map((url, index) => (
          <li key={index}>
            <img src={url} alt="" style={{ width: "10vw" }} />
            {url}
          </li>
        ))}
      </ul>

      {/* Campos para tamanho, preço e quantidade */}
      <label htmlFor="size">Tamanho:</label>
      <input
        type="text"
        id="size"
        value={size}
        onChange={(e) => setSize(e.target.value.trim())}
        style={{ width: "15vw" }}
      />
      <label htmlFor="price">Preço (R$):</label>
      <input
        type="text"
        id="price"
        value={price}
        onChange={(e) => setPrice(e.target.value.trim())}
        style={{ width: "15vw" }}
      />
      <label htmlFor="quantityAvailable">Quantidade Disponível:</label>
      <input
        type="text"
        id="quantityAvailable"
        value={quantityAvailable}
        onChange={(e) => setQuantityAvailable(e.target.value.trim())}
        style={{ width: "15vw" }}
      />

      <button
        type="button"
        onClick={handleAddSizePriceQuantity}
        disabled={isButtonDisabled}
        style={{ backgroundColor: isButtonDisabled ? "#ccc" : "#185ea5" }}
        className="variationSizePriceQuantityButton"
      >
        Adicionar
      </button>

      {feedback.length > 0 && (
        <div>
          <h3>Adicionado recentemente:</h3>
          <ul>
            {feedback.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Botão para adicionar variação */}
      <button className="AddVariationButton" onClick={handleAddVariation}>
        Adicionar Variação
      </button>
    </div>
  );
};

export default AddVariationForm;
