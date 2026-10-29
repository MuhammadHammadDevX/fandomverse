import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useData } from "./DataContext";
import { useBookmarks } from "./BookmarkContext";
import { useCart } from "./CartContext";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const { siteData, categoryName, formatDate, formatPrice, isUpcoming } = useData();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { addToCart } = useCart();

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'video' | 'audio' | 'character' | 'event' | 'release' | 'product' | 'custom'
  const [modalItem, setModalItem] = useState(null);
  const [productOption, setProductOption] = useState("Standard");
  const [productQty, setProductQty] = useState(1);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalType(null);
    setModalItem(null);
    setProductOption("Standard");
    setProductQty(1);
    document.body.style.overflow = "";
  }, []);

  const openVideo = useCallback((id) => {
    const video = siteData?.videos?.find((v) => v.id === id);
    if (!video) return;
    setModalType("video");
    setModalItem(video);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  }, [siteData]);

  const openAudio = useCallback((id) => {
    const audio = siteData?.audio?.find((a) => a.id === id);
    if (!audio) return;
    setModalType("audio");
    setModalItem(audio);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  }, [siteData]);

  const openCharacter = useCallback((id) => {
    const char = siteData?.characters?.find((c) => c.id === id);
    if (!char) return;
    setModalType("character");
    setModalItem(char);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  }, [siteData]);

  const openEvent = useCallback((id) => {
    const ev = siteData?.events?.find((e) => e.id === id);
    if (!ev) return;
    setModalType("event");
    setModalItem(ev);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  }, [siteData]);

  const openRelease = useCallback((id) => {
    const rel = siteData?.releases?.find((r) => r.id === id);
    if (!rel) return;
    setModalType("release");
    setModalItem(rel);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  }, [siteData]);

  const openProduct = useCallback((id) => {
    const prod = siteData?.merchandise?.find((p) => p.id === id);
    if (!prod) return;
    setProductOption("Standard");
    setProductQty(1);
    setModalType("product");
    setModalItem(prod);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  }, [siteData]);

  const openLightbox = useCallback((images, index = 0) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const changeLightbox = useCallback((step) => {
    setLightboxIndex((prev) => (prev + step + lightboxImages.length) % lightboxImages.length);
  }, [lightboxImages.length]);

  // Open generic item by kind and id
  const openItem = useCallback((kind, id, itemData) => {
    if (kind === "article") {
      window.location.href = "/article?id=" + id;
    } else if (kind === "video") {
      openVideo(id);
    } else if (kind === "audio") {
      openAudio(id);
    } else if (kind === "character") {
      openCharacter(id);
    } else if (kind === "event") {
      openEvent(id);
    } else if (kind === "release") {
      openRelease(id);
    } else if (kind === "merchandise") {
      openProduct(id);
    } else if (kind === "gallery") {
      if (itemData?.images) {
        openLightbox(itemData.images, 0);
      } else {
        const catId = id.replace("gallery-", "");
        const images = siteData?.gallery?.filter((g) => g.category === catId) || [];
        openLightbox(images, 0);
      }
    }
  }, [openVideo, openAudio, openCharacter, openEvent, openRelease, openProduct, openLightbox, siteData]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen) {
        if (e.key === "ArrowRight") changeLightbox(1);
        if (e.key === "ArrowLeft") changeLightbox(-1);
        if (e.key === "Escape") closeLightbox();
      } else if (modalOpen) {
        if (e.key === "Escape") closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, modalOpen, changeLightbox, closeLightbox, closeModal]);

  return (
    <ModalContext.Provider
      value={{
        modalOpen,
        modalType,
        modalItem,
        productOption,
        setProductOption,
        productQty,
        setProductQty,
        openModal: setModalOpen,
        closeModal,
        openVideo,
        openAudio,
        openCharacter,
        openEvent,
        openRelease,
        openProduct,
        openItem,
        lightboxOpen,
        lightboxImages,
        lightboxIndex,
        openLightbox,
        closeLightbox,
        changeLightbox,
      }}
    >
      {children}
      {/* Modal Dialog */}
      {modalOpen && modalItem && (
        <div
          id="modal"
          className="modal show"
          onClick={(e) => {
            if (e.target.id === "modal") closeModal();
          }}
        >
          <div className="modal-box">
            <button className="modal-close" onClick={closeModal} title="Close">
              ✕
            </button>
            <div id="modal-body">
              {modalType === "video" && (
                <>
                  <div className="video-frame">
                    <iframe
                      src={`https://www.youtube.com/embed/${modalItem.videoId}?autoplay=1&rel=0`}
                      title={modalItem.title}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="modal-content">
                    <h2>{modalItem.title}</h2>
                    <div className="info-row">
                      <span>{categoryName(modalItem.category)}</span>
                      <span>Type: {modalItem.videoType}</span>
                      <span>{formatDate(modalItem.date)}</span>
                    </div>
                    <p>{modalItem.description}</p>
                    <p style={{ fontSize: "13px" }}>
                      Video not playing? Some videos only play on YouTube.{" "}
                      <a
                        href={`https://www.youtube.com/watch?v=${modalItem.videoId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Watch it on YouTube
                      </a>
                    </p>
                    <button
                      className="btn"
                      onClick={() => toggleBookmark("video", modalItem.id)}
                    >
                      {isBookmarked(modalItem.id) ? "Bookmarked" : "Bookmark"}
                    </button>
                  </div>
                </>
              )}

              {modalType === "audio" && (
                <>
                  <img className="modal-img" src={modalItem.image} alt={modalItem.title} />
                  <div className="modal-content">
                    <span className="type-badge" style={{ position: "static" }}>
                      {modalItem.audioType}
                    </span>
                    <h2>{modalItem.title}</h2>
                    <div className="info-row">
                      <span>{categoryName(modalItem.category)}</span>
                      <span>Length: {modalItem.duration}</span>
                      <span>{formatDate(modalItem.date)}</span>
                    </div>
                    <p>{modalItem.description}</p>
                    <audio
                      controls
                      autoPlay
                      style={{ width: "100%", marginTop: "12px" }}
                      src={modalItem.file}
                    ></audio>
                  </div>
                </>
              )}

              {modalType === "character" && (
                <>
                  <img className="modal-img" src={modalItem.image} alt={modalItem.name} />
                  <div className="modal-content">
                    <h2>{modalItem.name}</h2>
                    <div className="info-row">
                      <span>Series: {modalItem.series}</span>
                      <span>Franchise: {modalItem.franchise}</span>
                      <span>{categoryName(modalItem.category)}</span>
                    </div>
                    <h4>Biography</h4>
                    <p>{modalItem.biography}</p>
                    <h4>Traits</h4>
                    <div className="traits">
                      {modalItem.traits?.map((t, idx) => (
                        <span key={idx} className="trait">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div style={{ marginTop: "18px" }}>
                      <button
                        className="btn"
                        onClick={() => toggleBookmark("character", modalItem.id)}
                      >
                        {isBookmarked(modalItem.id) ? "Bookmarked" : "Bookmark"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {modalType === "event" && (
                <>
                  <img className="modal-img" src={modalItem.image} alt={modalItem.title} />
                  <div className="modal-content">
                    <h2>{modalItem.title}</h2>
                    <div className="info-row">
                      <span>{formatDate(modalItem.date)}</span>
                      <span>Location: {modalItem.location}</span>
                      <span>Type: {modalItem.eventType}</span>
                    </div>
                    <p>{modalItem.description}</p>
                    <p>
                      <strong>
                        {isUpcoming(modalItem.date) ? "Upcoming event" : "This event has already happened"}
                      </strong>{" "}
                      - Category: {categoryName(modalItem.category)}
                    </p>
                    <button
                      className="btn"
                      onClick={() => toggleBookmark("event", modalItem.id)}
                    >
                      {isBookmarked(modalItem.id) ? "Bookmarked" : "Bookmark"}
                    </button>
                  </div>
                </>
              )}

              {modalType === "release" && (
                <>
                  <img className="modal-img" src={modalItem.image} alt={modalItem.title} />
                  <div className="modal-content">
                    <h2>{modalItem.title}</h2>
                    <div className="info-row">
                      <span>{modalItem.dateText || formatDate(modalItem.date)}</span>
                      <span>{categoryName(modalItem.category)}</span>
                      <span>{modalItem.status === "upcoming" ? "Coming soon" : "Out now"}</span>
                    </div>
                    <p>{modalItem.description}</p>
                    <p style={{ fontSize: "13px" }}>
                      Release dates can change. Always check the official source.
                    </p>
                    <button
                      className="btn"
                      onClick={() => toggleBookmark("release", modalItem.id)}
                    >
                      {isBookmarked(modalItem.id) ? "Bookmarked" : "Bookmark"}
                    </button>
                  </div>
                </>
              )}

              {modalType === "product" && (
                <>
                  <img
                    className="modal-img"
                    src={modalItem.image}
                    alt={modalItem.name}
                    style={{ objectFit: "contain", background: "#111" }}
                  />
                  <div className="modal-content">
                    <h2>{modalItem.name}</h2>
                    <div className="info-row">
                      <span>{categoryName(modalItem.category)}</span>
                      <span className="price">
                        {formatPrice(modalItem.priceMin)} - {formatPrice(modalItem.priceMax)}
                      </span>
                    </div>
                    <p>{modalItem.description}</p>
                    <ul>
                      {modalItem.details?.map((d, idx) => (
                        <li key={idx}>{d}</li>
                      ))}
                    </ul>
                    <h4>Choose version</h4>
                    <div className="option-list">
                      <label>
                        <input
                          type="radio"
                          name="productOption"
                          value="Standard"
                          checked={productOption === "Standard"}
                          onChange={() => setProductOption("Standard")}
                        />
                        Standard - {formatPrice(modalItem.priceMin)}
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="productOption"
                          value="Premium"
                          checked={productOption === "Premium"}
                          onChange={() => setProductOption("Premium")}
                        />
                        Premium - {formatPrice(modalItem.priceMax)}
                      </label>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        alignItems: "center",
                        flexWrap: "wrap",
                        marginTop: "16px",
                      }}
                    >
                      <div className="qty-box">
                        <button
                          onClick={() => setProductQty((q) => Math.max(1, q - 1))}
                        >
                          -
                        </button>
                        <span>{productQty}</span>
                        <button
                          onClick={() => setProductQty((q) => Math.min(10, q + 1))}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="btn"
                        onClick={() => {
                          addToCart(modalItem.id, productOption, productQty);
                          closeModal();
                        }}
                      >
                        Add to cart
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => toggleBookmark("merchandise", modalItem.id)}
                      >
                        {isBookmarked(modalItem.id) ? "Bookmarked" : "Bookmark"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Viewer */}
      {lightboxOpen && lightboxImages.length > 0 && (
        <div
          id="lightbox"
          className="lightbox show"
          onClick={(e) => {
            if (e.target.id === "lightbox") closeLightbox();
          }}
        >
          <button className="lb-btn lb-close" onClick={closeLightbox}>
            Close
          </button>
          <button className="lb-btn lb-prev" onClick={() => changeLightbox(-1)}>
            Prev
          </button>
          <img
            id="lightbox-img"
            src={lightboxImages[lightboxIndex]?.image}
            alt={lightboxImages[lightboxIndex]?.caption || ""}
          />
          <p className="lightbox-caption" id="lightbox-caption">
            {lightboxImages[lightboxIndex]?.caption} -{" "}
            {categoryName(lightboxImages[lightboxIndex]?.category)}
          </p>
          <p className="lightbox-counter" id="lightbox-counter">
            {lightboxIndex + 1} / {lightboxImages.length}
          </p>
          <button className="lb-btn lb-next" onClick={() => changeLightbox(1)}>
            Next
          </button>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
