import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./CustomerDetails.module.css";
import Cookies from "js-cookie";
import { useConfig } from "../context/ConfigContext";

const CustomerDetails = () => {
  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({});

  const { customer: customerId } = useParams();
  const credentials = Cookies.get('role'); // Obtenha as credenciais do cookie
  const token = Cookies.get('token'); // Obtenha o token do cookie
  const { apiUrl } = useConfig();
  useEffect(() => {
    // Request for customer details
    axios
      .get(`${apiUrl}/api/customers/data/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Credentials: credentials,
        },
      })
      .then((response) => {
        const customerData = response.data.customers;
        setCustomer(customerData);
        setFormData(customerData); // Preencher o formulário com os dados do cliente
        console.log(customerData);
      })
      .catch((error) => {
        console.error("Error fetching customer details:", error);
      });
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      {customer && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "5rem",
          }}
        >
          <h1>Dados do cliente</h1>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className={styles.input}
          />
          <label htmlFor="cpfCnpj">CPF/CNPJ:</label>
          <input
            type="text"
            name="cpfCnpj"
            value={formData.cpfCnpj || ""}
            onChange={handleChange}
            className={styles.input}
          />
          <label htmlFor="mobilePhone">Telefone:</label>
          <input
            type="text"
            name="mobilePhone"
            value={formData.mobilePhone || ""}
            onChange={handleChange}
            className={styles.input}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className={styles.input}
          />
          <label htmlFor="postalCode">CEP:</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode || ""}
            onChange={handleChange}
            className={styles.input}
          />
          <label htmlFor="address">Endereço:</label>
          <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            className={styles.input}
          />
          <label htmlFor="addressNumber">Número da casa:</label>
          <input
            type="text"
            name="addressNumber"
            value={formData.addressNumber || ""}
            onChange={handleChange}
            className={styles.input}
          />
          <label htmlFor="complement">Complemento:</label>
          <input
            type="text"
            name="complement"
            value={formData.complement || ""}
            onChange={handleChange}
            className={styles.input}
          />
          <label htmlFor="province">Bairro:</label>
          <input
            type="text"
            name="province"
            value={formData.province || ""}
            onChange={handleChange}
            className={styles.input}
          />
          <label htmlFor="city">Cidade:</label>
          <input
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            className={styles.input}
          />
          <label htmlFor="state">Estado:</label>
          <input
            type="text"
            name="state"
            value={formData.state || ""}
            onChange={handleChange}
            className={styles.input}
            style={{ marginBottom: "5rem" }}
          />
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
