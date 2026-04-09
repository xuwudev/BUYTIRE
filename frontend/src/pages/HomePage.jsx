import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Paper,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { getPopularProducts } from "../services/api";

const CATEGORIES = [
  {
    title: "Літні шини",
    image: "/images/summer-tires.jpg",
    path: "/catalog?season=summer&category=tire",
    color: "#ff9800",
  },
  {
    title: "Зимові шини",
    image: "/images/winter-tires.jpg",
    path: "/catalog?season=winter&category=tire",
    color: "#2196f3",
  },
  {
    title: "Легкосплавні диски",
    image: "/images/alloy-wheels.jpg",
    path: "/catalog?category=wheel",
    color: "#9c27b0",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPopularProducts();
  }, []);

  const loadPopularProducts = async () => {
    try {
      const data = await getPopularProducts();
      setPopularProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)",
          color: "white",
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                fontWeight="bold"
              >
                Шини та диски
              </Typography>
              <Typography variant="h5" gutterBottom>
                Найкращий вибір для вашого авто
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                Великий вибір шин та дисків від провідних виробників. Доставка
                по всій Україні.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/catalog")}
                sx={{
                  backgroundColor: "white",
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                Перейти до каталогу
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/hero-car.png"
                alt="Car"
                sx={{ width: "100%", maxHeight: 400, objectFit: "contain" }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Категорії */}
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          textAlign="center"
          mb={4}
        >
          Категорії товарів
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {CATEGORIES.map((category) => (
            <Grid item xs={12} md={4} key={category.title}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
                onClick={() => navigate(category.path)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={category.image}
                  alt={category.title}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    textAlign="center"
                    color={category.color}
                  >
                    {category.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Популярні товари */}
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          textAlign="center"
          mb={4}
        >
          Популярні товари
        </Typography>
        {loading ? (
          <Loader />
        ) : (
          <Grid container spacing={3}>
            {popularProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Переваги */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            textAlign="center"
            mb={4}
          >
            Чому обирають нас?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3} lg={4}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h3">
                  <svg
                    width="64px"
                    height="64px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3 3C1.34315 3 0 4.34315 0 6V15C0 16.3121 0.842366 17.4275 2.01581 17.8348C2.18436 19.6108 3.67994 21 5.5 21C7.26324 21 8.72194 19.6961 8.96456 18H15.0354C15.2781 19.6961 16.7368 21 18.5 21C20.3201 21 21.8156 19.6108 21.9842 17.8348C23.1576 17.4275 24 16.3121 24 15V10.7515C24 10.0248 23.7362 9.32283 23.2577 8.77596L20.8502 6.02449C20.2805 5.37344 19.4576 5 18.5925 5H16.8293C16.4175 3.83481 15.3062 3 14 3H3ZM4 17.4361V17.5639C4.03348 18.3634 4.69224 19.0013 5.5 19.0013C6.30776 19.0013 6.96652 18.3634 7 17.5639V17.4361C6.96652 16.6366 6.30776 15.9987 5.5 15.9987C4.69224 15.9987 4.03348 16.6366 4 17.4361ZM5.5 14C6.8962 14 8.10145 14.8175 8.66318 16H15.3368C15.8985 14.8175 17.1038 14 18.5 14C19.8245 14 20.9771 14.7357 21.5716 15.8207C21.8306 15.64 22 15.3398 22 15V11H17C15.8954 11 15 10.1046 15 9V6C15 5.44772 14.5523 5 14 5H3C2.44772 5 2 5.44772 2 6V15C2 15.3398 2.16945 15.64 2.42845 15.8207C3.02292 14.7357 4.17555 14 5.5 14ZM17 7V8C17 8.55229 17.4477 9 18 9H20.7962L19.345 7.34149C19.1552 7.12448 18.8808 7 18.5925 7H17ZM17 17.4361V17.5639C17.0335 18.3634 17.6922 19.0013 18.5 19.0013C19.3078 19.0013 19.9665 18.3634 20 17.5639V17.4361C19.9665 16.6366 19.3078 15.9987 18.5 15.9987C17.6922 15.9987 17.0335 16.6366 17 17.4361Z"
                        fill="#0F0F0F"
                      ></path>{" "}
                    </g>
                  </svg>
                </Typography>
                <Typography variant="h6">Швидка доставка</Typography>
                <Typography variant="body2" color="text.secondary">
                  Доставка по всій Україні за 1-3 дні
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3} lg={4}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h3">
                  <svg
                    width="64px"
                    height="64px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M4 12.6111L8.92308 17.5L20 6.5"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </Typography>
                <Typography variant="h6">Гарантія якості</Typography>
                <Typography variant="body2" color="text.secondary">
                  Всі товари сертифіковані
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3} lg={4}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h3">
                  <svg
                    width="64px"
                    height="64px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M14 14H17M14 10H17M9 9.5V8.5M9 9.5H11.0001M9 9.5C7.20116 9.49996 7.00185 9.93222 7.0001 10.8325C6.99834 11.7328 7.00009 12 9.00009 12C11.0001 12 11.0001 12.2055 11.0001 13.1667C11.0001 13.889 11.0001 14.5 9.00009 14.5M9.00009 14.5L9 15.5M9.00009 14.5H7.0001M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </Typography>
                <Typography variant="h6">Найкращі ціни</Typography>
                <Typography variant="body2" color="text.secondary">
                  Прямі поставки від виробників
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3} lg={4}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h3">
                  <svg
                    width="64px"
                    height="64px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M4 21C4 17.4735 6.60771 14.5561 10 14.0709M19.8726 15.2038C19.8044 15.2079 19.7357 15.21 19.6667 15.21C18.6422 15.21 17.7077 14.7524 17 14C16.2923 14.7524 15.3578 15.2099 14.3333 15.2099C14.2643 15.2099 14.1956 15.2078 14.1274 15.2037C14.0442 15.5853 14 15.9855 14 16.3979C14 18.6121 15.2748 20.4725 17 21C18.7252 20.4725 20 18.6121 20 16.3979C20 15.9855 19.9558 15.5853 19.8726 15.2038ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </Typography>
                <Typography variant="h6">Професійна консультація</Typography>
                <Typography variant="body2" color="text.secondary">
                  Допоможемо підібрати ідеальний варіант
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
