import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import Card from "../components/Card";
import { Breadcrumb } from "../components/CommonUI";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";

  const { siteData, categoryName, getAllCards, sortCards } = useData();

  const [searchText, setSearchText] = useState(initialQ);
  const [category, setCategory] = useState("all");
  const [contentType, setContentType] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    setSearchText(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(searchText.trim() ? { q: searchText.trim() } : {});
  };

  const results = useMemo(() => {
    let cards = getAllCards();
    const q = searchText.trim().toLowerCase();

    if (q) {
      const words = q.split(" ").filter(Boolean);
      cards = cards.filter((c) => {
        const item = c.item || {};
        const haystack = (
          c.title +
          " " +
          c.description +
          " " +
          c.tags.join(" ") +
          " " +
          categoryName(c.category) +
          " " +
          (item.series || "") +
          " " +
          (item.franchise || "") +
          " " +
          (item.location || "")
        ).toLowerCase();
        return words.every((w) => haystack.includes(w));
      });
    }

    if (category !== "all") {
      cards = cards.filter((c) => c.category === category);
    }
    if (contentType !== "all") {
      cards = cards.filter((c) => c.kind === contentType);
    }

    return sortCards(cards, sortBy);
  }, [getAllCards, searchText, category, contentType, sortBy, categoryName, sortCards]);

  return (
    <div className="search-page">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Search" },
        ]}
      />

      <header className="page-header">
        <div className="container">
          <h1>Global Search</h1>
          <p>Find articles, trailers, audio, characters, events and merch.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <form className="search-toolbar" id="search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrap" style={{ flex: "1 1 100%" }}>
              <input
                type="text"
                id="search-input"
                placeholder="Search by keyword, name, franchise, actor..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button className="btn" type="submit">
                Search
              </button>
            </div>

            <div className="search-filters">
              <div className="filter-group">
                <label htmlFor="search-category">Category</label>
                <select
                  id="search-category"
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
                <label htmlFor="search-type">Content type</label>
                <select
                  id="search-type"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                >
                  <option value="all">All types</option>
                  <option value="article">Articles</option>
                  <option value="gallery">Galleries</option>
                  <option value="video">Videos &amp; Trailers</option>
                  <option value="audio">Audio &amp; Podcasts</option>
                  <option value="character">Characters</option>
                  <option value="event">Events</option>
                  <option value="merchandise">Merchandise</option>
                  <option value="release">Releases</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="search-sort">Sort by</label>
                <select
                  id="search-sort"
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
          </form>

          <p className="result-count" id="search-summary">
            {searchText.trim() ? (
              <>
                Found <strong>{results.length}</strong> results for "
                <strong>{searchText}</strong>"
              </>
            ) : (
              <>
                Showing all <strong>{results.length}</strong> items. Type something to search.
              </>
            )}
          </p>

          {results.length === 0 ? (
            <div className="empty-box">
              <p>No results. Try a different word or remove the filters.</p>
            </div>
          ) : (
            <div className="card-grid" id="search-results">
              {results.map((card) => (
                <Card key={`${card.kind}-${card.id}`} card={card} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
