import React, { useRef, useEffect, useState } from "react";
import "./AdminPage.css";
import { useAuth } from "./context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import User from "./pages/Cadastros/User";
import Products from "./pages/Cadastros/Products";
import Categories from "./pages/Cadastros/Categories";
import Configuration from "./pages/Cadastros/Configuration";
import Sales from "./pages/Cadastros/Sales";
import Home from "./pages/Home/Home";
import Colors from "./pages/Cadastros/Colors/Colors";



const Content = ({ currentPage }) => {
  switch (currentPage) {
    case "register":
      return <RegisterPage />;
    case "User":
      return <User />;

    case "Products":
      return  <Products />;;
    case "categories":
      return <Categories />;
    case "Sales":
      return <Sales />;
      case "Colors":
        return <Colors />;
      
    case "settings":
      return <Configuration />;


    default:
      return <HomePage />;
  }
};

const HomePage = () => {
  return (
    <div style={{ marginTop: "5rem" }}>
      <Home />
    </div>
  );
};

const RegisterPage = () => {
  // Exemplo de inicialização, certifique-se de que esteja em algum lugar antes do uso
  const savedNavItem = localStorage.getItem("activeNavItem") || "0"; // Use "0" ou outro valor padrão desejado
  const [activeNavItem, setActiveNavItem] = useState(
    parseInt(savedNavItem, 10)
  );

  const handleClickOtherNavbar = (index) => {
    setActiveNavItem(index);
    localStorage.setItem("activeNavItem", index.toString());
  };

  const renderPage = () => {
    switch (activeNavItem) {
      case 0:
        return <User />;
      case 1:
        return <Products />;
      case 2:
        return <Categories />;
      case 3:
        return <Sales />;
      case 4:
        return <Colors />;
        case 5:
        return <Configuration />;
      default:
        return null;
    }
  };
  return (
    <div className="page-container">
      <div className="navContainer">
        <nav className="nav">
          <ul className="ul">
            <li
              className={`cadastros ${
                activeNavItem === 0 ? "active-item" : ""
              }`}
              onClick={() => handleClickOtherNavbar(0)}
            >
              Usuarios
            </li>
            <li
              className={`cadastros ${
                activeNavItem === 1 ? "active-item" : ""
              }`}
              onClick={() => handleClickOtherNavbar(1)}
            >
              Produtos
            </li>
            <li
              className={`cadastros ${
                activeNavItem === 2 ? "active-item" : ""
              }`}
              onClick={() => handleClickOtherNavbar(2)}
            >
              Categorias
            </li>
            <li
              className={`cadastros ${
                activeNavItem === 3 ? "active-item" : ""
              }`}
              onClick={() => handleClickOtherNavbar(3)}
            >
              Vendas
            </li>
            <li
              className={`cadastros ${
                activeNavItem === 4 ? "active-item" : ""
              }`}
              onClick={() => handleClickOtherNavbar(4)}
            >
              Configurações
            </li>
          </ul>
        </nav>
        <div className="content-container">{renderPage()}</div>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const { logout } = useAuth();
  const indicatorRef = useRef(null);

  // Exemplo de inicialização, certifique-se de que esteja em algum lugar antes do uso
  const savedNavItem = localStorage.getItem("activeNavItem") || 0; // ou qualquer outro valor padrão que você preferir
  const savedPage = localStorage.getItem("currentPage");

  const [currentPage, setCurrentPage] = useState("home");
  const [activeNavItem, setActiveNavItem] = useState(
    savedNavItem ? parseInt(savedNavItem) : null
  );
  const [activeLink, setActiveLink] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Obtendo todas as âncoras dentro do elemento nav
    const items = document.querySelectorAll("nav a");

    // Função para atualizar a posição e largura do indicador
    const marker = (e) => {
      indicatorRef.current.style.left = e.offsetLeft + "px";
      indicatorRef.current.style.width = e.offsetWidth + "px";
      setTimeout(
        () => (indicatorRef.current.style.transition = "left 0.5s ease"),
        100
      );
    };

    // Adicionando um event listener para cada âncora
    items.forEach((link) => {
      link.addEventListener("click", (e) => {
        marker(e.target);
      });
    });

    // Cleanup: removendo os event listeners quando o componente é desmontado
    return () => {
      items.forEach((link) => {
        link.removeEventListener("click", marker);
      });
    };
  }, [activeNavItem]); // O array vazio significa que este efeito só é executado após a montagem inicial do componente

  const handleClickOtherNavbar = (index) => {
    setActiveNavItem(index);
    localStorage.setItem("activeNavItem", index.toString());
  };

  const changePage = (page) => {
    setCurrentPage(page);
    localStorage.setItem("currentPage", page);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
    localStorage.setItem("currentPage", link);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  return (
    <div>
      <header>
        <div className="navbar">
          <div className="menu-icon" onClick={toggleMenu}>
            {isMenuOpen ? (
              <div>
                <CloseIcon
                  style={{
                    color: "white",
                    marginRight: "auto",
                    fontSize: "2rem",
                  }}
                />
              </div> // Ícone de fechar menu
            ) : (
              <div>
                <MenuIcon style={{ color: "white", fontSize: "2rem" }} />
              </div> // Ícone de três linhas
            )}
          </div>

          {/* Menu Navbar */}
          {isMenuOpen && (
            <div className="menu-items">
              <div className="mobileMenu">
                <a
                  href="#"
                  onClick={() => {
                    changePage("home");
                    handleLinkClick("home");
                    closeMenu();
                    // Adicione mais lógica, se necessário
                  }}
                  className={activeLink === "home" ? "active" : ""}
                >
                  Home
                </a>
                <a
                  href="#"
                  onClick={() => {
                    changePage("register");
                    handleLinkClick("register");
                    closeMenu();
                    // Adicione mais lógica, se necessário
                  }}
                  className={activeLink === "register" ? "active" : ""}
                >
                  Ecommerce
                </a>
                <a
            href="#"
            onClick={() => {
              changePage("physicalGoods");
              handleLinkClick("physicalGoods");
              // Adicione mais lógica, se necessário
            }}
            className={activeLink === "physicalGoods" ? "active" : ""}
          >
            Cadastros
          </a>
                <a
                  href="#"
                  onClick={() => {
                    changePage("financial");
                    handleLinkClick("financial");
                    closeMenu();
                    // Adicione mais lógica, se necessário
                  }}
                  className={activeLink === "produtos" ? "active" : ""}
                >
                  Financeiro
                </a>
                <a
                  href="#"
                  onClick={() => {
                    changePage("stock");
                    handleLinkClick("stock");
                    // Adicione mais lógica, se necessário
                  }}
                  className={activeLink === "stock" ? "active" : ""}
                >
                  Estoque
                </a>
                <a
                  href="#"
                  onClick={() => {
                    changePage("fiscal");
                    handleLinkClick("fiscal");
                    closeMenu();
                    // Adicione mais lógica, se necessário
                  }}
                  className={activeLink === "fiscal" ? "active" : ""}
                >
                  Fiscal
                </a>
                <a
                  href="#"
                  onClick={() => {
                    changePage("reports");
                    handleLinkClick("reports");
                    closeMenu();
                    // Adicione mais lógica, se necessário
                  }}
                  className={activeLink === "reports" ? "active" : ""}
                >
                  Relatórios
                </a>
              </div>
            </div>
          )}
        </div>
        <h1 href="#" className="logo" onClick={() => changePage("home")}>
          Painel Administrativo
        </h1>
        <nav className="nav">
          {/* Ref para a div do indicador */}
          <div ref={indicatorRef}></div>
          <a
            href="#"
            onClick={() => {
              changePage("home");
              handleLinkClick("home");
              // Adicione mais lógica, se necessário
            }}
            className={activeLink === "home" ? "active" : ""}
          >
            Home
          </a>
          {/* <a
            href="#"
            onClick={() => {
              changePage("register");
              handleLinkClick("register");
              // Adicione mais lógica, se necessário
            }}
            className={activeLink === "register" ? "active" : ""}
          >
            Ecommerce
          </a> */}


          
          <a
            href="#"
            onClick={() => {
              changePage("User");
              handleLinkClick("User");
              // Adicione mais lógica, se necessário
            }}
            className={activeLink === "User" ? "active" : ""}
          >
            Usuarios
          </a>
          <a
            href="#"
            onClick={() => {
              changePage("Products");
              handleLinkClick("Products");
              // Adicione mais lógica, se necessário
            }}
            className={activeLink === "Products" ? "active" : ""}
          >
            Produtos
          </a>
          <a
            href="#"
            onClick={() => {
              changePage("categories");
              handleLinkClick("categories");
              // Adicione mais lógica, se necessário
            }}
            className={activeLink === "categories" ? "active" : ""}
          >
            Categorias
          </a>
          <a
            href="#"
            onClick={() => {
              changePage("Sales");
              handleLinkClick("Sales");
              // Adicione mais lógica, se necessário
            }}
            className={activeLink === "Sales" ? "active" : ""}
          >
            Vendas

          </a>
          <a
            href="#"
            onClick={() => {
              changePage("Colors");
              handleLinkClick("Colors");
              // Adicione mais lógica, se necessário
            }}
            className={activeLink === "Colors" ? "active" : ""}
          >
            Cores

          </a>
          <a
            href="#"
            onClick={() => {
              changePage("settings");
              handleLinkClick("settings");
              // Adicione mais lógica, se necessário
            }}
            className={activeLink === "settings" ? "active" : ""}
          >
            Configurações
          </a>
        </nav>
      </header>
      <Content currentPage={currentPage} />
    </div>
  );
};

export default AdminPage;