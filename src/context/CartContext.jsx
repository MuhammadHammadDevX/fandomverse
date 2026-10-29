import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";
import { useData } from "./DataContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { showToast } = useToast();
  const { siteData } = useData();

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("fv_cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem("fv_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId, option, qty) => {
    const product = siteData?.merchandise?.find((p) => p.id === productId);
    if (!product) return;

    const price = option === "Premium" ? product.priceMax : product.priceMin;
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.id === productId && c.option === option);
      if (existing) {
        return prevCart.map((c) =>
          c.id === productId && c.option === option ? { ...c, qty: c.qty + qty } : c
        );
      } else {
        return [
          ...prevCart,
          {
            id: productId,
            name: product.name,
            image: product.image,
            option: option,
            price: price,
            qty: qty,
          },
        ];
      }
    });
    showToast(product.name + " added to cart");
  };

  const changeCartQty = (index, step) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      updated[index] = { ...updated[index], qty: updated[index].qty + step };
      if (updated[index].qty <= 0) {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal === 0 || subtotal >= 5000 ? 0 : 250;
  const total = subtotal + delivery;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        changeCartQty,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        delivery,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
