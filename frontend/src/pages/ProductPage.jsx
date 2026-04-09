import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  IconButton,
  TextField,
  Divider,
  Chip,
  Rating,
  Paper,
  Breadcrumbs,
  Link,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import {
  AddShoppingCart,
  Remove,
  Add,
  Favorite,
  FavoriteBorder,
  Share,
  LocalShipping,
  Security,
  Autorenew,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { getProduct } from "../services/api";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    setAddedToCart(true);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 10)) {
      setQuantity(newQuantity);
    }
  };

  const getSeasonLabel = (season) => {
    const seasons = {
      summer: "Літні",
      winter: "Зимові",
      "all-season": "Всесезонні",
    };
    return seasons[season] || season;
  };

  const images = useMemo(
    () => product?.images || ["/images/placeholder.jpg"],
    [product],
  );
  const specifications = useMemo(
    () => product?.specifications || {},
    [product],
  );

  if (loading) return <Loader />;
  if (!product)
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5">Товар не знайдено</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/catalog")}
          sx={{ mt: 2 }}
        >
          Повернутися до каталогу
        </Button>
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="/">
          Головна
        </Link>
        <Link color="inherit" href="/catalog">
          Каталог
        </Link>
        <Typography color="text.primary">{product.name_uk}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Галерея зображень */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={images[activeImage]}
            alt={product.name_uk}
            sx={{
              width: "100%",
              height: 400,
              objectFit: "contain",
              borderRadius: 2,
              backgroundColor: "#fafafa",
              mb: 2,
            }}
          />
          <Box sx={{ display: "flex", gap: 1, overflowX: "auto" }}>
            {images.map((img, index) => (
              <Box
                key={index}
                component="img"
                src={img}
                alt={`${product.name_uk} ${index + 1}`}
                onClick={() => setActiveImage(index)}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: "contain",
                  borderRadius: 1,
                  cursor: "pointer",
                  border:
                    activeImage === index
                      ? "2px solid #1976d2"
                      : "1px solid #e0e0e0",
                  "&:hover": { opacity: 0.8 },
                }}
              />
            ))}
          </Box>
        </Grid>

        {/* Інформація про товар */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name_uk}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Rating value={4.5} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">
              15 відгуків
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            <Chip label={product.brand} color="primary" variant="outlined" />
            {product.season && (
              <Chip label={getSeasonLabel(product.season)} color="info" />
            )}
            {product.width && (
              <Chip
                label={`${product.width}/${product.profile}R${product.diameter}`}
              />
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            {product.old_price && (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textDecoration: "line-through" }}
              >
                {product.old_price.toLocaleString()} грн
              </Typography>
            )}
            <Typography variant="h3" color="primary.main" fontWeight="bold">
              {product.price.toLocaleString()} грн
            </Typography>
            {product.quantity > 0 ? (
              <Typography variant="body2" color="success.main">
                Є в наявності ({product.quantity} шт)
              </Typography>
            ) : (
              <Typography variant="body2" color="error.main">
                Немає в наявності
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #e0e0e0",
                borderRadius: 1,
              }}
            >
              <IconButton
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Remove />
              </IconButton>
              <TextField
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.min(
                      product.quantity,
                      Math.max(1, parseInt(e.target.value) || 1),
                    ),
                  )
                }
                type="number"
                inputProps={{
                  min: 1,
                  max: product.quantity,
                  style: { textAlign: "center", width: 50 },
                }}
                variant="standard"
                sx={{ width: 60 }}
              />
              <IconButton
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.quantity}
              >
                <Add />
              </IconButton>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<AddShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              sx={{ flex: 1 }}
            >
              {product.quantity === 0 ? "Немає в наявності" : "В кошик"}
            </Button>

            <IconButton
              onClick={() => setFavorite(!favorite)}
              color={favorite ? "error" : "default"}
            >
              {favorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>

            <IconButton>
              <Share />
            </IconButton>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LocalShipping color="primary" />
              <Typography variant="body2">
                Безкоштовна доставка при замовленні від 5000 грн
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Autorenew color="primary" />
              <Typography variant="body2">
                Повернення товару протягом 14 днів
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Security color="primary" />
              <Typography variant="body2">
                Гарантія від виробника 12 місяців
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Опис та характеристики */}
      <Paper sx={{ mt: 4 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Опис" />
          <Tab label="Характеристики" />
          <Tab label="Відгуки" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Typography variant="body1">
              {product.description_uk || "Опис відсутній"}
            </Typography>
          )}

          {tabValue === 1 && (
            <Grid container spacing={2}>
              {product.brand && (
                <>
                  <Grid item xs={4}>
                    <Typography color="text.secondary">Бренд</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{product.brand}</Typography>
                  </Grid>
                </>
              )}
              {product.width && (
                <>
                  <Grid item xs={4}>
                    <Typography color="text.secondary">Розмір</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>
                      {product.width}/{product.profile}R{product.diameter}
                    </Typography>
                  </Grid>
                </>
              )}
              {product.season && (
                <>
                  <Grid item xs={4}>
                    <Typography color="text.secondary">Сезон</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{getSeasonLabel(product.season)}</Typography>
                  </Grid>
                </>
              )}
              {Object.entries(specifications).map(([key, value]) => (
                <React.Fragment key={key}>
                  <Grid item xs={4}>
                    <Typography color="text.secondary">{key}</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{value}</Typography>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          )}

          {tabValue === 2 && (
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                py={4}
              >
                Відгуків поки немає. Будьте першим!
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Рекомендовані товари */}
      <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>
        Схожі товари
      </Typography>
      <Grid container spacing={3}>
        {/* Тут можна додати рекомендації */}
      </Grid>

      <Snackbar
        open={addedToCart}
        autoHideDuration={3000}
        onClose={() => setAddedToCart(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setAddedToCart(false)}>
          Товар додано до кошика!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductPage;
