import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Drawer,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Pagination,
  CircularProgress,
  Chip,
  IconButton,
  Breadcrumbs,
  Link,
  useMediaQuery,
} from "@mui/material";
import { FilterList, Close, Sort } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import { getProducts, getBrands } from "../services/api";

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const isMobile = useMediaQuery("(max-width:900px)");

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    diameter: searchParams.get("diameter") || "",
    season: searchParams.get("season") || "",
    minPrice: parseInt(searchParams.get("minPrice")) || 0,
    maxPrice: parseInt(searchParams.get("maxPrice")) || 10000,
    search: searchParams.get("search") || "",
  });

  useEffect(() => {
    loadBrands();
  }, []);

  useEffect(() => {
    loadProducts();
    // Оновлюємо URL параметри
    const params = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key] !== "" && filters[key] !== 0) {
        params[key] = filters[key];
      }
    });
    setSearchParams(params);
  }, [filters, sortBy]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts(filters);
      // Сортування
      let sortedData = [...data];
      switch (sortBy) {
        case "price_asc":
          sortedData.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          sortedData.sort((a, b) => b.price - a.price);
          break;
        case "name_asc":
          sortedData.sort((a, b) => a.name_uk.localeCompare(b.name_uk));
          break;
        case "name_desc":
          sortedData.sort((a, b) => b.name_uk.localeCompare(a.name_uk));
          break;
        default:
          sortedData.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at),
          );
      }
      setProducts(sortedData);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBrands = async () => {
    try {
      const data = await getBrands();
      setBrands(data);
    } catch (error) {
      console.error("Error loading brands:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handlePriceChange = (event, newValue) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: newValue[0],
      maxPrice: newValue[1],
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      brand: "",
      diameter: "",
      season: "",
      minPrice: 0,
      maxPrice: 10000,
      search: "",
    });
    setSortBy("newest");
    setPage(1);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.diameter) count++;
    if (filters.season) count++;
    if (filters.minPrice > 0 || filters.maxPrice < 10000) count++;
    if (filters.search) count++;
    return count;
  };

  const paginatedProducts = products.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const diameterOptions = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="/">
          Головна
        </Link>
        <Typography color="text.primary">Каталог</Typography>
      </Breadcrumbs>

      <Grid container spacing={3}>
        {/* Sidebar для десктопа */}
        <Grid item xs={12} md={3}>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <FilterSidebar
              filters={filters}
              brands={brands}
              diameterOptions={diameterOptions}
              onFilterChange={handleFilterChange}
              onPriceChange={handlePriceChange}
              onClearFilters={clearFilters}
            />
          </Box>
        </Grid>

        {/* Основний контент */}
        <Grid item xs={12} md={9}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="h4" component="h1">
              Каталог товарів
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              {isMobile && (
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setMobileOpen(true)}
                >
                  Фільтри{" "}
                  {getActiveFiltersCount() > 0 &&
                    `(${getActiveFiltersCount()})`}
                </Button>
              )}

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Сортувати</InputLabel>
                <Select
                  value={sortBy}
                  label="Сортувати"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="newest">Новинки</MenuItem>
                  <MenuItem value="price_asc">
                    Ціна: від низької до високої
                  </MenuItem>
                  <MenuItem value="price_desc">
                    Ціна: від високої до низької
                  </MenuItem>
                  <MenuItem value="name_asc">Назва: А-Я</MenuItem>
                  <MenuItem value="name_desc">Назва: Я-А</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Активні фільтри */}
          {getActiveFiltersCount() > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              {filters.category && (
                <Chip
                  label={`Категорія: ${filters.category === "tire" ? "Шини" : "Диски"}`}
                  onDelete={() => handleFilterChange("category", "")}
                  size="small"
                />
              )}
              {filters.brand && (
                <Chip
                  label={`Бренд: ${filters.brand}`}
                  onDelete={() => handleFilterChange("brand", "")}
                  size="small"
                />
              )}
              {filters.diameter && (
                <Chip
                  label={`Діаметр: R${filters.diameter}`}
                  onDelete={() => handleFilterChange("diameter", "")}
                  size="small"
                />
              )}
              {filters.season && (
                <Chip
                  label={`Сезон: ${filters.season === "summer" ? "Літо" : filters.season === "winter" ? "Зима" : "Всесезон"}`}
                  onDelete={() => handleFilterChange("season", "")}
                  size="small"
                />
              )}
              {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
                <Chip
                  label={`Ціна: ${filters.minPrice} - ${filters.maxPrice} грн`}
                  onDelete={() => {
                    handleFilterChange("minPrice", 0);
                    handleFilterChange("maxPrice", 10000);
                  }}
                  size="small"
                />
              )}
              {filters.search && (
                <Chip
                  label={`Пошук: ${filters.search}`}
                  onDelete={() => handleFilterChange("search", "")}
                  size="small"
                />
              )}
              <Button size="small" onClick={clearFilters} sx={{ ml: 1 }}>
                Очистити всі
              </Button>
            </Box>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : products.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Товарів не знайдено
              </Typography>
              <Button variant="outlined" onClick={clearFilters} sx={{ mt: 2 }}>
                Скинути фільтри
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Знайдено {products.length} товарів
              </Typography>

              <Grid container spacing={3}>
                {paginatedProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>

              {products.length > itemsPerPage && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={Math.ceil(products.length / itemsPerPage)}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                    size={isMobile ? "small" : "large"}
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* Мобільне меню фільтрів */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Фільтри</Typography>
            <IconButton onClick={() => setMobileOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <FilterSidebar
            filters={filters}
            brands={brands}
            diameterOptions={diameterOptions}
            onFilterChange={handleFilterChange}
            onPriceChange={handlePriceChange}
            onClearFilters={clearFilters}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={() => setMobileOpen(false)}
            sx={{ mt: 2 }}
          >
            Показати результати
          </Button>
        </Box>
      </Drawer>
    </Container>
  );
};

export default CatalogPage;
