import React, { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useModal } from "../context/ModalContext";
import Card from "../components/Card";
import { Chips, Breadcrumb } from "../components/CommonUI";

export default function Category() {
  const [searchParams] = useSearchParams();
  const catId = searchParams.get("cat") || "anime";

  const { siteData, getCategory, getAllCards, sortCards, makeCard } = useData();
  const { openLightbox } = useModal();

  const cat = getCategory(catId);

  // Filter state for catalog
  const [contentType, setContentType] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [searchText, setSearchText] = useState("");

  // Media section filter
  const [mediaTypeFilter, setMediaTypeFilter] = useState("all");

  const categoryCards = useMemo(() => {
    if (!cat) return [];
    let cards = getAllCards(catId);

    if (contentType !== "all") {
      cards = cards.filter((c) => c.kind === contentType);
    }
    if (tagFilter !== "all") {
      cards = cards.filter((c) => c.tags && c.tags.includes(tagFilter));
    }
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      cards = cards.filter((c) => {
        const hay = `${c.title} ${c.description} ${c.tags.join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
    }

    return sortCards(cards, sortBy);
  }, [cat, catId, contentType, tagFilter, searchText, sortBy, getAllCards, sortCards]);

  const galleryImages = useMemo(() => {
    if (!siteData?.gallery || !cat) return [];
    return siteData.gallery.filter((g) => g.category === catId);
  }, [siteData, cat, catId]);

  const mediaCards = useMemo(() => {
    if (!siteData || !cat) return [];
    const videos = (siteData.videos || [])
      .filter((v) => v.category === catId)
      .map((v) => makeCard("video", v));
    const audio = (siteData.audio || [])
      .filter((a) => a.category === catId)
      .map((a) => makeCard("audio", a));
    const all = [...videos, ...audio];

    if (mediaTypeFilter === "all") {
      return sortCards(all, "popular");
    }
    return sortCards(
      all.filter((m) => m.typeLabel === mediaTypeFilter),
      "popular"
    );
  }, [siteData, cat, catId, mediaTypeFilter, makeCard, sortCards]);

  const mediaTypes = useMemo(() => {
    if (!siteData || !cat) return ["all"];
    const set = new Set(["all"]);
    (siteData.videos || [])
      .filter((v) => v.category === catId)
      .forEach((v) => set.add(v.videoType));
    (siteData.audio || [])
      .filter((a) => a.category === catId)
      .forEach((a) => set.add(a.audioType));
    return Array.from(set);
  }, [siteData, cat, catId]);

  const characterCards = useMemo(() => {
    if (!siteData?.characters || !cat) return [];
    return siteData.characters
      .filter((c) => c.category === catId)
      .map((c) => makeCard("character", c));
  }, [siteData, cat, catId, makeCard]);

  const eventCards = useMemo(() => {
    if (!siteData?.events || !cat) return [];
    return siteData.events
      .filter((e) => e.category === catId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((e) => makeCard("event", e));
  }, [siteData, cat, catId, makeCard]);

  if (!cat) {
    return (
      <div className="container section">
        <div className="empty-box">
          <p>Category not found.</p>
          <Link className="btn" to="/">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  const typeValues = [
    "all", "article", "gallery", "video", "audio", "character", "event", "merchandise", "release"
  ];
  const typeLabels = [
    "All", "Articles", "Galleries", "Videos", "Audio", "Characters", "Events", "Merchandise", "Releases"
  ];

  const tagValues = ["all", ...(cat.tags || [])];
  const tagLabels = ["All tags", ...(cat.tags || [])];

  return (
    <div className="category-page">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/#category-grid" },
          { label: cat.name },
        ]}
      />

      <div id="hub-content">
        <section className="hub-banner">
          <img id="hub-img" src={cat.banner} alt={cat.name} />
          <div className="container">
            <h1 id="hub-title">{cat.name}</h1>
            <p id="hub-intro">{cat.intro}</p>
          </div>
        </section>

        {/* Quick links inside hub */}
        <nav className="hub-nav">
          <div className="container">
            <a href="#catalog">Catalog</a>
            <a href="#gallery">Gallery</a>
            <a href="#media">Videos &amp; Audio</a>
            <a href="#characters">Characters</a>
            <a href="#events">Events</a>
          </div>
        </nav>

        {/* Catalog */}
        <section className="section" id="catalog">
          <div className="container">
            <div className="section-title">
              <h2>Content Catalog</h2>
            </div>

            <div className="toolbar">
              <div className="filter-group" style={{ flex: "1 1 100%" }}>
                <label>Content type</label>
                <Chips
                  values={typeValues}
                  activeValue={contentType}
                  onChange={setContentType}
                  labels={typeLabels}
                />
              </div>

              <div className="filter-group" style={{ flex: "1 1 100%" }}>
                <label>Tags</label>
                <Chips
                  values={tagValues}
                  activeValue={tagFilter}
                  onChange={setTagFilter}
                  labels={tagLabels}
                />
              </div>

              <div className="filter-group">
                <label htmlFor="hub-sort">Sort by</label>
                <select
                  id="hub-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popular">Popular / Featured</option>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="az">A to Z</option>
                  <option value="za">Z to A</option>
                </select>
              </div>

              <div className="filter-group" style={{ flex: "1" }}>
                <label htmlFor="hub-search">Search in this category</label>
                <input
                  type="text"
                  id="hub-search"
                  placeholder="Type a title..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>

            <p className="result-count" id="hub-count">
              Showing {categoryCards.length} items
            </p>

            {categoryCards.length === 0 ? (
              <div className="empty-box">
                <p>Nothing found. Try another filter.</p>
              </div>
            ) : (
              <div className="card-grid" id="hub-catalog">
                {categoryCards.map((card) => (
                  <Card key={`${card.kind}-${card.id}`} card={card} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Gallery */}
        <section className="section alt" id="gallery">
          <div className="container">
            <div className="section-title">
              <h2>Image Gallery</h2>
              <p>Click any image to open it. Use the arrow keys to move between pictures.</p>
            </div>
            <div className="gallery-grid" id="hub-gallery">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="gallery-item"
                  onClick={() => openLightbox(galleryImages, idx)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={img.image} alt={img.caption} loading="lazy" />
                  <div className="caption">{img.caption}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Videos and audio */}
        <section className="section" id="media">
          <div className="container">
            <div className="section-title">
              <h2>Videos &amp; Audio</h2>
              <Chips
                values={mediaTypes}
                activeValue={mediaTypeFilter}
                onChange={setMediaTypeFilter}
              />
            </div>
            <div className="card-grid" id="hub-media">
              {mediaCards.map((card) => (
                <Card key={`${card.kind}-${card.id}`} card={card} />
              ))}
            </div>
          </div>
        </section>

        {/* Characters */}
        <section className="section alt" id="characters">
          <div className="container">
            <div className="section-title">
              <h2>Character Profiles</h2>
              <Link className="view-all" to={`/characters?cat=${catId}`}>
                All characters{" "}
              </Link>
            </div>
            <div className="card-grid" id="hub-characters">
              {characterCards.map((card) => (
                <Card key={`char-${card.id}`} card={card} />
              ))}
            </div>
          </div>
        </section>

        {/* Events */}
        <section className="section" id="events">
          <div className="container">
            <div className="section-title">
              <h2>Event Highlights</h2>
              <Link className="view-all" to="/events">
                All events{" "}
              </Link>
            </div>
            <div className="card-grid" id="hub-events">
              {eventCards.map((card) => (
                <Card key={`event-${card.id}`} card={card} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
