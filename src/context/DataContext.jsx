import React, { createContext, useContext, useState, useEffect } from "react";
import fandomsJson from "../data/fandoms.json";
import chatbotJson from "../data/chatbot.json";

const DataContext = createContext();

export const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(dateString) {
  if (!dateString) return "";
  let d = new Date(dateString + "T00:00:00");
  if (isNaN(d.getTime())) return dateString;
  return d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
}

export function isUpcoming(dateString) {
  if (!dateString) return false;
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateString + "T00:00:00") >= today;
}

export function formatPrice(num) {
  return "Rs. " + Number(num || 0).toLocaleString("en-PK");
}

export function fixAssetUrl(url) {
  if (!url) return "/Images/placeholder.svg";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  if (url.startsWith("/")) return url;
  return "/" + url;
}

export function DataProvider({ children }) {
  const [siteData, setSiteData] = useState(fandomsJson);
  const [botData, setBotData] = useState(chatbotJson);

  useEffect(() => {
    // If not loaded, fallback to fetch
    if (!siteData) {
      fetch("/Data/fandoms.json")
        .then((res) => res.json())
        .then((data) => setSiteData(data))
        .catch(() => setSiteData(fandomsJson));
    }
    if (!botData) {
      fetch("/Data/chatbot.json")
        .then((res) => res.json())
        .then((data) => setBotData(data))
        .catch(() => setBotData(chatbotJson));
    }
  }, [siteData, botData]);

  const getCategory = (id) => {
    if (!siteData?.categories) return null;
    return siteData.categories.find((c) => c.id === id) || null;
  };

  const categoryName = (id) => {
    const cat = getCategory(id);
    return cat ? cat.name : id;
  };

  const makeCard = (kind, item) => {
    let card = {
      kind: kind,
      id: item.id,
      category: item.category,
      title: item.title || item.name,
      image: fixAssetUrl(item.image),
      description: item.description || item.biography || "",
      tags: item.tags || [],
      date: item.date || "2020-01-01",
      popularity: item.popularity || 50,
      featured: item.featured || false,
      typeLabel: kind,
      item: {
        ...item,
        image: fixAssetUrl(item.image),
        file: item.file ? fixAssetUrl(item.file) : undefined,
      },
    };

    if (kind === "video") card.typeLabel = item.videoType;
    if (kind === "audio") card.typeLabel = item.audioType;
    if (kind === "character") {
      card.typeLabel = "character";
      card.tags = item.franchise ? [item.franchise] : [];
    }
    if (kind === "merchandise") card.typeLabel = "merch";
    return card;
  };

  const makeGalleryCard = (catId) => {
    if (!siteData?.gallery) return null;
    let images = siteData.gallery.filter((g) => g.category === catId).map(img => ({
      ...img,
      image: fixAssetUrl(img.image)
    }));
    return {
      kind: "gallery",
      id: "gallery-" + catId,
      category: catId,
      title: categoryName(catId) + " Image Gallery",
      image: images.length ? images[0].image : "/Images/placeholder.svg",
      description: images.length + " images - click to open the gallery viewer.",
      tags: ["Gallery"],
      date: "2026-09-01",
      popularity: 75,
      featured: false,
      typeLabel: "gallery",
      item: { images: images },
    };
  };

  const getAllCards = (catId) => {
    if (!siteData) return [];
    let cards = [];
    const d = siteData;

    const add = (list, kind) => {
      if (!list) return;
      list.forEach((item) => {
        if (!catId || item.category === catId) {
          cards.push(makeCard(kind, item));
        }
      });
    };

    add(d.articles, "article");
    add(d.videos, "video");
    add(d.audio, "audio");
    add(d.characters, "character");
    add(d.events, "event");
    add(d.merchandise, "merchandise");
    add(d.releases, "release");

    if (d.categories) {
      d.categories.forEach((c) => {
        if (!catId || c.id === catId) {
          const gCard = makeGalleryCard(c.id);
          if (gCard) cards.push(gCard);
        }
      });
    }

    return cards;
  };

  const findCard = (kind, id) => {
    return getAllCards().find((c) => c.kind === kind && c.id === id);
  };

  const sortCards = (cards, sortBy) => {
    let list = cards.slice();
    if (sortBy === "az") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "za") {
      list.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      // popular + featured first
      list.sort((a, b) => {
        return (b.featured ? 1000 : 0) + b.popularity - ((a.featured ? 1000 : 0) + a.popularity);
      });
    }
    return list;
  };

  return (
    <DataContext.Provider
      value={{
        siteData,
        botData,
        getCategory,
        categoryName,
        makeCard,
        makeGalleryCard,
        getAllCards,
        findCard,
        sortCards,
        formatDate,
        isUpcoming,
        formatPrice,
        fixAssetUrl,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
