import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Container,
  TextField,
  InputAdornment,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Search,
  Home,
  Category,
  History,
  ExitToApp,
  Login,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isMobile = useMediaQuery("(max-width:900px)");
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${searchQuery}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
    navigate("/");
  };

  const menuItems = [
    { text: "Головна", icon: <Home />, path: "/" },
    { text: "Каталог", icon: <Category />, path: "/catalog" },
    ...(isAuthenticated
      ? [{ text: "Мої замовлення", icon: <History />, path: "/profile" }]
      : []),
  ];

  const mobileMenu = (
    <Drawer
      anchor="left"
      open={mobileOpen}
      onClose={() => setMobileOpen(false)}
    >
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          {!isAuthenticated && (
            <ListItem button onClick={() => navigate("/login")}>
              <ListItemIcon>
                <Login />
              </ListItemIcon>
              <ListItemText primary="Увійти" />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "white", color: "primary.main" }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            {isMobile && (
              <IconButton edge="start" onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                cursor: "pointer",
                background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
              onClick={() => navigate("/")}
            >
              BUYTIRE
            </Typography>

            {!isMobile && (
              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{ flex: 1, mx: 3, maxWidth: 400 }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Пошук шин або дисків..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
                />
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {!isMobile && (
                <>
                  <Button color="inherit" onClick={() => navigate("/")}>
                    Головна
                  </Button>
                  <Button color="inherit" onClick={() => navigate("/catalog")}>
                    Каталог
                  </Button>
                </>
              )}

              <IconButton color="inherit" onClick={() => navigate("/cart")}>
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>

              {isAuthenticated ? (
                <>
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                    >
                      {user?.full_name?.charAt(0) || user?.email?.charAt(0)}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    <MenuItem
                      onClick={() => {
                        navigate("/profile");
                        setAnchorEl(null);
                      }}
                    >
                      <Person sx={{ mr: 1 }} /> Профіль
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ExitToApp sx={{ mr: 1 }} /> Вийти
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button color="inherit" onClick={() => navigate("/login")}>
                  Увійти
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {mobileMenu}
    </>
  );
};

export default Navbar;
