import React, { useState, useMemo } from "react";
import { useData } from "../context/DataContext";
import { useCart } from "../context/CartContext";
import Card from "../components/Card";
import { Breadcrumb } from "../components/CommonUI";

export default function Merchandise() {
  const { siteData, formatPrice, makeCard } = useData();
  const { cart, changeCartQty, removeFromCart, clearCart, cartCount, subtotal, delivery, total } = useCart();

  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const productCards = useMemo(() => {
    if (!siteData?.merchandise) return [];
    let list = siteData.merchandise
      .filter((m) => category === "all" || m.category === category)
      .slice();

    if (sortBy === "low") {
      list.sort((a, b) => a.priceMin - b.priceMin);
    } else if (sortBy === "high") {
      list.sort((a, b) => b.priceMax - a.priceMax);
    } else if (sortBy === "az") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => b.popularity - a.popularity);
    }

    return list.map((m) => makeCard("merchandise", m));
  }, [siteData, category, sortBy, makeCard]);

  return (
    <div className="merchandise-page">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Store" },
        ]}
      />

      <header className="page-header">
        <div className="container">
          <h1>Fan Merchandise</h1>
          <p>Apparel, posters, keychains and collectibles.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="toolbar">
            <div className="filter-group">
              <label htmlFor="store-category">Category</label>
              <select
                id="store-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="all">All categories</option>
                {siteData?.categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="store-sort">Sort by</label>
              <select
                id="store-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Popular / Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="az">A to Z</option>
              </select>
            </div>
          </div>

          <p className="result-count">Showing {productCards.length} products</p>

          <div className="card-grid" id="store-grid">
            {productCards.map((card) => (
              <Card key={`merch-${card.id}`} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* Cart section */}
      <section className="section alt" id="cart">
        <div className="container">
          <div className="section-title">
            <h2>Shopping Cart</h2>
            <p>Temporary session cart. Free delivery on orders above Rs. 5,000.</p>
          </div>

          <div className="cart-layout">
            <div className="cart-items" id="cart-items">
              {cart.length === 0 ? (
                <p style={{ color: "var(--muted)" }}>Your cart is empty.</p>
              ) : (
                cart.map((c, i) => (
                  <div key={`${c.id}-${c.option}`} className="cart-item">
                    <img src={c.image} alt={c.name} />
                    <div>
                      <h4>{c.name}</h4>
                      <small>
                        {c.option} - {formatPrice(c.price)}
                      </small>
                      <br />
                      <div className="qty-box">
                        <button onClick={() => changeCartQty(i, -1)}>-</button>
                        <span>{c.qty}</span>
                        <button onClick={() => changeCartQty(i, 1)}>+</button>
                      </div>
                    </div>
                    <button className="remove" onClick={() => removeFromCart(i)}>
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Total items:</span>
                <span id="cart-count">{cartCount}</span>
              </div>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span id="cart-subtotal">{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery:</span>
                <span id="cart-delivery">
                  {delivery === 0 ? "Free" : formatPrice(delivery)}
                </span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span id="cart-total">{formatPrice(total)}</span>
              </div>

              <div style={{ marginTop: "18px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  className="btn"
                  onClick={() =>
                    alert("This is a demo project store. Checkout is not implemented.")
                  }
                  disabled={cart.length === 0}
                >
                  Checkout (Demo)
                </button>
                <button
                  className="btn btn-outline"
                  onClick={clearCart}
                  disabled={cart.length === 0}
                >
                  Clear cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
