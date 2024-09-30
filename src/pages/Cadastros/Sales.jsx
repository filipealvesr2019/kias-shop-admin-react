import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./Sales.module.css";
import BasicModal from "./BasicModal";
import Pagination from "@mui/material/Pagination";
import CircularIndeterminate from "./CircularIndeterminate";
import SearchIcon from "@mui/icons-material/Search";
import Cookies from "js-cookie";
import { useConfig } from "../../context/ConfigContext";

const Sales = () => {
  const [boletos, setBoletos] = useState([]);
  const [pix, setPix] = useState([]);
  const [creditCard, setCreditCard] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [pixSearchTerm, setPixSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const credentials = Cookies.get("role"); // Obtenha as credenciais do cookie

  const token = Cookies.get("token"); // Obtenha o token do cookie
  const { apiUrl } = useConfig();

  useEffect(() => {
    setLoading(true); // Define o estado de carregamento como true antes de fazer a chamada à API

    axios
      .get(`${apiUrl}/api/boletos?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Credentials: credentials,
        },
      })
      .then((response) => {
        setBoletos(response.data);

        setLoading(false); // Configura o estado de carregamento para false após receber os dados
      })
      .catch((error) => {
        console.error("Erro ao obter os boletos:", error);
      });

    axios
      .get(`${apiUrl}/api/pix?page=${page}&name=${pixSearchTerm}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Credentials: credentials,
        },
      })
      .then((response) => {
        setPix(response.data);
        console.log(response.data);
        setLoading(false); // Configura o estado de carregamento para false após receber os dados
      })
      .catch((error) => {
        console.error("Erro ao obter os pix:", error);
      });

    axios
      .get(`${apiUrl}/api/creditCard?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Credentials: credentials,
        },
      })
      .then((response) => {
        setCreditCard(response.data);
        console.log(response.data);
        setLoading(false); // Configura o estado de carregamento para false após receber os dados
      })
      .catch((error) => {
        console.error("Erro ao obter os pix:", error);
      });
  }, [page]);

  const handleSearchChange = (event) => {
    setPixSearchTerm(event.target.value);
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const renderFirstImage = (products) => {
    if (products.length > 0) {
      return (
        <img
          src={products[0].image}
          alt={`Produto ${products[0].productId}`}
          style={{ width: "5vw" }}
        />
      );
    } else {
      return null;
    }
  };

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const tabStyle = {
    color: "#2196F3",
  };

  const handlePixSearch = () => {
    setLoading(true); // Define o estado de carregamento como true antes de fazer a chamada à API

    // Realiza a pesquisa com base no termo de pesquisa (pixSearchTerm)
    axios
      .get(`${apiUrl}/api/pix?page=${page}&name=${pixSearchTerm}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Credentials: credentials,
        },
      })
      .then((response) => {
        // Atualiza o estado do componente com os resultados da pesquisa
        setPix(response.data);
        setLoading(false); // Define o estado de carregamento como false após receber os dados

        console.log("Resultados da pesquisa:", response.data);
      })
      .catch((error) => {
        console.error("Erro ao realizar a pesquisa:", error);
      });
  };

  const handleBoletoSearch = () => {
    setLoading(true); // Define o estado de carregamento como true antes de fazer a pesquisa

    // Realiza a pesquisa com base no termo de pesquisa (pixSearchTerm)
    axios
      .get(
        `${apiUrl}/api/boletos?page=${page}&name=${pixSearchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Credentials: credentials,
          },
        }
      )
      .then((response) => {
        // Atualiza o estado do componente com os resultados da pesquisa
        setBoletos(response.data);
        console.log("Resultados da pesquisa:", response.data);
        setLoading(false); // Define o estado de carregamento como false após receber os dados
      })
      .catch((error) => {
        console.error("Erro ao realizar a pesquisa:", error);
      });
  };

  const handleCreditCardSearch = () => {
    setLoading(true); // Define o estado de carregamento como true antes de fazer a chamada à API

    // Realiza a pesquisa com base no termo de pesquisa (pixSearchTerm)
    axios
      .get(
        `${apiUrl}/api/creditCard?page=${page}&name=${pixSearchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Credentials: credentials,
          },
        }
      )
      .then((response) => {
        // Atualiza o estado do componente com os resultados da pesquisa
        setCreditCard(response.data);
        console.log("Resultados da pesquisa:", response.data);
        setLoading(false); // Define o estado de carregamento como false após receber os dados
      })
      .catch((error) => {
        console.error("Erro ao realizar a pesquisa:", error);
      });
  };

  const handleBoletoKeyDown = (event) => {
    if (event.key === "Enter") {
      handleBoletoSearch(); // Chama a função de pesquisa quando a tecla "Enter" for pressionada
    }
  };
  const handleCreditCardKeyDown = (event) => {
    if (event.key === "Enter") {
      handleCreditCardSearch(); // Chama a função de pesquisa quando a tecla "Enter" for pressionada
    }
  };
  const handlePixKeyDown = (event) => {
    if (event.key === "Enter") {
      handlePixSearch(); // Chama a função de pesquisa quando a tecla "Enter" for pressionada
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Os meses são baseados em zero
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex", // Centraliza horizontalmente
        justifyContent: "center", // Centraliza horizontalmente
        alignItems: "center", // Centraliza verticalmente
        gap: "1rem",
        marginTop: "8rem",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50px",
          margin: "0 auto",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              fontSize: "1.2rem",
              fontWeight: "500",
              fontFamily: "poppins",
              margin: "0 auto",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <span
              style={activeTab === 0 ? tabStyle : {}}
              onClick={() => handleTabClick(0)}
            >
              Pix
            </span>
            <span
              style={activeTab === 1 ? tabStyle : {}}
              onClick={() => handleTabClick(1)}
            >
              Boleto
            </span>
            <span
              style={activeTab === 2 ? tabStyle : {}}
              onClick={() => handleTabClick(2)}
            >
              Cartão de Crédito
            </span>
          </div>
          <div className={styles.tabContent}>
            {activeTab === 0 && (
              <div>
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "10rem",
                    }}
                  >
                    <CircularIndeterminate />;
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        width: "30vw",
                        top: "4rem",
                        left: "50rem",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Pesquisar por nome do cliente..."
                        value={pixSearchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handlePixKeyDown}
                        style={{ width: "100%", paddingRight: "2rem" }} // Adiciona um padding à direita para acomodar o ícone de pesquisa
                      />
                      <SearchIcon
                        onClick={handlePixSearch}
                        style={{
                          position: "absolute",
                          right: "0.5rem", // Define a posição do ícone em relação à direita do input
                          color: "#707070",
                          cursor: "pointer", // Adiciona um estilo de cursor para indicar que o ícone é clicável
                        }}
                      />
                    </div>
                    <table
                      style={{
                        position: "relative",
                        width: "90vw",
                        marginTop: "5rem",
                      }}
                    >
                      <thead>
                        <tr>
                          <th className={styles.th}>Produtos</th>
                          <th className={styles.th}>Status</th>
                          <th className={styles.th}>Cliente</th>
                          <th className={styles.th}>Data</th>

                          <th className={styles.th}>Pagamento</th>
                          <th className={styles.th}>Parcelas</th>
                          <th className={styles.th}>Quantidade</th>
                          <th className={styles.th}>Total</th>
                          <th className={styles.th}>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pix.map((order, index) => (
                          <tr key={order._id}>
                            <td>
                              <Link to={`/pix/${order._id}`}>
                                {renderFirstImage(order.products)}
                              </Link>
                            </td>
                            <td>
                              <p
                                className={`${styles.status} ${
                                  styles[order.status.toLowerCase()]
                                }`}
                              >
                                {(() => {
                                  switch (order.status) {
                                    case "RECEIVED":
                                      return "pago";
                                    case "CONFIRMED":
                                      return "Cobrança confirmada";
                                    case "PENDING":
                                      return "Pendente";
                                    case "OVERDUE":
                                      return "Cobrança vencida";
                                    default:
                                      return;
                                  }
                                })()}
                              </p>
                            </td>
                            <td>
                              <Link
                                to={`/customers/data/${order.customer}`}
                                className={styles.link}
                              >
                                <span className={styles.span}>
                                  {order.name}
                                </span>
                              </Link>
                            </td>
                            <td>
                              <span className={styles.span}>
                                {formatDate(order.createdAt)}
                              </span>
                            </td>
                            <td>
                              <p
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: ".5rem",
                                }}
                              >
                                {order.billingType === "PIX" && (
                                  <img
                                    src="https://i.ibb.co/dfvK4s0/icons8-foto-48.png"
                                    alt=""
                                    style={{
                                      maxWidth: "14vw",
                                    }}
                                  />
                                )}
                                {order.billingType === "BOLETO" && (
                                  <img
                                    src="https://i.ibb.co/LNrSsZt/icons8-boleto-bankario-48.png"
                                    alt=""
                                    style={{ maxWidth: "14vw" }}
                                  />
                                )}

                                {order.billingType === "CREDIT_CARD" && (
                                  <img
                                    src="https://i.ibb.co/HtWhHR0/icons8-emoji-de-cart-o-de-cr-dito-48.png"
                                    alt=""
                                  />
                                )}
                                {order.billingType}
                              </p>
                            </td>
                            <td>0</td>
                            <td>
                              <span style={{ marginLeft: "2rem" }}>
                                {order.totalQuantity}
                              </span>{" "}
                            </td>
                            <td>
                              {" "}
                              <span style={{ marginLeft: "2rem" }}>
                                R${order.value.toFixed(2)}
                              </span>{" "}
                            </td>
                            <td>
                              {" "}
                              <span>
                                <BasicModal
                                  orderId={order._id}
                                  tracking={order.trackingCode}
                                />
                              </span>{" "}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Pagination
                      count={10} // Número total de páginas
                      page={page} // Página atual
                      onChange={handleChange} // Função para manipular a mudança de página
                      color="primary"
                      style={{ marginTop: "2rem", marginBottom: " 2rem" }}
                    />
                  </>
                )}
              </div>
            )}

            {activeTab === 1 && (
              <div>
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "10rem",
                    }}
                  >
                    <CircularIndeterminate />;
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        width: "30vw",
                        top: "4rem",
                        left: "50rem",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Pesquisar por nome do cliente..."
                        value={pixSearchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleBoletoKeyDown}
                        style={{ width: "100%", paddingRight: "2rem" }} // Adiciona um padding à direita para acomodar o ícone de pesquisa
                      />
                      <SearchIcon
                        onClick={handleBoletoSearch}
                        style={{
                          position: "absolute",
                          right: "0.5rem", // Define a posição do ícone em relação à direita do input
                          color: "#707070",
                          cursor: "pointer", // Adiciona um estilo de cursor para indicar que o ícone é clicável
                        }}
                      />
                    </div>
                    {loading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "10rem",
                        }}
                      >
                        <CircularIndeterminate />;
                      </div>
                    ) : (
                      <></>
                    )}
                    <table
                      style={{
                        position: "relative",
                        width: "90vw",
                        marginTop: "5rem",
                      }}
                    >
                      <thead>
                        <tr>
                          <th className={styles.th}>Produtos</th>
                          <th className={styles.th}>Status</th>
                          <th className={styles.th}>Cliente</th>
                          <th className={styles.th}>Data</th>

                          <th className={styles.th}>Pagamento</th>
                          <th className={styles.th}>Parcelas</th>
                          <th className={styles.th}>Quantidade</th>
                          <th className={styles.th}>Total</th>
                          <th className={styles.th}>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {boletos.map((order, index) => (
                          <tr key={order._id}>
                            <td>
                              <Link to={`/boleto/${order._id}`}>
                                {renderFirstImage(order.products)}
                              </Link>
                            </td>
                            <td>
                              <p
                                className={`${styles.status} ${
                                  styles[order.status.toLowerCase()]
                                }`}
                              >
                                {(() => {
                                  switch (order.status) {
                                    case "RECEIVED":
                                      return "pago";
                                    case "CONFIRMED":
                                      return "Cobrança confirmada";
                                    case "PENDING":
                                      return "Pendente";
                                    case "OVERDUE":
                                      return "Cobrança vencida";
                                    default:
                                      return;
                                  }
                                })()}
                              </p>
                            </td>
                            <td>
                              <Link
                                to={`/customers/data/${order.customer}`}
                                className={styles.link}
                              >
                                <span className={styles.span}>
                                  {order.name}
                                </span>
                                {console.log("Customer ID:", order.customer)}
                              </Link>
                            </td>
                            <td>
                              <span className={styles.span}>
                                {formatDate(order.createdAt)}
                              </span>
                            </td>

                            <td>
                              <p
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: ".5rem",
                                }}
                              >
                                {order.billingType === "PIX" && (
                                  <img
                                    src="https://i.ibb.co/dfvK4s0/icons8-foto-48.png"
                                    alt=""
                                    style={{
                                      maxWidth: "14vw",
                                    }}
                                  />
                                )}
                                {order.billingType === "BOLETO" && (
                                  <img
                                    src="https://i.ibb.co/LNrSsZt/icons8-boleto-bankario-48.png"
                                    alt=""
                                    style={{ maxWidth: "14vw" }}
                                  />
                                )}

                                {order.billingType === "CREDIT_CARD" && (
                                  <img
                                    src="https://i.ibb.co/HtWhHR0/icons8-emoji-de-cart-o-de-cr-dito-48.png"
                                    alt=""
                                  />
                                )}
                                {order.billingType}
                              </p>
                            </td>
                            <td>0</td>
                            <td>
                              <span style={{ marginLeft: "2rem" }}>
                                {order.totalQuantity}
                              </span>{" "}
                            </td>
                            <td>
                              {" "}
                              <span style={{ marginLeft: "2rem" }}>
                                R${order.value.toFixed(2)}
                              </span>{" "}
                            </td>
                            <td>
                              {" "}
                              <span>
                                <BasicModal
                                  orderId={order._id}
                                  tracking={order.trackingCode}
                                />
                              </span>{" "}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Pagination
                      count={10} // Número total de páginas
                      page={page} // Página atual
                      onChange={handleChange} // Função para manipular a mudança de página
                      color="primary"
                      style={{ marginTop: "2rem", marginBottom: " 2rem" }}
                    />{" "}
                  </>
                )}
              </div>
            )}

            {activeTab === 2 && (
              <div>
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "10rem",
                    }}
                  >
                    <CircularIndeterminate />;
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        width: "30vw",
                        top: "4rem",
                        left: "50rem",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Pesquisar por nome do cliente..."
                        value={pixSearchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleCreditCardKeyDown}
                        style={{ width: "100%", paddingRight: "2rem" }} // Adiciona um padding à direita para acomodar o ícone de pesquisa
                      />
                      <SearchIcon
                        onClick={handleCreditCardSearch}
                        style={{
                          position: "absolute",
                          right: "0.5rem", // Define a posição do ícone em relação à direita do input
                          color: "#707070",
                          cursor: "pointer", // Adiciona um estilo de cursor para indicar que o ícone é clicável
                        }}
                      />
                    </div>
                    <table
                      style={{
                        position: "relative",
                        width: "90vw",
                        marginTop: "5rem",
                      }}
                    >
                      <thead>
                        <tr>
                          <th className={styles.th}>Produtos</th>
                          <th className={styles.th}>Status</th>
                          <th className={styles.th}>Cliente</th>
                          <th className={styles.th}>Data</th>

                          <th className={styles.th}>Pagamento</th>
                          <th className={styles.th}>Parcelas</th>
                          <th className={styles.th}>Quantidade</th>
                          <th className={styles.th}>Total</th>
                          <th className={styles.th}>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {creditCard.map((order, index) => (
                          <tr key={index}>
                            <td>
                              <Link to={`/creditCard/${order._id}`}>
                                {renderFirstImage(order.products)}
                              </Link>
                            </td>
                            <td>
                              <p
                                className={`${styles.status} ${
                                  styles[order.status.toLowerCase()]
                                }`}
                              >
                                {(() => {
                                  switch (order.status) {
                                    case "RECEIVED":
                                      return "pago";
                                    case "CONFIRMED":
                                      return "Cobrança confirmada";
                                    case "PENDING":
                                      return "Pendente";
                                    case "OVERDUE":
                                      return "Cobrança vencida";
                                    default:
                                      return;
                                  }
                                })()}
                              </p>
                            </td>
                            <td>
                              <Link
                                to={`/customers/data/${order.customer}`}
                                className={styles.link}
                              >
                                {order.name}
                              </Link>
                            </td>
                            <td>
                              <span className={styles.span}>
                                {formatDate(order.createdAt)}
                              </span>
                            </td>
                            <td>
                              <p
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: ".5rem",
                                }}
                              >
                                {order.billingType === "PIX" && (
                                  <img
                                    src="https://i.ibb.co/dfvK4s0/icons8-foto-48.png"
                                    alt=""
                                    style={{
                                      maxWidth: "14vw",
                                    }}
                                  />
                                )}
                                {order.billingType === "BOLETO" && (
                                  <img
                                    src="https://i.ibb.co/LNrSsZt/icons8-boleto-bankario-48.png"
                                    alt=""
                                    style={{ maxWidth: "14vw" }}
                                  />
                                )}

                                {order.billingType === "CREDIT_CARD" && (
                                  <img
                                    src="https://i.ibb.co/HtWhHR0/icons8-emoji-de-cart-o-de-cr-dito-48.png"
                                    alt=""
                                  />
                                )}
                                {order.billingType === "CREDIT_CARD" &&
                                  "Cartão de Crédito"}
                              </p>
                            </td>
                            <td>{order.installmentNumber}</td>
                            <td>
                              {" "}
                              <span style={{ marginLeft: "2rem" }}>
                                {order.totalQuantity}
                              </span>
                            </td>
                            <td>
                              {" "}
                              <span style={{ marginLeft: "2rem" }}>
                                R${order.value.toFixed(2)}
                              </span>{" "}
                            </td>
                            <td>
                              {" "}
                              <span>
                                <BasicModal
                                  orderId={order._id}
                                  tracking={order.trackingCode}
                                />
                              </span>{" "}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Pagination
                      count={10} // Número total de páginas
                      page={page} // Página atual
                      onChange={handleChange} // Função para manipular a mudança de página
                      color="primary"
                      style={{ marginTop: "2rem", marginBottom: " 2rem" }}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
