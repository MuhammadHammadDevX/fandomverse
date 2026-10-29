import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import Card from "../components/Card";
import { Breadcrumb } from "../components/CommonUI";

export default function Characters() {
  const [searchParams] = useSearchParams();
  const initCat = searchParams.get("cat") || "all";

  const { siteData, sortCards, makeCard } = useData();

  const [category, setCategory] = useState(initCat);
  const [franchise, setFranchise] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [searchText, setSearchText] = useState("");

  // When category changes, reset franchise to 'all' if current franchise not in new category
  const franchises = useMemo(() => {
    if (!siteData?.characters) return [];
    const list = [];
    siteData.characters.forEach((c) => {
      if (
        (category === "all" || c.category === category) &&
        !list.includes(c.franchise)
      ) {
        list.push(c.franchise);
      }
    });
    list.sort();
    return list;
  }, [siteData, category]);

  useEffect(() => {
    if (franchise !== "all" && !franchises.includes(franchise)) {
      setFranchise("all");
    }
  }, [franchises, franchise]);

  const characterCards = useMemo(() => {
    if (!siteData?.characters) return [];
    const q = searchText.trim().toLowerCase();

    const filtered = siteData.characters
      .filter((c) => {
        const matchCat = category === "all" || c.category === category;
        const matchFran = franchise === "all" || c.franchise === franchise;
        const matchSearch =
          !q || (c.name + " " + c.series + " " + c.franchise).toLowerCase().includes(q);
        return matchCat && matchFran && matchSearch;
      })
      .map((c) => makeCard("character", c));

    return sortCards(filtered, sortBy);
  }, [siteData, category, franchise, searchText, sortBy, makeCard, sortCards]);

  return (
    <div className="characters-page">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Characters" },
        ]}
      />

      <header className="page-header">
        <div className="container">
          <h1>Character Profiles</h1>
          <p>Biographies, traits and details for heroes, villains and icons.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="toolbar">
            <div className="filter-group">
              <label htmlFor="char-category">Category</label>
              <select
                id="char-category"
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
              <label htmlFor="char-franchise">Franchise</label>
              <select
                id="char-franchise"
                value={franchise}
                onChange={(e) => setFranchise(e.target.value)}
              >
                <option value="all">All franchises</option>
                {franchises.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="char-sort">Sort by</label>
              <select
                id="char-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Popular / Featured</option>
                <option value="az">A to Z</option>
                <option value="za">Z to A</option>
              </select>
            </div>

            <div className="filter-group" style={{ flex: "1" }}>
              <label htmlFor="char-search">Search character</label>
              <input
                type="text"
                id="char-search"
                placeholder="Type a character or series name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          <p className="result-count" id="char-count">
            {characterCards.length} characters
          </p>

          {characterCards.length === 0 ? (
            <div className="empty-box">
              <p>No characters found matching your filters.</p>
            </div>
          ) : (
            <div className="card-grid" id="char-grid">
              {characterCards.map((card) => (
                <Card key={`char-${card.id}`} card={card} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
