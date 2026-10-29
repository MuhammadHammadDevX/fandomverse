import React, { useState, useMemo } from "react";
import { useData } from "../context/DataContext";
import Card from "../components/Card";
import { Chips, Breadcrumb } from "../components/CommonUI";

export default function Events() {
  const { siteData, isUpcoming, sortCards, makeCard } = useData();

  const [category, setCategory] = useState("all");
  const [when, setWhen] = useState("upcoming");

  const categoryIds = useMemo(() => {
    if (!siteData?.categories) return ["all"];
    return ["all", ...siteData.categories.map((c) => c.id)];
  }, [siteData]);

  const categoryNames = useMemo(() => {
    if (!siteData?.categories) return ["All"];
    return ["All", ...siteData.categories.map((c) => c.name)];
  }, [siteData]);

  const eventCards = useMemo(() => {
    if (!siteData?.events) return [];
    let list = siteData.events.filter((e) => {
      const up = isUpcoming(e.date);
      const matchWhen =
        when === "all" || (when === "upcoming" && up) || (when === "past" && !up);
      const matchCat = category === "all" || e.category === category;
      return matchWhen && matchCat;
    });

    list.sort((a, b) => {
      return when === "upcoming"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    });

    return list.map((e) => makeCard("event", e));
  }, [siteData, category, when, isUpcoming, makeCard]);

  const releaseCards = useMemo(() => {
    if (!siteData?.releases) return [];
    const list = siteData.releases.map((r) => makeCard("release", r));
    return sortCards(list, "newest");
  }, [siteData, makeCard, sortCards]);

  return (
    <div className="events-page">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Events" },
        ]}
      />

      <header className="page-header">
        <div className="container">
          <h1>Fan Events &amp; Conventions</h1>
          <p>Meetups, watch parties, gaming tournaments and comic cons.</p>
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
              <label>When</label>
              <Chips
                values={["upcoming", "past", "all"]}
                activeValue={when}
                onChange={setWhen}
                labels={["Upcoming", "Past", "All events"]}
              />
            </div>
          </div>

          <p className="result-count" id="event-count">
            {eventCards.length} events
          </p>

          {eventCards.length === 0 ? (
            <div className="empty-box">
              <p>No events for this filter.</p>
            </div>
          ) : (
            <div className="card-grid" id="event-grid">
              {eventCards.map((card) => (
                <Card key={`event-${card.id}`} card={card} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Scheduled releases section */}
      <section className="section alt">
        <div className="container">
          <div className="section-title">
            <h2>Scheduled Media Releases</h2>
            <p>Official games, anime seasons, movie premieres and comics drops.</p>
          </div>
          <div className="card-grid" id="release-grid">
            {releaseCards.map((card) => (
              <Card key={`release-${card.id}`} card={card} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
