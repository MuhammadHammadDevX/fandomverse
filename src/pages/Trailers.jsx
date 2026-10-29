import React, { useState, useMemo } from "react";
import { useData } from "../context/DataContext";
import Card from "../components/Card";
import { Chips, Breadcrumb } from "../components/CommonUI";

export default function Trailers() {
  const { siteData, sortCards, makeCard } = useData();

  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const categoryIds = useMemo(() => {
    if (!siteData?.categories) return ["all"];
    return ["all", ...siteData.categories.map((c) => c.id)];
  }, [siteData]);

  const categoryNames = useMemo(() => {
    if (!siteData?.categories) return ["All"];
    return ["All", ...siteData.categories.map((c) => c.name)];
  }, [siteData]);

  const trailerCards = useMemo(() => {
    if (!siteData?.videos) return [];
    const trailers = siteData.videos.filter((v) => v.videoType === "trailer");

    const filtered = trailers
      .filter((v) => {
        const matchCat = category === "all" || v.category === category;
        const matchStatus =
          status === "all" ||
          v.status === status ||
          (status === "released" && v.status !== "upcoming");
        return matchCat && matchStatus;
      })
      .map((v) => makeCard("video", v));

    return sortCards(filtered, "newest");
  }, [siteData, category, status, makeCard, sortCards]);

  return (
    <div className="trailers-page">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Trailers" },
        ]}
      />

      <header className="page-header">
        <div className="container">
          <h1>Trailers &amp; Teasers</h1>
          <p>Official trailers for upcoming anime, games, movies and TV series.</p>
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

            <div className="filter-group" style={{ flex: "1 1 100%" }}>
              <label>Release status</label>
              <Chips
                values={["all", "upcoming", "recent", "released"]}
                activeValue={status}
                onChange={setStatus}
                labels={["Any status", "Upcoming", "Recently released", "All released"]}
              />
            </div>
          </div>

          <p className="result-count" id="trailer-count">
            {trailerCards.length} trailers
          </p>

          {trailerCards.length === 0 ? (
            <div className="empty-box">
              <p>No trailers found for this filter.</p>
            </div>
          ) : (
            <div className="card-grid" id="trailer-grid">
              {trailerCards.map((card) => (
                <Card key={`trailer-${card.id}`} card={card} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
