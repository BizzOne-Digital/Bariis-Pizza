import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i._id === action.item._id && i.size === action.item.size);
      if (existing) {
        return { ...state, items: state.items.map(i =>
          i._id === action.item._id && i.size === action.item.size
            ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => !(i._id === action.id && i.size === action.size)) };
    case 'UPDATE_QTY':
      if (action.qty <= 0) return { ...state, items: state.items.filter(i => !(i._id === action.id && i.size === action.size)) };
      return { ...state, items: state.items.map(i =>
        i._id === action.id && i.size === action.size ? { ...i, quantity: action.qty } : i) };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', item });
  const removeItem = (id, size) => dispatch({ type: 'REMOVE_ITEM', id, size });
  const updateQty = (id, size, qty) => dispatch({ type: 'UPDATE_QTY', id, size, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const total = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};
