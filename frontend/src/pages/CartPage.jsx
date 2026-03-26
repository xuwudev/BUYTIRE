import React from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  IconButton,
  TextField,
  Paper,
  Divider,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { Delete, Add, Remove, ShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeFromCart, clearCart } from "../store/cartSlice";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    if (window.confirm("Ви впевнені, що хочете очистити кошик?")) {
      dispatch(clearCart());
    }
  };

  const shippingCost = total > 5000 ? 0 : 150;
  const finalTotal = total + shippingCost;

  if (items.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <ShoppingCart sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Ваш кошик порожній
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Додайте товари до кошика, щоб оформити замовлення
        </Typography>
        <Button variant="contained" onClick={() => navigate("/catalog")}>
          Перейти до каталогу
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Кошик
      </Typography>

      <Grid container spacing={3}>
        {/* Товари в кошику */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            {items.map((item, index) => (
              <Box key={item.product.id}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3} sm={2}>
                    <CardMedia
                      component="img"
                      image={
                        item.product.images?.[0] || "/images/placeholder.jpg"
                      }
                      alt={item.product.name_uk}
                      sx={{ borderRadius: 1 }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={5}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {item.product.name_uk}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.product.brand}
                    </Typography>
                    <Typography variant="body2" color="primary.main">
                      {item.product.price.toLocaleString()} грн
                    </Typography>
                  </Grid>
                  <Grid item xs={3} sm={3}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity - 1,
                          )
                        }
                      >
                        <Remove />
                      </IconButton>
                      <TextField
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.product.id,
                            parseInt(e.target.value) || 1,
                          )
                        }
                        type="number"
                        inputProps={{
                          min: 1,
                          style: { textAlign: "center", width: 50 },
                        }}
                        variant="outlined"
                        size="small"
                      />
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity + 1,
                          )
                        }
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {(item.product.price * item.quantity).toLocaleString()}{" "}
                        грн
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item.product.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
                {index < items.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}

            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button variant="outlined" onClick={handleClearCart}>
                Очистити кошик
              </Button>
              <Button variant="outlined" onClick={() => navigate("/catalog")}>
                Продовжити покупки
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Підсумок замовлення */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Підсумок
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">
                Товари ({items.reduce((s, i) => s + i.quantity, 0)} шт)
              </Typography>
              <Typography variant="body2">
                {total.toLocaleString()} грн
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">Доставка</Typography>
              <Typography variant="body2">
                {shippingCost === 0
                  ? "Безкоштовно"
                  : `${shippingCost.toLocaleString()} грн`}
              </Typography>
            </Box>

            {total < 5000 && (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 2 }}
              >
                Додайте товарів на {(5000 - total).toLocaleString()} грн для
                безкоштовної доставки
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography variant="h6">До сплати</Typography>
              <Typography variant="h6" color="primary.main">
                {finalTotal.toLocaleString()} грн
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => navigate("/checkout")}
            >
              Оформити замовлення
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
