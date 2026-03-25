import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : { items: [], total: 0 };
  } catch {
    return { items: [], total: 0 };
  }
};

const calculateTotal = (items) => {
  return items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }

      state.total = calculateTotal(state.items);
      localStorage.setItem(
        "cart",
        JSON.stringify({ items: state.items, total: state.total }),
      );
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload,
      );
      state.total = calculateTotal(state.items);
      localStorage.setItem(
        "cart",
        JSON.stringify({ items: state.items, total: state.total }),
      );
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.product.id === productId);
      if (item) {
        item.quantity = Math.max(1, quantity);
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.product.id !== productId);
        }
      }
      state.total = calculateTotal(state.items);
      localStorage.setItem(
        "cart",
        JSON.stringify({ items: state.items, total: state.total }),
      );
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      localStorage.removeItem("cart");
    },

    syncCart: (state, action) => {
      state.items = action.payload.items || [];
      state.total = calculateTotal(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  syncCart,
} = cartSlice.actions;
export default cartSlice.reducer;
