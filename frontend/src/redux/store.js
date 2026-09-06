import {configureStore} from '@reduxjs/toolkit';
import cartReducer from '../redux/cardSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        
    },
});
export default store;