import React from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  Divider,
} from "@mui/material";

const FilterSidebar = React.memo(({
  filters,
  brands,
  diameterOptions,
  onFilterChange,
  onPriceChange,
  onClearFilters,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Фільтри
      </Typography>

      <TextField
        fullWidth
        label="Пошук"
        variant="outlined"
        value={filters.search}
        onChange={(e) => onFilterChange("search", e.target.value)}
        sx={{ mb: 2 }}
        size="small"
      />

      <FormControl fullWidth sx={{ mb: 2 }} size="small">
        <InputLabel>Категорія</InputLabel>
        <Select
          value={filters.category}
          label="Категорія"
          onChange={(e) => onFilterChange("category", e.target.value)}
        >
          <MenuItem value="">Всі</MenuItem>
          <MenuItem value="tire">Шини</MenuItem>
          <MenuItem value="wheel">Диски</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} size="small">
        <InputLabel>Бренд</InputLabel>
        <Select
          value={filters.brand}
          label="Бренд"
          onChange={(e) => onFilterChange("brand", e.target.value)}
        >
          <MenuItem value="">Всі бренди</MenuItem>
          {brands.map((brand) => (
            <MenuItem key={brand} value={brand}>
              {brand}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {filters.category !== "wheel" && (
        <FormControl fullWidth sx={{ mb: 2 }} size="small">
          <InputLabel>Діаметр</InputLabel>
          <Select
            value={filters.diameter}
            label="Діаметр"
            onChange={(e) => onFilterChange("diameter", e.target.value)}
          >
            <MenuItem value="">Всі</MenuItem>
            {diameterOptions.map((d) => (
              <MenuItem key={d} value={d}>
                R{d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {filters.category !== "wheel" && (
        <FormControl fullWidth sx={{ mb: 2 }} size="small">
          <InputLabel>Сезон</InputLabel>
          <Select
            value={filters.season}
            label="Сезон"
            onChange={(e) => onFilterChange("season", e.target.value)}
          >
            <MenuItem value="">Всі сезони</MenuItem>
            <MenuItem value="summer">Літо</MenuItem>
            <MenuItem value="winter">Зима</MenuItem>
            <MenuItem value="all-season">Всесезон</MenuItem>
          </Select>
        </FormControl>
      )}

      <Typography gutterBottom>Ціновий діапазон</Typography>
      <Slider
        value={[filters.minPrice, filters.maxPrice]}
        onChange={onPriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={10000}
        step={100}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          size="small"
          label="Від"
          value={filters.minPrice}
          onChange={(e) => onFilterChange("minPrice", Number(e.target.value))}
          type="number"
          fullWidth
        />
        <TextField
          size="small"
          label="До"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange("maxPrice", Number(e.target.value))}
          type="number"
          fullWidth
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Button
        variant="outlined"
        fullWidth
        onClick={onClearFilters}
        sx={{ mb: 1 }}
      >
        Скинути всі фільтри
      </Button>
    </Box>
  );
});

export default FilterSidebar;
