import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { getUserOrders, getOrderDetails, cancelOrder } from "../services/api";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const data = await getOrderDetails(orderId);
      setSelectedOrder(data);
    } catch (error) {
      console.error("Error loading order details:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Ви впевнені, що хочете скасувати це замовлення?")) {
      try {
        await cancelOrder(orderId);
        setCancelSuccess("Замовлення успішно скасовано");
        loadOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
        setTimeout(() => setCancelSuccess(""), 3000);
      } catch (error) {
        console.error("Error cancelling order:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Очікує обробки";
      case "processing":
        return "Обробляється";
      case "shipped":
        return "Відправлено";
      case "delivered":
        return "Доставлено";
      case "cancelled":
        return "Скасовано";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Особистий кабінет
      </Typography>

      {cancelSuccess && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setCancelSuccess("")}
        >
          {cancelSuccess}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Бічна панель */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="h6">
                {user?.full_name || user?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              {user?.phone && (
                <Typography variant="body2" color="text.secondary">
                  {user.phone}
                </Typography>
              )}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Tabs
              orientation="vertical"
              value={tabValue}
              onChange={(e, v) => setTabValue(v)}
              sx={{ borderRight: 1, borderColor: "divider" }}
            >
              <Tab label="Мої замовлення" />
              <Tab label="Особисті дані" />
              <Tab label="Вийти" onClick={() => dispatch(logout())} />
            </Tabs>
          </Paper>
        </Grid>

        {/* Основний контент */}
        <Grid item xs={12} md={9}>
          {tabValue === 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Історія замовлень
              </Typography>

              {orders.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  py={4}
                >
                  У вас ще немає замовлень
                </Typography>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Замовлення #{order.order_number}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(order.created_at).toLocaleDateString(
                              "uk-UA",
                            )}
                          </Typography>
                        </Box>
                        <Box>
                          <Chip
                            label={getStatusLabel(order.status)}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 2,
                        }}
                      >
                        <Typography variant="h6" color="primary.main">
                          {order.total_amount.toLocaleString()} грн
                        </Typography>
                        <Box>
                          <Button
                            size="small"
                            onClick={() => handleViewOrder(order.id)}
                            sx={{ mr: 1 }}
                          >
                            Деталі
                          </Button>
                          {order.status === "pending" && (
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              Скасувати
                            </Button>
                          )}
                        </Box>
                      </Box>

                      {selectedOrder?.id === order.id && (
                        <Box
                          sx={{
                            mt: 2,
                            pt: 2,
                            borderTop: 1,
                            borderColor: "divider",
                          }}
                        >
                          <Typography variant="subtitle2" gutterBottom>
                            Товари:
                          </Typography>
                          {selectedOrder.items?.map((item) => (
                            <Box
                              key={item.id}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography variant="body2">
                                {item.name_uk} x {item.quantity}
                              </Typography>
                              <Typography variant="body2">
                                {item.price_at_time.toLocaleString()} грн
                              </Typography>
                            </Box>
                          ))}
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Адреса доставки: {selectedOrder.shipping_address}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Телефон: {selectedOrder.phone}
                          </Typography>
                          {selectedOrder.comment && (
                            <Typography variant="body2" color="text.secondary">
                              Коментар: {selectedOrder.comment}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </Paper>
          )}

          {tabValue === 1 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Особисті дані
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Повне ім'я"
                    value={user?.full_name || ""}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={user?.email || ""}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Телефон"
                    value={user?.phone || ""}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" disabled>
                    Редагувати (в розробці)
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
