import React, { useEffect, useRef, useState } from "react";
import styles from "./Products.module.css";

import axios from "axios";
import ModelProducts from "../../components/ModelProducts";
import DeleteModal from "../../components/DeleteModal";
import CloseIcon from "@mui/icons-material/Close";
import Pagination from "@mui/material/Pagination";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import Button from "@mui/joy/Button";
import TextField from "@mui/material/TextField";
import RemoveIcon from "@mui/icons-material/Remove";
import AddVariationForm from "./AddVariationForm";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, FormControl, MenuItem, Select } from "@mui/joy";
import { InputLabel } from "@mui/material";

const Products = () => {
  const { isAdmin, isManager } = useAuth();
  const [inStock, setInStock] = useState(false); // Inicializado como "sim", mas pode ser "não" dependendo da sua necessidade

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [newColorName, setNewColorName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sizeInStock, setSizeInStock] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const modalRef = useRef(null);

  const handleClickOpenModal = () => {
    setOpenModal(true);
  };

  const handleClickCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        openModal
      ) {
        setOpenModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModal]);

  const [formData, setFormData] = useState({
    _id: null,
    name: "",

    description: "",

    category: "",
    subcategory: "",
    variations: [
      {
        color: "",
        urls: [],
        sizes: [
          {
            size: "",
            price: 0,
            quantityAvailable: 0,
            inStockSize: true,

          },
        ],
      },
    ],
  });

  const { authToken } = useAuth();

  const [selectedColor, setSelectedColor] = useState(""); // Estado para armazenar a cor selecionada

  const handleColorChange = (color) => {
    setSelectedColor(color); // Atualiza o estado com a cor selecionada
  };

  const handleClickSelectedColor = (color) => {
    setSelectedColor(color); // Atualiza o estado com a cor selecionada
    handleDeleteVariation(product._id, color); // Chama a função para excluir a variação
  };

  useEffect(() => {
    getProducts();
  }, [currentPage, searchTerm, authToken]);

  const handleDeleteProduct = async (productId) => {
    try {
      if (!isAdmin && !isManager) {
        toast.error("Você não tem permissão para excluir produtos.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        return;
      }
      const credentials = Cookies.get("role"); // Obtenha as credenciais do cookie

      const token = Cookies.get("token"); // Obtenha o token do cookie
      console.log("Token:", token);

      const response = await axios.delete(
        `http://localhost:3001/api/admin/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Credentials: credentials,
          },
        }
      );

      if (response.data.success) {
        const updatedProducts = products.filter(
          (product) => product._id !== productId
        );
        setProducts(updatedProducts);
        console.log("Produto excluído com sucesso");
      } else {
        console.error(
          "Erro ao excluir produto. Mensagem do servidor:",
          response.data.error
        );
      }
    } catch (error) {
      console.error("Erro ao excluir produto. Detalhes do erro:", error);
    }
  };

  const getProducts = async () => {
    try {
      const credentials = Cookies.get("role"); // Obtenha as credenciais do cookie

      const token = Cookies.get("token"); // Obtenha o token do cookie

      const response = await axios.get(
        `http://localhost:3001/api/products?page=${currentPage}&keyword=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,

            Credentials: credentials,
          },
        }
      );

      const totalProducts = response.data.totalPages * itemsPerPage;
      setTotalPages(response.data.totalPages);

      setProducts(response.data.products);

      if (totalProducts < currentPage * itemsPerPage) {
        // If the current page has no items, go back one page
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
      }
    } catch (error) {
      console.error("Erro ao obter produtos", error);
      setError("Erro ao obter produtos. Por favor, tente novamente.");
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    // Se o campo que está sendo alterado não estiver aninhado dentro de um array, atualize diretamente
    if (!name.includes(".")) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      return;
    }

    // Se o campo que está sendo alterado estiver aninhado dentro de um array, atualize corretamente
    const [variationIndex, fieldName] = name.split(".");
    const updatedVariations = [...formData.variations];
    updatedVariations[variationIndex] = {
      ...updatedVariations[variationIndex],
      [fieldName]: value,
    };

    setFormData((prevData) => ({
      ...prevData,
      variations: updatedVariations,
    }));
  };

  const handleVariationChange = (variationIndex, sizeIndex, field, value) => {
    console.log("Valor recebido:", value); // Verifique o valor recebido
  
    setFormData((prevFormData) => {
      const updatedVariations = [...prevFormData.variations];
      if (
        field === "size" ||
        field === "price" ||
        field === "quantityAvailable" ||
        field === "inStockSize"
      ) {
        updatedVariations[variationIndex].sizes[sizeIndex][field] = 
          field === "inStockSize" ? value === "true" : value; // Trate inStockSize como booleano
      } else {
        updatedVariations[variationIndex][field] = value;
      }
      console.log("Estado atualizado:", updatedVariations); // Verifique o estado atualizado
      return {
        ...prevFormData,
        variations: updatedVariations,
      };
    });
  };
  
  const handleEditProduct = (product) => {
    setFormData({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory,
      variations: product.variations.map((variation) => ({
        ...variation,
        urls: variation.urls, // Manter as URLs como arrays
      })),
    });
  };

  // Update the handleUpdateProduct function to close the modal after updating
  // Restante do código...

  // Update the handleUpdateProduct function to close the modal after updating
  const handleUpdateProduct = async (productId) => {
    try {
      if (!isAdmin && !isManager) {
        toast.error("Você não tem permissão para editar produtos.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        return;
      }

      const token = Cookies.get("token"); // Obtenha o token do cookie
      const credentials = Cookies.get("role"); // Obtenha as credenciais do cookie
      console.log("Token:", token);

      const response = await axios.put(
        `http://localhost:3001/api/update/product/${productId}`,
        {
          ...formData,
          newColorName: newColorName, // Adicione o novo nome da cor aos dados do formulário
          inStock: inStock, // Atualize o campo inStock
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Credentials: credentials,
          },
        }
      );

      if (response.data._id) {
        console.log("Produto atualizado com sucesso");
        const updatedProductsResponse = await axios.get(
          "http://localhost:3001/api/products",
          {
            headers: {
              Authorization: `Bearer ${token}`,

              Credentials: credentials,
            },
          }
        );
        const updatedProducts = updatedProductsResponse.data.products;
        setProducts(updatedProducts);
        console.log("Estado do produto atualizado:", updatedProducts);
      } else {
        console.error(
          "Erro ao atualizar produto. Mensagem do servidor:",
          response.data.error || "Mensagem de erro não disponível"
        );
      }

      setIsModalOpen(false);
      setOpenModal(false);
      setFormData({
        _id: null,
        name: "",

        description: "",

        category: "",
        subcategory: "",
        variations: [
          {
            color: "",
            urls: [], // Make sure this is an array
          },
        ],
      });
    } catch (error) {
      console.error("Erro ao atualizar produto. Detalhes do erro:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  // Dentro do componente Products
  const handleDeleteVariation = async (productId, color) => {
    try {
      if (!isAdmin && !isManager) {
        toast.error("Você não tem permissão para excluir produtos.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        return;
      }
      const credentials = Cookies.get("role"); // Obtenha as credenciais do cookie
      const token = Cookies.get("token"); // Obtenha o token do cookie

      // Verifique se productId e color são strings

      const response = await axios.delete(
        `http://localhost:3001/api/product/${productId}/color/${color}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Credentials: credentials,
          },
        }
      );

      if (response.data.success) {
        const updatedProducts = products.map((product) =>
          product._id === productId
            ? {
                ...product,
                variations: product.variations.filter(
                  (variation) => variation.color !== color
                ),
              }
            : product
        );

        setProducts(updatedProducts);
        console.log("Resposta da API:", response.data);
      } else {
        console.error(
          "Erro ao excluir variação. Mensagem do servidor:",
          response.data.error
        );
      }
    } catch (error) {
      console.error("Erro ao excluir variação. Detalhes do erro:", error);
    }
  };


  const handleinStockSizeChange = (variationIndex, sizeIndex, field, value) => {
    const newVariations = [...formData.variations];
    if (sizeIndex !== null) {
      newVariations[variationIndex].sizes[sizeIndex][field] = value;
    } else {
      newVariations[variationIndex][field] = value;
    }
    setFormData({ ...formData, variations: newVariations });
  };



  return (
    <div className={styles.container}>
    

      <div className={styles.Model}>
        <ModelProducts />
      </div>

      {/* ... (other components) */}

      <div
        style={{
          display: "flex",
          flexDirection:"column",

          justifyContent: "center",
          alignItems: "center",


          width: "100%",
          borderCollapse: "collapse",
          marginTop:"-20rem"
        }}
      >
   
    
        <div className={styles.h1Container}>
            <h1 style={{ fontSize: "1.5rem", color: "#2A337C", marginLeft:"-22rem" }}>
              Cadastro de produtos
            </h1>
          </div>
          <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "3rem",
        }}
      >
        <input
          type="text"
          placeholder="Pesquisar por produto..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            padding: "8px",
            margin: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "50dvw",
            marginBottom:"2rem"
          }}
        />
      </div>
        <main className="main">
          {error && <div style={{ color: "red" }}>{error}</div>}
      

          <div>
          
            <table className={styles.tableContainer}>
              <thead>
                <tr>
                  
                  <th style={{ width: "90vw" }}>produto</th>
                  <th style={{ width: "25vw" }}>Ações</th>
                </tr>
              </thead>
          <tbody>
                {filteredProducts &&
                  filteredProducts.map((product) => (
                    <tr className={styles.td} key={product._id}>
                      <td className={styles.td}>
                      <div className={styles.imageContainer}>
                      <img src={product.variations[0].urls[0]} alt="" style={{width:"10vw"}} /> 
                     
                      {product.name}
                      </div>
                      </td>
                      <td>
                        <div className={styles.spanContainer}>
                          <div
                            className={`${styles.container} ${styles.modalContainer}`}
                          >
                            {formData._id === product._id && (
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleUpdateProduct(product._id);
                                  // Clear the form after submission
                                  setFormData({
                                    _id: null,
                                    name: "",

                                    description: "",

                                    category: "",
                                    subcategory: "",
                                    variations: [
                                      {
                                        color: "", // Assuming color is a string
                                        urls: [], // Assuming urls is a string

                                        sizes: [
                                          {
                                            size: "",
                                            price: 0,
                                            quantityAvailable: 0,
                                            inStockSize: false,

                                          },
                                        ],
                                      },
                                    ],
                                    // ... other necessary fields
                                    // ... outros campos necessários
                                  });
                                }}
                              >
                                <div className={styles.modalOverlay}>
                                  <div className={styles.modalContent}>
                                    <button
                                      className={styles.closeButton}
                                      onClick={() => setIsModalOpen(false)}
                                    >
                                      <CloseIcon />
                                    </button>

                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label>
                                        Nome:
                                        <input
                                          type="text"
                                          name="name"
                                          value={formData.name}
                                          onChange={handleFormChange}
                                        />
                                      </label>

                                      <label className={styles.label}>
                                        Descrição:
                                        <input
                                          type="text"
                                          name="description"
                                          value={formData.description}
                                          onChange={handleFormChange}
                                          className={styles.description}
                                        />
                                      </label>

                                      <label>
                                        Categoria:
                                        <input
                                          type="text"
                                          name="category"
                                          value={formData.category}
                                          onChange={handleFormChange}
                                        />
                                      </label>
                                      <label>
                                        Subcategoria:
                                        <input
                                          type="text"
                                          name="subcategory"
                                          value={formData.subcategory}
                                          onChange={handleFormChange}
                                        />
                                      </label>
                                      <label htmlFor="">
                                        Produto em Estoque
                                      </label>
                                      <div>
                                        <select
                                          value={inStock ? "true" : "false"}
                                          onChange={(e) =>
                                            setInStock(
                                              e.target.value === "true"
                                            )
                                          }
                                        >
                                          <option value="true">Sim</option>
                                          <option value="false">Não</option>
                                        </select>
                                      </div>
                                      <button
                                        type="submit"
                                        className={styles.button}
                                      >
                                        Atualisar Produto
                                      </button>
                                    </div>

                                    <div
                                      style={{
                                        overflowX: "auto",
                                        maxHeight: "500px",
                                      }}
                                    >
                                      {formData.variations &&
                                        formData.variations.map(
                                          (variation, variationIndex) => (
                                            <div
                                              key={variationIndex}
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                margin: "0 10px",
                                                gap: "1rem",
                                                border: "2px solid #ddd",
                                                borderRadius: "5px",
                                                marginBottom: "4rem",
                                                padding: "3rem",
                                              }}
                                            >
                                              <div style={{ width: "20vw" }}>
                                                <label>
                                                  Cor:
                                                  <input
                                                    type="text"
                                                    name={`color-${variationIndex}`}
                                                    value={variation.color}
                                                    onChange={(e) =>
                                                      handleVariationChange(
                                                        variationIndex,
                                                        null, // ou algum valor para sizeIndex
                                                        "color",
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                </label>
                                              </div>

                                              <div style={{ width: "20vw" }}>
                                                <label>
                                                  URLs:
                                                  {variation.urls.map(
                                                    (url, index) => (
                                                      <div key={index}>
                                                        <img
                                                          src={url}
                                                          alt=""
                                                          style={{
                                                            width: "20vw",
                                                          }}
                                                        />
                                                        <input
                                                          type="text"
                                                          value={url}
                                                          onChange={(event) => {
                                                            const newUrls = [
                                                              ...variation.urls,
                                                            ];
                                                            newUrls[index] =
                                                              event.target.value;
                                                            handleVariationChange(
                                                              variationIndex,
                                                              null,
                                                              "urls",
                                                              newUrls
                                                            );
                                                          }}
                                                        />
                                                      </div>
                                                    )
                                                  )}
                                                </label>
                                              </div>

                                              {variation.sizes &&
                                                variation.sizes.map(
                                                  (size, sizeIndex) => (
                                                    <div
                                                      key={sizeIndex}
                                                      style={{
                                                        padding: "1rem",
                                                        borderRadius: "5px",
                                                        border:
                                                          "2px solid #ddd",
                                                      }}
                                                    >
                                                      <div
                                                        style={{
                                                          width: "20vw",
                                                        }}
                                                      >
                                                        <label>
                                                          Tamanho:
                                                          <input
                                                            type="text"
                                                            value={size.size}
                                                            onChange={(e) =>
                                                              handleVariationChange(
                                                                variationIndex,
                                                                sizeIndex,
                                                                "size",
                                                                e.target.value
                                                              )
                                                            }
                                                          />
                                                        </label>
                                                      </div>

                                                      <div
                                                        style={{
                                                          width: "20vw",
                                                        }}
                                                      >
                                                        <label>
                                                          Preço(R$):
                                                          <div
                                                            style={{
                                                              position:
                                                                "relative",
                                                            }}
                                                          >
                                                            <span
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                left: "10px",
                                                                top: "50%",
                                                                transform:
                                                                  "translateY(-50%)",
                                                              }}
                                                            >
                                                              R$
                                                            </span>
                                                            <input
                                                              type="number"
                                                              value={size.price}
                                                              onChange={(e) =>
                                                                handleVariationChange(
                                                                  variationIndex,
                                                                  sizeIndex,
                                                                  "price",
                                                                  parseFloat(
                                                                    e.target
                                                                      .value
                                                                  )
                                                                )
                                                              }
                                                              style={{
                                                                paddingLeft:
                                                                  "40px",
                                                              }}
                                                            />
                                                          </div>
                                                        </label>
                                                      </div>

                                                      <div
                                                        style={{
                                                          width: "20vw",
                                                        }}
                                                      >
                                                        <label>
                                                          Quantidade por
                                                          unidade:
                                                          <input
                                                            type="number"
                                                            value={
                                                              size.quantityAvailable
                                                            }
                                                            onChange={(e) =>
                                                              handleVariationChange(
                                                                variationIndex,
                                                                sizeIndex,
                                                                "quantityAvailable",
                                                                parseInt(
                                                                  e.target.value
                                                                )
                                                              )
                                                            }
                                                          />
                                                        </label>
                                                      </div>
                                                      <select
  name="inStockSize"
  value={formData.variations[0].sizes[0].inStockSize} // Use o valor do estado para selecionar a opção correta
  onChange={(e) =>
    handleVariationChange(0, 0, "inStockSize", e.target.value === "true")
  } // Converta o valor selecionado para booleano e passe para a função de mudança
>
  <option value={true}>Sim</option>
  <option value={false}>Não</option>
</select>

                                                    </div>
                                                  )
                                                )}
  
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: ".5rem",
                                                  color: "rgb(236, 62, 62)",
                                                }}
                                                onClick={() => {
                                                  setSelectedColor(
                                                    variation.color
                                                  ); // Atualiza a cor selecionada
                                                  handleClickOpenModal(); // Abre o modal de confirmação
                                                }}
                                              >
                                                <DeleteIcon style={{}} />
                                                <span
                                                  style={{ fontWeight: "600" }}
                                                >
                                                  Excluir Variação
                                                </span>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      {openModal && (
                                        <div className={styles.Modal}>
                                          <div
                                            ref={modalRef}
                                            className={styles.ModalContent}
                                          >
                                            <span
                                              className={styles.Close}
                                              onClick={handleClickCloseModal}
                                            >
                                              <CloseIcon />
                                            </span>
                                            <h1 style={{ fontSize: "1.5rem" }}>
                                              Essa ação e irreversível você quer
                                              Excluir essa Cor e todos os
                                              tamanhos?
                                            </h1>
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: "1.5rem",
                                                marginTop: "3rem",
                                              }}
                                            >
                                              <button
                                                onClick={() =>
                                                  handleDeleteVariation(
                                                    product._id,
                                                    selectedColor
                                                  )
                                                }
                                                style={{
                                                  backgroundColor: "#14337c",
                                                  color: "white",
                                                  border: "none",
                                                  cursor: "pointer",
                                                  width: "11vw",
                                                  padding: "1rem",
                                                  borderRadius: "5px",
                                                  fontSize: "1.2rem",
                                                }}
                                              >
                                                SIM
                                              </button>

                                              <button
                                                type="button"
                                                onClick={handleClickCloseModal}
                                                style={{
                                                  backgroundColor: "#14337c",
                                                  color: "white",
                                                  border: "none",
                                                  cursor: "pointer",
                                                  width: "11vw",
                                                  padding: "1rem",
                                                  borderRadius: "5px",
                                                  fontSize: "1.2rem",
                                                }}
                                              >
                                                NÃO
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      <AddVariationForm
                                        productId={product._id}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </form>
                            )}

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                              }}
                            >
                              <button
                                className={styles.buttonUpdate}
                                onClick={() => handleEditProduct(product)}
                              >
                                <img
                                  src="https://i.ibb.co/5R1QnT7/edit-1.png"
                                  alt=""
                                />
                                Editar
                              </button>

                              <div className={styles.deleteBtn}>
                                {!isModalOpen && !formData._id && (
                                  <>
                                    <span
                                      onClick={() =>
                                        handleDeleteProduct(product._id)
                                      }
                                      className={styles.span}
                                    ></span>
                                    <DeleteModal
                                      onDelete={() =>
                                        handleDeleteProduct(product._id)
                                      }
                                    />
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              {!isModalOpen && !formData._id && (
                <Pagination
                  count={isNaN(totalPages) ? 1 : totalPages}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="primary"
                  style={{
                    marginBottom: "1rem",
                    position: "sticky",
                    bottom: "0",
                    zIndex: "1",
                  }}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
