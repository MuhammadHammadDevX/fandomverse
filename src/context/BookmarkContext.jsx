import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";
import { useData } from "./DataContext";

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const { showToast } = useToast();
  const { findCard, categoryName } = useData();
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fv_bookmarks")) || [];
    } catch {
      return [];
    }
  });

  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("fv_notes")) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("fv_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    sessionStorage.setItem("fv_notes", JSON.stringify(notes));
  }, [notes]);

  const isBookmarked = (id) => {
    return bookmarks.some((b) => b.id === id);
  };

  const toggleBookmark = (kind, id) => {
    const exists = bookmarks.find((b) => b.id === id);
    if (exists) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      showToast("Removed from bookmarks");
    } else {
      const card = findCard(kind, id);
      if (!card) return;
      const newBm = {
        id: id,
        kind: kind,
        title: card.title,
        image: card.image,
        category: card.category,
        savedAt: new Date().toISOString(),
      };
      setBookmarks((prev) => [...prev, newBm]);
      showToast("Saved to bookmarks");
    }
  };

  const saveNote = (id, text) => {
    setNotes((prev) => {
      const updated = { ...prev };
      if (text && text.trim()) {
        updated[id] = text.trim();
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const getNote = (id) => {
    return notes[id] || "";
  };

  const clearBookmarks = () => {
    if (window.confirm("Remove all bookmarks?")) {
      setBookmarks([]);
      setNotes({});
      sessionStorage.removeItem("fv_notes");
      showToast("All bookmarks cleared");
    }
  };

  const exportBookmarks = () => {
    if (bookmarks.length === 0) {
      showToast("You have no bookmarks to export");
      return;
    }

    let text = "FANDOMVERSE - MY BOOKMARKS\n";
    text += "Exported on: " + new Date().toLocaleString() + "\n";
    text += "Total: " + bookmarks.length + " items\n";
    text += "==========================================\n\n";

    const kinds = ["article", "video", "audio", "gallery", "character", "event", "merchandise", "release"];
    kinds.forEach((kind) => {
      const group = bookmarks.filter((b) => b.kind === kind);
      if (group.length === 0) return;

      text += kind.toUpperCase() + "S (" + group.length + ")\n";
      text += "------------------------------------------\n";
      group.forEach((b, i) => {
        text += i + 1 + ". " + b.title + "\n";
        text += "   Category: " + categoryName(b.category) + "\n";
        text += "   Saved: " + new Date(b.savedAt).toLocaleDateString() + "\n";
        if (notes[b.id]) {
          text += "   Note: " + notes[b.id] + "\n";
        }
        text += "\n";
      });
    });

    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "fandomverse-bookmarks.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast("Bookmarks exported");
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        notes,
        isBookmarked,
        toggleBookmark,
        saveNote,
        getNote,
        clearBookmarks,
        exportBookmarks,
        bookmarkCount: bookmarks.length,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  return useContext(BookmarkContext);
}
