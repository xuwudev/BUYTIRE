import React, { useState, useMemo } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../store/cartSlice";
import { createOrder } from "../services/api";

const steps = ["Контактна інформація", "Доставка", "Оплата"];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: "",
    address: "",
    comment: "",
    paymentMethod: "cash",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (
      activeStep === 0 &&
      (!formData.full_name || !formData.email || !formData.phone)
    ) {
      setError("Будь ласка, заповніть всі обов'язкові поля");
      return;
    }
    if (activeStep === 1 && (!formData.city || !formData.address)) {
      setError("Будь ласка, вкажіть місто та адресу доставки");
      return;
    }
    setError("");
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const orderData = {
        shipping_address: `${formData.city}, ${formData.address}`,
        phone: formData.phone,
        comment: formData.comment,
        payment_method: formData.paymentMethod,
      };

      const response = await createOrder(orderData);
      setOrderSuccess(response.order);
      dispatch(clearCart());

      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.error || "Помилка при оформленні замовлення",
      );
    } finally {
      setLoading(false);
    }
  };

  const shippingCost = useMemo(() => (total > 5000 ? 0 : 150), [total]);
  const finalTotal = useMemo(() => total + shippingCost, [total, shippingCost]);
  const itemCount = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items],
  );

  if (items.length === 0 && !orderSuccess) {
    navigate("/cart");
    return null;
  }

  if (orderSuccess) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Замовлення успішно оформлено!
        </Alert>
        <Typography variant="h5" gutterBottom>
          Номер замовлення: {orderSuccess.order_number}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Дякуємо за покупку! Наш менеджер зв'яжеться з вами найближчим часом.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/profile")}>
          Перейти до моїх замовлень
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Оформлення замовлення
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Контактна інформація
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Повне ім'я *"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Телефон *"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Адреса доставки
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Місто *"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Адреса (вулиця, будинок, квартира) *"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Коментар до замовлення"
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Спосіб оплати
                </Typography>
                <RadioGroup
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                >
                  <FormControlLabel
                    value="cash"
                    control={<Radio />}
                    label="Оплата при отриманні (готівкою або карткою кур'єру)"
                  />
                  <FormControlLabel
                    value="card"
                    control={<Radio />}
                    label="Оплата карткою онлайн (LiqPay)"
                    disabled
                  />
                  <FormControlLabel
                    value="bank"
                    control={<Radio />}
                    label="Безготівковий розрахунок"
                    disabled
                  />
                </RadioGroup>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Інформація про замовлення
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    Товарів: {itemCount} шт
                  </Typography>
                  <Typography variant="body2">
                    {total.toLocaleString()} грн
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Доставка</Typography>
                  <Typography variant="body2">
                    {shippingCost === 0
                      ? "Безкоштовно"
                      : `${shippingCost.toLocaleString()} грн`}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">До сплати</Typography>
                  <Typography variant="h6" color="primary.main">
                    {finalTotal.toLocaleString()} грн
                  </Typography>
                </Box>
              </Box>
            )}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Назад
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Підтвердити замовлення"
                  )}
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext}>
                  Далі
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Ваше замовлення
            </Typography>

            {items.map((item) => (
              <Box
                key={item.product.id}
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {item.product.name_uk}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.quantity} x {item.product.price.toLocaleString()} грн
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {(item.product.price * item.quantity).toLocaleString()} грн
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">Промокод</Typography>
              <Button size="small">Застосувати</Button>
            </Box>

            <TextField
              fullWidth
              size="small"
              placeholder="Введіть промокод"
              sx={{ mb: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">Підсумок</Typography>
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
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Всього</Typography>
              <Typography variant="h6" color="primary.main">
                {finalTotal.toLocaleString()} грн
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
