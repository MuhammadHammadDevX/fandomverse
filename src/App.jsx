import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import { BookmarkProvider } from "./context/BookmarkContext";
import { CartProvider } from "./context/CartContext";
import { ModalProvider } from "./context/ModalContext";

import TopBar from "./components/TopBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import { BackToTop } from "./components/CommonUI";

import Home from "./pages/Home";
import Category from "./pages/Category";
import Search from "./pages/Search";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Gallery from "./pages/Gallery";
import Media from "./pages/Media";
import Trailers from "./pages/Trailers";
import Characters from "./pages/Characters";
import Events from "./pages/Events";
import Merchandise from "./pages/Merchandise";
import Bookmarks from "./pages/Bookmarks";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, search]);
  return null;
}

export default function App() {
  return (
    <DataProvider>
      <ToastProvider>
        <ThemeProvider>
          <BookmarkProvider>
            <CartProvider>
              <ModalProvider>
                <Router>
                  <ScrollToTop />
                  <TopBar />
                  <Navbar />

                  <main>
                    <Routes>
                      {/* Standard routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/category" element={<Category />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/articles" element={<Articles />} />
                      <Route path="/article" element={<ArticleDetail />} />
                      <Route path="/gallery" element={<Gallery />} />
                      <Route path="/media" element={<Media />} />
                      <Route path="/trailers" element={<Trailers />} />
                      <Route path="/characters" element={<Characters />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/merchandise" element={<Merchandise />} />
                      <Route path="/bookmarks" element={<Bookmarks />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />

                      {/* Compatibility for .html links */}
                      <Route path="/index.html" element={<Home />} />
                      <Route path="/category.html" element={<Category />} />
                      <Route path="/search.html" element={<Search />} />
                      <Route path="/articles.html" element={<Articles />} />
                      <Route path="/article.html" element={<ArticleDetail />} />
                      <Route path="/gallery.html" element={<Gallery />} />
                      <Route path="/media.html" element={<Media />} />
                      <Route path="/trailers.html" element={<Trailers />} />
                      <Route path="/characters.html" element={<Characters />} />
                      <Route path="/events.html" element={<Events />} />
                      <Route path="/merchandise.html" element={<Merchandise />} />
                      <Route path="/bookmarks.html" element={<Bookmarks />} />
                      <Route path="/about.html" element={<About />} />
                      <Route path="/contact.html" element={<Contact />} />
                      <Route path="/login.html" element={<Login />} />
                      <Route path="/signup.html" element={<Signup />} />

                      {/* Catch-all fallback */}
                      <Route path="*" element={<Home />} />
                    </Routes>
                  </main>

                  <Footer />
                  <BackToTop />
                  <Chatbot />
                </Router>
              </ModalProvider>
            </CartProvider>
          </BookmarkProvider>
        </ThemeProvider>
      </ToastProvider>
    </DataProvider>
  );
}
