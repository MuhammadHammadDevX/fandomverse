import React from "react";
import { Link } from "react-router-dom";
import { useData, monthNames } from "../context/DataContext";
import { useBookmarks } from "../context/BookmarkContext";
import { useModal } from "../context/ModalContext";

export default function Card({ card }) {
  const { categoryName, formatPrice, formatDate, isUpcoming } = useData();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { openItem } = useModal();

  if (!card) return null;

  const item = card.item || {};
  const saved = isBookmarked(card.id);

  let extraTop = null;
  let extraBody = null;
  let cardClass = "card";

  if (card.kind === "video") {
    if (item.status === "upcoming") {
      extraTop = <span className="status-badge upcoming">Upcoming</span>;
    } else if (item.status === "recent") {
      extraTop = <span className="status-badge">Recently released</span>;
    }
  }

  if (card.kind === "audio") {
    cardClass += " audio-card";
    extraBody = (
      <audio
        controls
        preload="none"
        src={item.file}
        style={{ width: "100%", marginTop: "8px" }}
      />
    );
  }

  if (card.kind === "character") {
    cardClass += " character-card";
    if (item.traits && item.traits.length > 0) {
      extraBody = (
        <div className="traits">
          {item.traits.map((t, idx) => (
            <span key={idx} className="trait">
              {t}
            </span>
          ))}
        </div>
      );
    }
  }

  if (card.kind === "event") {
    cardClass += " event-card";
    const d = new Date(item.date + "T00:00:00");
    const day = isNaN(d.getTime()) ? "" : d.getDate();
    const monthYear = isNaN(d.getTime())
      ? ""
      : `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    const upcoming = isUpcoming(item.date);

    extraTop = (
      <>
        <div className="date-box">
          <strong>{day}</strong>
          <span>{monthYear}</span>
        </div>
        {upcoming ? (
          <span className="status-badge upcoming">Upcoming</span>
        ) : (
          <span className="status-badge older">Past event</span>
        )}
      </>
    );
    extraBody = <p className="event-info">Location: {item.location}</p>;
  }

  if (card.kind === "release") {
    extraTop = (
      <span className={`status-badge ${item.status === "upcoming" ? "upcoming" : ""}`}>
        {item.status === "upcoming" ? "Coming soon" : "Out now"}
      </span>
    );
    extraBody = (
      <p className="event-info">
        Release: {item.dateText || formatDate(item.date)}
      </p>
    );
  }

  if (card.kind === "merchandise") {
    cardClass += " product-card";
  }

  let metaRight = null;
  if (card.kind === "article") {
    metaRight = item.readTime;
  } else if (card.kind === "audio") {
    metaRight = `Length ${item.duration}`;
  } else if (card.kind === "merchandise") {
    metaRight = (
      <span className="price">
        {formatPrice(item.priceMin)} - {formatPrice(item.priceMax)}
      </span>
    );
  } else if (card.kind === "character") {
    metaRight = item.series;
  }

  const handleCardClick = () => {
    openItem(card.kind, card.id, item);
  };

  return (
    <div className={cardClass}>
      <div className="card-img" onClick={handleCardClick} style={{ cursor: "pointer" }}>
        <span className="type-badge">{card.typeLabel}</span>
        <img
          src={card.image}
          alt={card.title}
          loading="lazy"
          onError={(e) => {
            if (!e.target.dataset.failed) {
              e.target.dataset.failed = "yes";
              e.target.src = "/Images/placeholder.svg";
            }
          }}
        />
        {extraTop}
      </div>

      <div className="card-body">
        <div className="card-meta">
          <span className="cat-chip">{categoryName(card.category)}</span>
          <span>{metaRight}</span>
        </div>

        <h3 onClick={handleCardClick} style={{ cursor: "pointer" }}>
          {card.title}
        </h3>
        <p>{card.description}</p>
        {extraBody}

        <div className="tags">
          {card.tags?.map((t, idx) => (
            <span key={idx} className="tag">
              #{t}
            </span>
          ))}
        </div>

        <div className="card-actions">
          {card.kind === "video" && (
            <button className="btn btn-small" onClick={handleCardClick}>
              Watch
            </button>
          )}
          {card.kind === "article" && (
            <Link className="btn btn-small" to={`/article?id=${card.id}`}>
              Read more
            </Link>
          )}
          {card.kind === "merchandise" && (
            <button className="btn btn-small" onClick={handleCardClick}>
              Details
            </button>
          )}
          {card.kind === "gallery" && (
            <button className="btn btn-small" onClick={handleCardClick}>
              Open
            </button>
          )}
          {["character", "event", "release"].includes(card.kind) && (
            <button className="btn btn-small btn-outline" onClick={handleCardClick}>
              View
            </button>
          )}

          <button
            className={`bookmark-btn ${saved ? "saved" : ""}`}
            data-id={card.id}
            title="Bookmark"
            onClick={() => toggleBookmark(card.kind, card.id)}
          >
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
