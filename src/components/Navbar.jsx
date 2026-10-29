import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useBookmarks } from "../context/BookmarkContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { isLight, toggleTheme } = useTheme();
  const { bookmarkCount } = useBookmarks();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setExploreOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span>
            Fandom<b>Verse</b>
          </span>
        </Link>

        <ul className={`nav-links ${mobileMenuOpen ? "open" : ""}`} id="nav-links">
          <li>
            <Link to="/" className={isActive("/") ? "active" : ""} onClick={closeMenu}>
              Home
            </Link>
          </li>

          <li className={`dropdown ${categoriesOpen ? "open" : ""}`}>
            <button
              type="button"
              className="dropdown-toggle"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
            >
              Categories{" "}
            </button>
            <ul className="dropdown-menu">
              <li>
                <Link to="/category?cat=anime" onClick={closeMenu}>
                  Anime
                </Link>
              </li>
              <li>
                <Link to="/category?cat=gaming" onClick={closeMenu}>
                  Gaming
                </Link>
              </li>
              <li>
                <Link to="/category?cat=movies" onClick={closeMenu}>
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/category?cat=tv" onClick={closeMenu}>
                  TV Shows
                </Link>
              </li>
              <li>
                <Link to="/category?cat=kpop" onClick={closeMenu}>
                  K-Pop
                </Link>
              </li>
              <li>
                <Link to="/category?cat=comics" onClick={closeMenu}>
                  Comics
                </Link>
              </li>
              <li>
                <Link to="/category?cat=manga" onClick={closeMenu}>
                  Manga
                </Link>
              </li>
            </ul>
          </li>

          <li className={`dropdown ${exploreOpen ? "open" : ""}`}>
            <button
              type="button"
              className="dropdown-toggle"
              onClick={() => setExploreOpen(!exploreOpen)}
            >
              Explore{" "}
            </button>
            <ul className="dropdown-menu">
              <li>
                <Link to="/articles" onClick={closeMenu}>
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/gallery" onClick={closeMenu}>
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/media" onClick={closeMenu}>
                  Videos &amp; Audio
                </Link>
              </li>
              <li>
                <Link to="/trailers" onClick={closeMenu}>
                  Trailers
                </Link>
              </li>
              <li>
                <Link to="/characters" onClick={closeMenu}>
                  Characters
                </Link>
              </li>
              <li>
                <Link to="/events" onClick={closeMenu}>
                  Events
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link
              to="/merchandise"
              className={isActive("/merchandise") ? "active" : ""}
              onClick={closeMenu}
            >
              Store
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={isActive("/about") ? "active" : ""}
              onClick={closeMenu}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={isActive("/contact") ? "active" : ""}
              onClick={closeMenu}
            >
              Contact
            </Link>
          </li>
          <li className="mobile-only">
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>
          </li>
          <li className="mobile-only">
            <Link to="/signup" onClick={closeMenu}>
              Sign Up
            </Link>
          </li>
        </ul>

        <form className="search-box" id="nav-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search fandoms..."
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="nav-icons">
          <button
            type="button"
            className="icon-btn"
            id="theme-btn"
            title="Light / Dark mode"
            onClick={toggleTheme}
          >
            {isLight ? "Dark" : "Light"}
          </button>
          <Link
            className="icon-btn"
            to="/bookmarks"
            title="My bookmarks"
            onClick={closeMenu}
          >
            Saved
            <span
              className="badge bookmark-badge"
              style={{ display: bookmarkCount > 0 ? "grid" : "none" }}
            >
              {bookmarkCount}
            </span>
          </Link>
          <Link
            className="icon-btn"
            to="/merchandise#cart"
            title="Cart"
            onClick={closeMenu}
          >
            Cart
            <span
              className="badge cart-badge"
              style={{ display: cartCount > 0 ? "grid" : "none" }}
            >
              {cartCount}
            </span>
          </Link>
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-small btn-outline">
              Login
            </Link>
            <Link to="/signup" className="btn btn-small">
              Sign Up
            </Link>
          </div>
          <button
            type="button"
            className="icon-btn menu-toggle"
            id="menu-toggle"
            title="Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>
    </nav>
  );
}
