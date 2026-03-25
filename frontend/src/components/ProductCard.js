import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  CardActions,
} from "@mui/material";
import { AddShoppingCart, RemoveRedEye } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const getSeasonLabel = (season) => {
    const seasons = {
      summer: "Літо",
      winter: "Зима",
      "all-season": "Всесезон",
    };
    return seasons[season] || season;
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.images?.[0] || "/images/placeholder.jpg"}
        alt={product.name_uk}
        sx={{ objectFit: "contain", p: 2, backgroundColor: "#fafafa" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {product.brand}
        </Typography>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {product.name_uk}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
          {product.width && (
            <Chip
              label={`${product.width}/${product.profile}R${product.diameter}`}
              size="small"
              variant="outlined"
            />
          )}
          {product.season && (
            <Chip
              label={getSeasonLabel(product.season)}
              size="small"
              color={product.season === "summer" ? "warning" : "info"}
            />
          )}
        </Box>

        <Box sx={{ mt: 2 }}>
          {product.old_price && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "line-through" }}
            >
              {product.old_price.toLocaleString()} грн
            </Typography>
          )}
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            {product.price.toLocaleString()} грн
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddShoppingCart />}
          onClick={handleAddToCart}
          disabled={product.quantity === 0}
          sx={{ borderRadius: 2 }}
        >
          {product.quantity === 0 ? "Немає в наявності" : "В кошик"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
