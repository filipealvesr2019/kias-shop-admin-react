import React, { useState, useEffect } from "react";
import { Button } from '@mui/joy';
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import axios from "axios";
import "./ModalProducts.css";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Label } from "recharts";
const CreateProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [inStock, setInStock] = useState(false);

  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
    sizes: [], // Change from size to sizes
    category: "",
    subcategory: "",
    quantity: 0,
    variations: [], // Array de variações (cores e imagens)
    imageFiles: [], // Novo campo para arquivos de imagem
    colorPickerOpen: false,
    colorPortuguese: "",
    imageUrls: [],
    color: "",
    quantityAvailable: "",
    size: "",
    price: "",
    inStock: true || false, // Defina inStock como false por padrão
  });
  const handleInStockChange = (event) => {
    const value = event.target.value === "true" || event.target.value; // Converte a string recebida para booleano
    setInStock(value);
  };

  // Novo estado para rastrear os erros
  const [formErrors, setFormErrors] = useState({});

  // // Função para verificar se há campos obrigatórios não preenchidos
  // const validateForm = () => {
  //   const errors = {};

  //   if (!productInfo.name.trim()) {
  //     errors.name = "O nome do produto é obrigatório.";
  //   }
  //   if (productInfo.price <= 0) {
  //     errors.price = "O preço deve ser maior que zero.";
  //   }
  //   if (!productInfo.description.trim()) {
  //     errors.description = "A descrição do produto é obrigatória.";
  //   }
  //   if (!(productInfo.quantity > 0)) {
  //     errors.quantity = "A quantidade deve ser maior que zero.";
  //   }
  //   if (productInfo.sizes.length === 0) {
  //     errors.size = "Pelo menos um tamanho deve ser selecionado.";
  //   }
  //   if (!productInfo.colorPortuguese.trim()) {
  //     errors.colorPortuguese = "A cor em português é obrigatória.";
  //   }
  //   if (productInfo.imageUrl.length === 0) {
  //     errors.imageUrl = "A URL da imagem é obrigatória.";
  //   }
  //   if (productInfo.variations.length === 0) {
  //     errors.variations = "Pelo menos uma variação deve ser adicionada.";
  //   }
  //   if (!productInfo.category) {
  //     errors.category = "A categoria é obrigatória.";
  //   }
  //   if (!productInfo.subcategory) {
  //     errors.subcategory = "A subcategoria é obrigatória.";
  //   }

  //   setFormErrors(errors);

  //   // Retorna verdadeiro se não houver erros
  //   return Object.keys(errors).length === 0;
  // };

  useEffect(() => {
    // Carregar categorias ao montar o componente
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/categories");
      const { success, categories } = response.data;

      if (success) {
        if (Array.isArray(categories)) {
          setCategories(categories);
        } else {
          console.error("Os dados recebidos não são uma matriz:", categories);
        }
      } else {
        console.error(
          "A solicitação para obter categorias não foi bem-sucedida."
        );
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error.message);
    }
  };

  const handleCategoryChange = async (event) => {
    const categoryName = event.target.value;
    setProductInfo((prevProductInfo) => ({
      ...prevProductInfo,
      category: categoryName,
      subcategory: "", // Resetar a subcategoria quando a categoria for alterada
    }));

    try {
      // Obter subcategorias com base no nome da categoria selecionada
      const subcategoryResponse = await axios.get(
        `http://localhost:3001/api/admin/subcategories?categoryName=${encodeURIComponent(
          categoryName
        )}`
      );
      const subcategoryData = subcategoryResponse.data;

      if (subcategoryData && Array.isArray(subcategoryData.subcategories)) {
        const subcategoriesArray = subcategoryData.subcategories;
        console.log("Subcategorias recebidas:", subcategoriesArray);
        setSubcategories(subcategoriesArray);
      } else {
        console.error(
          "Os dados recebidos não são uma matriz:",
          subcategoryData
        );
      }
    } catch (error) {
      console.error("Erro ao buscar subcategorias:", error);
    }
  };

  const handleAddVariation = () => {
    const { color, imageUrls, sizes, quantityAvailable, price } = productInfo;

    console.log(
      "Color and Image URLs before adding variation:",
      color,
      imageUrls
    );

    // Verificar se todas as URLs da imagem estão preenchidas
    if (color && imageUrls.every((url) => url) && sizes.every((size) => size)) {
      // Continuar com o processamento, como adicionar cor e URL à sua lista de variações

      // Exemplo: Adicionar à lista de variações
      setProductInfo((prevProductInfo) => {
        const updatedVariations = [
          ...prevProductInfo.variations,
          { color, urls: imageUrls, quantityAvailable, sizes, price },
        ];
        return {
          ...prevProductInfo,
          color: "",
          imageUrls: [], // Limpar as URLs da imagem após adicionar a variação
          quantityAvailable: "",
          sizes: [],
          price: "",
          variations: updatedVariations,
        };
      });

      // Exibir mensagem de sucesso
      toast.success("Cor e imagens adicionadas com sucesso!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    } else {
      console.error("Color or image URLs are empty");
    }
  };

  // Update the handleInputChange function to handle the size input
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setProductInfo((prevProductInfo) => ({
      ...prevProductInfo,
      [name]: value,
    }));

    // Handle size input separately
    if (name === "size") {
      console.log("Setting size:", value);
    }

    // Handle color input separately
    if (name === "colorPortuguese") {
      // Update the state for the color
      setProductInfo((prevProductInfo) => ({
        ...prevProductInfo,
        color: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Verificar se há pelo menos uma variação
    if (productInfo.variations.length === 0) {
      toast.error("Adicione pelo menos uma variação antes de criar o produto.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      return; // Não prosseguir com a submissão do formulário
    }
  
    try {
      const { sizes, inStock, ...productData } = productInfo;
      productData.size = sizes.join(", "); // Certifique-se de que você está usando 'size' e não 'sizes'
      productData.inStock = inStock; // Adicione isso ao objeto productData
  
      const token = Cookies.get("token"); // Obtenha o token do cookie
      const credentials = Cookies.get("role"); // Obtenha as credenciais do cookie
      console.log("Token:", token);
  
      // Enviar os dados do produto para o servidor para processamento
      const response = await axios.post(
        "http://localhost:3001/api/admin/product/new",
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Credentials: credentials,
          },
        }
      );
  
      if (response.status === 201) {
        setProductInfo({
          name: "",
          price: 0.0,
          description: "",
          sizes: sizes,
          category: "",
          subcategory: "",
          quantity: 0,
          variations: [],
          imageUrl: "", // Limpar a URL da imagem
        });
  
        console.log("Produto criado com sucesso");
  
        // Configuração para exibir a mensagem de sucesso
        toast.success("Produto criado com sucesso!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      } else {
        // Tratar o caso em que o servidor retorna um status de erro
        console.error("Erro ao criar produto!:", response.statusText);
  
        // Exibir uma mensagem de erro
        toast.error("Erro ao criar produto. Tente novamente mais tarde.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      }
    } catch (error) {
      // Tratar erros de rede ou inesperados
      console.error("Erro ao criar produto:", error.message);
  
      // Exibir uma mensagem de erro
      toast.error("Erro inesperado. Tente novamente mais tarde.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    }
  };
  

  const handleSubcategoryChange = (event) => {
    const subcategoryName = event.target.value;
    setProductInfo((prevProductInfo) => ({
      ...prevProductInfo,
      subcategory: subcategoryName,
    }));
  };

  const handleImageUrlsChange = (event, index) => {
    const { value } = event.target;

    // Atualizar a URL da imagem no estado
    setProductInfo((prevProductInfo) => {
      const updatedUrls = [...prevProductInfo.imageUrls];
      updatedUrls[index] = value;
      return {
        ...prevProductInfo,
        imageUrls: updatedUrls,
      };
    });
  };

  const handleAddImageUrlField = () => {
    setProductInfo((prevProductInfo) => ({
      ...prevProductInfo,
      imageUrls: [...prevProductInfo.imageUrls, ""], // Adiciona um novo campo vazio para a URL da imagem
    }));
  };

  const handleRemoveImageUrlField = (index) => {
    setProductInfo((prevProductInfo) => {
      const updatedUrls = [...prevProductInfo.imageUrls];
      updatedUrls.splice(index, 1); // Remove o campo de URL da imagem com o índice fornecido
      return {
        ...prevProductInfo,
        imageUrls: updatedUrls,
      };
    });
  };

  // Atualização da função handleSizeInputChange
  // Atualização da função handleSizeInputChange
  const handleSizeInputChange = (event, index) => {
    const { name, value } = event.target;

    // Atualizar o tamanho no estado
    setProductInfo((prevProductInfo) => {
      const updatedSizes = [...prevProductInfo.sizes];
      // Verificar se o índice está dentro do intervalo
      if (index >= 0 && index < updatedSizes.length) {
        // Verificar se o objeto de tamanho está inicializado corretamente
        if (!updatedSizes[index]) {
          updatedSizes[index] = {
            size: "",
            price: 0,
            quantityAvailable: 0,
          };
        }
        // Atualizar o valor do campo específico
        updatedSizes[index][name] = name === 'size' ? value.trim() : value;
      }
      return {
        ...prevProductInfo,
        sizes: updatedSizes,
      };
    });
  };

  const handleAddSizeField = () => {
    setProductInfo((prevProductInfo) => ({
      ...prevProductInfo,
      sizes: [...prevProductInfo.sizes, ""], // Adiciona um novo campo vazio para a URL da imagem
    }));
  };
  // Modificação da função handleRemoveSizeField
  const handleRemoveSizeField = (index) => {
    setProductInfo((prevProductInfo) => {
      const updatedSizes = [...prevProductInfo.sizes];
      updatedSizes.splice(index, 1); // Remover o tamanho com o índice fornecido
      return {
        ...prevProductInfo,
        sizes: updatedSizes,
      };
    });
  };
  // ...
  return (
    <form onSubmit={handleSubmit}>
      {formErrors.variations && (
        <Typography variant="caption" color="error">
          {formErrors.variations}
        </Typography>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Grid container spacing={2}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "20vw",
            }}
          >
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome do Produto"
                variant="outlined"
                fullWidth
                name="name"
                value={productInfo.name}
                onChange={handleInputChange}
                error={formErrors.name !== undefined}
                helperText={formErrors.name}
                InputProps={{
                  style: { marginTop: "10px" },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Descrição"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                name="description"
                value={productInfo.description}
                onChange={handleInputChange}
                error={formErrors.description !== undefined}
                helperText={formErrors.description}
                InputProps={{
                  style: { marginTop: "10px", maxWidth: 300 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Categoria</InputLabel>
                <Select
                  label="Categoria"
                  value={productInfo.category}
                  onChange={handleCategoryChange}
                  error={formErrors.category !== undefined}
                  helperText={formErrors.category}
                  InputProps={{}}
                  sx={{
                    marginTop: "10px",
                    width: "15vw",
                  }}
                >
                  <MenuItem value="" disabled>
                    Escolha uma categoria
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ width: "30vw" }}>Subcategoria</InputLabel>
                <Select
                  label="Subcategoria"
                  value={productInfo.subcategory}
                  onChange={handleSubcategoryChange}
                  error={formErrors.subcategory !== undefined}
                  helperText={formErrors.subcategory}
                  InputProps={{}}
                  sx={{
                    marginTop: "10px",
                    width: "15vw",
                  }}
                >
                  <MenuItem value="" disabled>
                    Escolha uma subcategoria
                  </MenuItem>
                  {subcategories.map((subcategory) => (
                    <MenuItem key={subcategory._id} value={subcategory.name}>
                      {subcategory.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Box sx={{ marginTop: "10px", minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Produto em Estoque?
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={inStock ? "true" : "false"} // Defina o valor selecionado com base no estado inStock
                  onChange={handleInStockChange}
                >
                  <MenuItem value={"true"}>SIM</MenuItem> // Defina os valores
                  das opções como strings 'true' e 'false'
                  <MenuItem value={"false"}>NÃO</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
        </Grid>

        <div
          style={{
            maxHeight: "calc(100vh - 200px)",
            overflowY: "scroll",
            width: "45vw",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                borderRadius: "5px",
                padding: "2rem",

                border: "2px solid rgb(221, 221, 221)",
              }}
            >
              <Grid item xs={12} sm={6}>
                <label>Adicionar cor e foto</label>
                <TextField
                  label="Cor em Português"
                  variant="outlined"
                  fullWidth
                  name="colorPortuguese"
                  value={productInfo.color}
                  onChange={handleInputChange}
                  error={formErrors.colorPortuguese !== undefined}
                  helperText={formErrors.colorPortuguese}
                  InputProps={{
                    style: {
                      marginTop: "10px",
                    },
                  }}
                  sx={{
                    width: "15vw",
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                {productInfo.imageUrls &&
                  productInfo.imageUrls.map((url, index) => (
                    <div
                      key={index}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <TextField
                        label={`URL da Imagem ${index + 1}`}
                        variant="outlined"
                        fullWidth
                        value={url}
                        onChange={(event) =>
                          handleImageUrlsChange(event, index)
                        }
                        InputProps={{
                          style: { marginTop: "10px" },
                        }}
                        sx={{
                          width: "15vw",
                        }}
                      />
                      <RemoveIcon
                        onClick={() => handleRemoveImageUrlField(index)}
                      >
                        Remover
                      </RemoveIcon>
                    </div>
                  ))}
              </Grid>
              <div
                style={{
                  display: "flex",
                  alignItems:"center",
                  width: "15vw",
                  cursor:"pointer"
                }}
              >
                <AddIcon onClick={handleAddImageUrlField}></AddIcon> <span onClick={handleAddImageUrlField}>Adicionar Imagem</span>
              </div>
            </div>
          </div>
          {productInfo.sizes.map((size, index) => (
            <div key={index} style={{ marginBottom: "10px", marginTop:"2rem", display:"flex", flexDirection:"row" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Preço(R$)"
                    variant="outlined"
                    fullWidth
                    type="number"
                    name="price"
                    value={`${size.price}`}
                    onChange={(event) => handleSizeInputChange(event, index)}
                    InputProps={{ style: { marginTop: "10px", width: "15vw"  } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Quantidade por unidade"
                    variant="outlined"
                    fullWidth
                    name="quantityAvailable"
                    value={size.quantityAvailable}
                    onChange={(event) => handleSizeInputChange(event, index)}
                    error={formErrors.colorPortuguese !== undefined}
                    helperText={formErrors.colorPortuguese}
                    InputProps={{ style: { marginTop: "10px" } }}
                    sx={{ width: "15vw" }}
                  />
                </Grid>
                <div style={{
                  display:"flex",
                  alignItems:"center",
                  gap:"1rem",
                  marginLeft:"1rem"
                }}>
                <Grid item xs={12}>
                  <TextField
                    label="Tamanho"
                    variant="outlined"
                    fullWidth
                    name="size"
                    value={ size.size && size.size}
                    onChange={(event) => handleSizeInputChange(event, index)}
                    error={formErrors.colorPortuguese !== undefined}
                    helperText={formErrors.colorPortuguese}
                    InputProps={{ style: { marginTop: "10px" } }}
                    sx={{ width: "15vw" }}
                  />
                </Grid>
                <Button
                onClick={() => handleRemoveSizeField(index)}
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#DC143C",
                  color: "white",
                  border: "none",
                  padding: ".5rem",
                  borderRadius: "1rem",
                  fontFamily: "poppins",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontSize: ".8rem",
                  whiteSpace: "nowrap",
                  marginTop: "10px",
                }}
              >
                Remover
              </Button>
                </div>
            
                <Grid item xs={12} sm={6}></Grid>
              </Grid>
            
            </div>
          ))}
          <div
            style={{
              width: "5vw",
            }}
          ></div>
          <div style={{
            display:"flex",
            alignItems:"center",
            cursor:"pointer"
          }}>
          <AddIcon onClick={handleAddSizeField}></AddIcon> <span onClick={handleAddSizeField}>Adicionar Tamanho</span>  


          </div>
          <Grid
            item
            xs={12}
            sm={6}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <Button
              onClick={handleAddVariation}
              style={{
                backgroundColor: "#14337C",
                color: "white",
                border: "none",
                padding: ".5rem",
                borderRadius: "1rem",
                width: "15dvw",
                fontFamily: "poppins",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: ".8rem",
                whiteSpace: "nowrap",
                marginTop: "1.3rem",
              }}
            >
              Adicionar Variação
            </Button>
          </Grid>
        </div>
      </div>

      <Button
        style={{
          backgroundColor: productInfo.variations.length > 0 ? "#185ea5" : "#ccc",
          color: "white",
          border: "none",
          padding: ".5rem",
          borderRadius: "1rem",
          width: "12dvw",
          fontFamily: "poppins",
          fontWeight: 500,
          cursor: productInfo.variations.length > 0 ? "pointer" : "not-allowed",
          fontSize: ".8rem",
          marginTop: "5rem",
        }}
        type="submit"
        disabled={productInfo.variations.length === 0}

      >
        Criar Produto
      </Button>
    </form>
  );
};

export default function BasicModal() {
  const [open, setOpen] = useState(false);
  const [inStock, setInStock] = useState(false); // Adicione o estado inStock e sua função de atualização

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    setInStock(productInfo.inStock); // Inicialize o estado inStock com base no valor atual de inStock em productInfo
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="neutral"
        onClick={handleOpen}
        sx={{
          backgroundColor: "#185ea5",
          color: "#FFFFFF",
          marginTop: "-15rem",
          marginBottom: "58%",
          "&:hover": {
            backgroundColor: "#185ea5",
            opacity: 0.9,
          },
        }}
      >
        Criar Produto
      </Button>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={handleClose}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{
            width: "90vw",
            height: "90vh",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
            marginBottom={"1rem"}
          >
            Criar Novo Produto
          </Typography>

          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <CreateProductForm onClose={handleClose} />
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}
