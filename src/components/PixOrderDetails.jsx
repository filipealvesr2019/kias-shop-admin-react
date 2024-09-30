import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useConfig } from '../context/ConfigContext';

const PixOrderDetails = () => {
    const [pix, setPix] = useState(null);
    const credentials = Cookies.get('role'); // Obtenha as credenciais do cookie

    const token = Cookies.get('token'); // Obtenha o token do cookie
    const { id } = useParams();
    const { apiUrl } = useConfig();

    useEffect(() => {
    
  
      // Requisição para detalhes do pix
      axios
        .get(`${apiUrl}/api/pix/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Credentials: credentials,
          },
        })
        .then((response) => {
          setPix(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Erro ao obter os detalhes do pix:", error);
        });
     
    }, [id]);
  
  return (
    <div>
         {pix && pix && (
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
                <th style={{ width: "40vw" }}>Tamanho</th>
                <th style={{ whiteSpace: "nowrap" }}>pagamento</th>
                <th style={{ width: "15vw" }}>Unidade</th>
              </tr>
            </thead>
            <tbody>
              {pix.products.map((order, prodIndex) => (
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
                    <p style={{
                         display:"flex",
                         alignItems:"center",
                         gap:".5rem"
                    }}>
                       {pix.billingType === "PIX" && (
                                  <img
                                    src="https://i.ibb.co/dfvK4s0/icons8-foto-48.png"
                                    alt=""
                                    style={{
                                      maxWidth: "14vw",
                                    }}
                                  />
                                )}

           

                    {pix.billingType }
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
              {pix.shippingFeeData && (
                <tr>
                  <img
                    src={pix.shippingFeeData.logo}
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
                    {pix.shippingFeeData.transportadora}
                  </td>
                  <td
                    style={{
                      borderLeft: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      padding: "1rem",
                    }}
                  >
                     R${pix.shippingFeeData.shippingFeePrice}
                  </td>
                  <td>{pix.trackingCode}</td>

                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}

export default PixOrderDetails