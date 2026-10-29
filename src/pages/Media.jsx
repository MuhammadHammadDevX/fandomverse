import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import Card from "../components/Card";
import { Breadcrumb } from "../components/CommonUI";

export default function Media() {
  const [searchParams] = useSearchParams();
  const initType = searchParams.get("type") || "all";
  const initCat = searchParams.get("cat") || "all";

  const { siteData, sortCards, makeCard } = useData();

  const [category, setCategory] = useState(initCat);
  const [mediaType, setMediaType] = useState(initType);
  const [sortBy, setSortBy] = useState("popular");

  const mediaCards = useMemo(() => {
    if (!siteData) return [];
    const videos = (siteData.videos || []).map((v) => makeCard("video", v));
    const audio = (siteData.audio || []).map((a) => makeCard("audio", a));
    const all = [...videos, ...audio];

    let filtered = all.filter((c) => {
      const matchCat = category === "all" || c.category === category;
      const matchType = mediaType === "all" || c.typeLabel === mediaType;
      return matchCat && matchType;
    });

    return sortCards(filtered, sortBy);
  }, [siteData, category, mediaType, sortBy, makeCard, sortCards]);

  return (
    <div className="media-page">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Videos & Audio" },
        ]}
      />

      <header className="page-header">
        <div className="container">
          <h1>Videos &amp; Audio</h1>
          <p>Trailers, music videos, podcasts, interviews and fan content.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="toolbar">
            <div className="filter-group">
              <label htmlFor="media-category">Category</label>
              <select
                id="media-category"
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
              <label htmlFor="media-type">Content type</label>
              <select
                id="media-type"
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
              >
                <option value="all">All types</option>
                <option value="trailer">Trailers</option>
                <option value="music-video">Music videos</option>
                <option value="fan-content">Fan animations / edits</option>
                <option value="clip">Clips</option>
                <option value="podcast">Podcasts</option>
                <option value="interview">Interviews</option>
                <option value="fan-podcast">Fan podcasts</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="media-sort">Sort by</label>
              <select
                id="media-sort"
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
          </div>

          <p className="result-count" id="media-count">
            Showing {mediaCards.length} videos and audio clips
          </p>

          {mediaCards.length === 0 ? (
            <div className="empty-box">
              <p>No media found for this filter.</p>
            </div>
          ) : (
            <div className="card-grid" id="media-grid">
              {mediaCards.map((card) => (
                <Card key={`${card.kind}-${card.id}`} card={card} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
