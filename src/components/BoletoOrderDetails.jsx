import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useConfig } from "../context/ConfigContext";

const BoletoOrderDetails = () => {
  const [boleto, setBoleto] = useState(null);
 
  const { id } = useParams();
  const credentials = Cookies.get('role'); // Obtenha as credenciais do cookie

  const token = Cookies.get('token'); // Obtenha o token do cookie
  const { apiUrl } = useConfig();

  useEffect(() => {
    // Requisição para detalhes do boleto
    axios
      .get(`${apiUrl}/api/boleto/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Credentials: credentials,
        },
      })
      .then((response) => {
        setBoleto(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Erro ao obter os detalhes do boleto:", error);
      });

   
  }, [id]);

  return (
    <div>
    
      {boleto && boleto && (
        <div>
         <h2 style={{ marginLeft: "4rem" }}>Detalhes do Pedido</h2>
         

          <table
            style={{
              margin: "0 auto",
              width: "90dvw",
              marginTop: "3rem",
              borderCollapse: "collapse",
              border: "1px solid #dddddd",
              marginBottom: "3rem",
            }}
          >
            <thead>
              <tr style={{ padding: "1rem" }}>
                <th style={{ padding: ".8rem", width: "15vw" }}>produtos</th>
                <th style={{ width: "40vw" }}>Nome</th>
                <th style={{ width: "40vw" }}>Tamanho</th>
                <th style={{ whiteSpace: "nowrap" }}>pagamento</th>
                <th style={{ width: "15vw" }}>Unidade</th>
              </tr>
            </thead>
            <tbody>
              {boleto.products && boleto.products.map((order, prodIndex) => (
                <tr key={prodIndex}>
                  <td
                    style={{
                      borderLeft: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      padding: "1rem",
                    }}
                  >
                    <img
                      src={order.image}
                      alt={`Produto ${order.productId}`}
                      style={{ width: "10vw" }}
                    />
                    <span>{order.name}</span>
                  </td>
                  <td
                    style={{
                      borderLeft: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      padding: "1rem",
                    }}
                  >
                    {order.name}
                  </td>
                  <td
                    style={{
                      borderLeft: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      padding: "1rem",
                    }}
                  >
                    {order.size}
                  </td>
                  <td
                    style={{
                      borderLeft: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      padding: "1rem",
                    
                    }}
                  >
                    <p    style={{
                    
                      display: "flex",
                      alignItems: "center",
                      gap: ".5rem",
                    }}>
                       {boleto.billingType === "BOLETO" && (
                                  <img
                                    src="https://i.ibb.co/LNrSsZt/icons8-boleto-bankario-48.png"
                                    alt=""
                                    style={{ maxWidth: "14vw" }}
                                  />
                                )}
                       {boleto.billingType}

                    </p>
                  </td>
                  <td
                    style={{
                      borderLeft: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      padding: "1rem",
                    }}
                  >
                    {order.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h1 style={{ marginLeft: "4rem" }}>frete do pedido</h1>

          <table
            style={{
              margin: "0 auto",
              width: "90dvw",
              marginTop: "3rem",
              borderCollapse: "collapse",
              border: "1px solid #dddddd",
              marginBottom: "3rem",
            }}
          >
            <thead>
              <tr style={{ padding: "1rem" }}>
              <th style={{ width: "15vw" }}>logo</th>
                <th style={{ padding: ".8rem", width: "15vw" }}>
                  transportadora
                </th>

           
                <th style={{ width: "40vw" }}>Preço do frete</th>
                <th>codigo de ratreio</th>
              </tr>
            </thead>
            <tbody>
              {boleto && boleto.shippingFeeData && (
                <tr>
                  <img
                    src={boleto.shippingFeeData.logo}
                    style={{
                      borderLeft: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      padding: "1rem",
                      width: "20vw",
                    }}
                  ></img>

                  <td
                    style={{
                      borderLeft: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      padding: "1rem",
                    }}
                  >
                    {boleto.shippingFeeData.transportadora}
                  </td>
                  <td
                    style={{
                      borderLeft: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      padding: "1rem",
                    }}
                  >
                    R${boleto.shippingFeeData.shippingFeePrice}
                  </td>
                  <td>{boleto.trackingCode}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
     
    </div>
  );
};

export default BoletoOrderDetails;