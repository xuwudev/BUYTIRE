import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Tab,
  Tabs,
  Alert,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../store/authSlice";
import { login, register } from "../services/api";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;
      if (tabValue === 0) {
        // Вхід
        response = await login(formData.email, formData.password);
      } else {
        // Реєстрація
        if (!formData.full_name) {
          setError("Будь ласка, вкажіть ваше ім'я");
          setLoading(false);
          return;
        }
        response = await register(formData);
      }

      dispatch(setCredentials(response));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Сталася помилка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
          BUYTIRE
        </Typography>

        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          sx={{ mb: 3 }}
        >
          <Tab label="Вхід" />
          <Tab label="Реєстрація" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {tabValue === 1 && (
            <>
              <TextField
                fullWidth
                label="Повне ім'я"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Телефон"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
              />
            </>
          )}

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Пароль"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading
              ? "Завантаження..."
              : tabValue === 0
                ? "Увійти"
                : "Зареєструватися"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
