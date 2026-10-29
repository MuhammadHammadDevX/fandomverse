import React, { useState, useMemo } from "react";
import { useData } from "../context/DataContext";
import Card from "../components/Card";
import { Chips, Breadcrumb } from "../components/CommonUI";

export default function Articles() {
  const { siteData, sortCards, makeCard } = useData();

  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const categoryIds = useMemo(() => {
    if (!siteData?.categories) return ["all"];
    return ["all", ...siteData.categories.map((c) => c.id)];
  }, [siteData]);

  const categoryNames = useMemo(() => {
    if (!siteData?.categories) return ["All"];
    return ["All", ...siteData.categories.map((c) => c.name)];
  }, [siteData]);

  const articleCards = useMemo(() => {
    if (!siteData?.articles) return [];
    let list = siteData.articles
      .filter((a) => category === "all" || a.category === category)
      .map((a) => makeCard("article", a));

    return sortCards(list, sortBy);
  }, [siteData, category, sortBy, makeCard, sortCards]);

  return (
    <div className="articles-page">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Articles" },
        ]}
      />

      <header className="page-header">
        <div className="container">
          <h1>Featured Articles</h1>
          <p>Guides, deep dives, news and fandom opinions.</p>
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

            <div className="filter-group">
              <label htmlFor="article-sort">Sort by</label>
              <select
                id="article-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="popular">Popular / Featured</option>
                <option value="az">A to Z</option>
                <option value="za">Z to A</option>
              </select>
            </div>
          </div>

          <p className="result-count">Showing {articleCards.length} articles</p>

          <div className="card-grid" id="article-list">
            {articleCards.map((card) => (
              <Card key={`article-${card.id}`} card={card} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
