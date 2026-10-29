import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useModal } from "../context/ModalContext";
import { Chips, Breadcrumb } from "../components/CommonUI";

export default function Gallery() {
  const [searchParams] = useSearchParams();
  const initCat = searchParams.get("cat") || "all";

  const { siteData } = useData();
  const { openLightbox } = useModal();

  const [category, setCategory] = useState(initCat);

  const categoryIds = useMemo(() => {
    if (!siteData?.categories) return ["all"];
    return ["all", ...siteData.categories.map((c) => c.id)];
  }, [siteData]);

  const categoryNames = useMemo(() => {
    if (!siteData?.categories) return ["All"];
    return ["All", ...siteData.categories.map((c) => c.name)];
  }, [siteData]);

  const images = useMemo(() => {
    if (!siteData?.gallery) return [];
    if (category === "all") return siteData.gallery;
    return siteData.gallery.filter((g) => g.category === category);
  }, [siteData, category]);

  return (
    <div className="gallery-page">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Gallery" },
        ]}
      />

      <header className="page-header">
        <div className="container">
          <h1>Image Gallery</h1>
          <p>Official art, screenshots and fandom wallpapers.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="toolbar">
            <div className="filter-group" style={{ flex: "1 1 100%" }}>
              <label>Category</label>
              <Chips
                values={categoryIds}
                activeValue={category}
                onChange={setCategory}
                labels={categoryNames}
              />
            </div>
          </div>

          <p className="result-count" id="gallery-count">
            {images.length} images
          </p>

          <div className="gallery-grid" id="gallery-grid">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="gallery-item"
                onClick={() => openLightbox(images, idx)}
                style={{ cursor: "pointer" }}
              >
                <img src={img.image} alt={img.caption} loading="lazy" />
                <div className="caption">{img.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
