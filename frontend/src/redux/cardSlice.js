import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: (() => {
        try {
            const savedItems = localStorage.getItem("cartItems");
            return savedItems ? JSON.parse(savedItems) : [];
        } catch {
            return [];
        }
    })(),
};
const cardSlice = createSlice({
    name: "card",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const itemId = item._id || item.id;
            const existItem = state.cartItems.find(
                (cartItem) => (cartItem._id || cartItem.id) === itemId
            );
            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    (x._id || x.id) === itemId
                        ? { ...x, ...item, qty: (x.qty || 1) + (item.qty || 1) }
                        : x
                );
            } else {
                state.cartItems = [...state.cartItems, { ...item, qty: item.qty || 1 }];
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        updateCartQty: (state, action) => {
            const { id, qty } = action.payload;
            state.cartItems = state.cartItems.map((item) =>
                (item._id || item.id) === id ? { ...item, qty } : item
            );
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (x) => (x._id || x.id) !== action.payload
            );
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem("cartItems");
        },
    },
});

export const { addToCart, updateCartQty, removeFromCart, clearCart } = cardSlice.actions;
export default cardSlice.reducer;