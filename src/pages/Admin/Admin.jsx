import React from "react";
import UserList from "../../components/UserList";
import "./Admin.css";
import AdminMenu from "../../components/AdminMenu";

export default function Admin() {
  return (
    <div className="AdminContainer">
      <div className="cadastro">
        <AdminMenu className="AdminMenu"></AdminMenu>
        <div className="table" />
        <div className="h1">
          <h1>Cadastro de Usuarios</h1>
        </div>
        <div className="list">
          <UserList></UserList>
        </div>
      </div>
    </div>
  );
}
