import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useBookmarks } from "../context/BookmarkContext";
import { useModal } from "../context/ModalContext";
import { Chips, Breadcrumb } from "../components/CommonUI";

export default function Bookmarks() {
  const { categoryName } = useData();
  const {
    bookmarks,
    notes,
    saveNote,
    toggleBookmark,
    clearBookmarks,
    exportBookmarks,
  } = useBookmarks();
  const { openItem } = useModal();

  const [filter, setFilter] = useState("all");
  const [localNotes, setLocalNotes] = useState({});
  const [noteSavedMsg, setNoteSavedMsg] = useState({});

  const filterValues = [
    "all", "article", "video", "audio", "gallery", "character", "event", "merchandise", "release"
  ];
  const filterLabels = [
    "All", "Articles", "Videos", "Audio", "Galleries", "Characters", "Events", "Merchandise", "Releases"
  ];

  const filteredBookmarks =
    filter === "all"
      ? bookmarks
      : bookmarks.filter((b) => b.kind === filter);

  const handleNoteChange = (id, text) => {
    setLocalNotes((prev) => ({ ...prev, [id]: text }));
  };

  const handleSaveNote = (id) => {
    const text = localNotes[id] !== undefined ? localNotes[id] : notes[id] || "";
    saveNote(id, text);
    setNoteSavedMsg((prev) => ({ ...prev, [id]: "Note saved for this session" }));
    setTimeout(() => {
      setNoteSavedMsg((prev) => ({ ...prev, [id]: "" }));
    }, 2000);
  };

  return (
    <div className="bookmarks-page">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Saved Bookmarks" },
        ]}
      />

      <header className="page-header">
        <div className="container">
          <h1>Saved Bookmarks</h1>
          <p>Your personal collection of articles, videos, characters and events.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="toolbar">
            <div className="filter-group" style={{ flex: "1 1 100%" }}>
              <label>Filter by type</label>
              <Chips
                values={filterValues}
                activeValue={filter}
                onChange={setFilter}
                labels={filterLabels}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
              <button
                className="btn btn-small"
                onClick={exportBookmarks}
                disabled={bookmarks.length === 0}
              >
                Export as .txt
              </button>
              <button
                className="btn btn-small btn-danger"
                onClick={clearBookmarks}
                disabled={bookmarks.length === 0}
              >
                Clear all
              </button>
            </div>
          </div>

          <p className="result-count">
            Total bookmarks: <span id="bookmark-total">{bookmarks.length}</span>
          </p>

          <div id="bookmark-list">
            {filteredBookmarks.length === 0 ? (
              <div className="empty-box">
                <p>
                  No bookmarks here yet. Click the Save button on any card to add it here.
                </p>
                <Link className="btn" to="/" style={{ marginTop: "15px" }}>
                  Explore content
                </Link>
              </div>
            ) : (
              filteredBookmarks.map((b) => {
                const currentNote =
                  localNotes[b.id] !== undefined ? localNotes[b.id] : notes[b.id] || "";
                return (
                  <div key={`${b.kind}-${b.id}`} className="bookmark-row">
                    <img src={b.image} alt={b.title} />
                    <div style={{ flex: 1 }}>
                      <div className="card-meta">
                        <span className="cat-chip">{categoryName(b.category)}</span>
                        <span style={{ textTransform: "capitalize" }}>{b.kind}</span>
                      </div>
                      <h3>{b.title}</h3>
                      <small style={{ color: "var(--muted)" }}>
                        Saved on {new Date(b.savedAt).toLocaleDateString()}
                      </small>
                      <textarea
                        value={currentNote}
                        onChange={(e) => handleNoteChange(b.id, e.target.value)}
                        placeholder="Write a personal note (kept only for this session)..."
                      />
                      <div className="bookmark-actions">
                        <button
                          className="btn btn-small"
                          onClick={() => handleSaveNote(b.id)}
                        >
                          Save note
                        </button>
                        <button
                          className="btn btn-small btn-outline"
                          onClick={() => openItem(b.kind, b.id)}
                        >
                          Open
                        </button>
                        <button
                          className="btn btn-small btn-danger"
                          onClick={() => toggleBookmark(b.kind, b.id)}
                        >
                          Remove
                        </button>
                        {noteSavedMsg[b.id] && (
                          <span className="note-saved">{noteSavedMsg[b.id]}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
