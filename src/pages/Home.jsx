import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useModal } from "../context/ModalContext";
import Card from "../components/Card";
import { Chips } from "../components/CommonUI";

export default function Home() {
  const { siteData, categoryName, getAllCards, sortCards, makeCard, isUpcoming } = useData();
  const { openVideo } = useModal();

  // Hero Slider
  const [slideIndex, setSlideIndex] = useState(0);
  const [featuredFilter, setFeaturedFilter] = useState("all");

  // Typing effect
  const [typingWord, setTypingWord] = useState("Anime");
  const typingStateRef = useRef({
    wordIndex: 0,
    charIndex: 0,
    deleting: false,
    words: ["Anime", "Gaming", "Movies", "TV Shows", "K-Pop", "Comics", "Manga"],
  });

  // Slider items
  const slides = React.useMemo(() => {
    if (!siteData) return [];
    const list = [
      {
        img: "/Images/hello.jfif",
        tag: "ANIME",
        title: "Welcome to the FandomVerse",
        text: "Anime, gaming, movies, TV, K-Pop, comics and manga - all your fandoms in one place.",
        btn: "Explore Anime",
        link: "/category?cat=anime",
      },
    ];

    const featuredVideos = (siteData.videos || [])
      .filter((v) => v.featured)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 4);

    featuredVideos.forEach((v) => {
      list.push({
        img: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
        tag: `${categoryName(v.category).toUpperCase()}${v.status === "upcoming" ? " - UPCOMING" : ""}`,
        title: v.title,
        text: v.description,
        btn: "Watch Trailer",
        videoId: v.id,
      });
    });

    list.push({
      img: "/Images/banner 1.jfif",
      tag: "MANGA",
      title: "Read. Collect. Discuss.",
      text: "From One Piece to Chainsaw Man - find your next favourite manga.",
      btn: "Explore Manga",
      link: "/category?cat=manga",
    });

    return list;
  }, [siteData, categoryName]);

  // Autoplay slider
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Typing animation
  useEffect(() => {
    let timerId;
    const type = () => {
      const state = typingStateRef.current;
      const currentWord = state.words[state.wordIndex];

      if (!state.deleting && state.charIndex < currentWord.length) {
        state.charIndex++;
        setTypingWord(currentWord.substring(0, state.charIndex));
        timerId = setTimeout(type, 120);
      } else if (state.deleting && state.charIndex > 0) {
        state.charIndex--;
        setTypingWord(currentWord.substring(0, state.charIndex));
        timerId = setTimeout(type, 60);
      } else {
        state.deleting = !state.deleting;
        if (!state.deleting) {
          state.wordIndex = (state.wordIndex + 1) % state.words.length;
        }
        timerId = setTimeout(type, state.deleting ? 1400 : 300);
      }
    };
    timerId = setTimeout(type, 300);
    return () => clearTimeout(timerId);
  }, []);

  if (!siteData) return null;

  // Stats
  const articleCount = siteData.articles?.length || 0;
  const mediaCount = (siteData.videos?.length || 0) + (siteData.audio?.length || 0);
  const charCount = siteData.characters?.length || 0;
  const eventCount = siteData.events?.length || 0;

  // Featured Content
  const allFeatured = getAllCards().filter((c) => c.featured);
  const featuredCards =
    featuredFilter === "all"
      ? allFeatured
      : allFeatured.filter((c) => c.kind === featuredFilter);
  const featuredList = sortCards(featuredCards, "popular").slice(0, 8);

  // Latest Trailers
  const trailers = (siteData.videos || [])
    .filter((v) => v.status === "upcoming" || v.status === "recent")
    .map((v) => makeCard("video", v));
  const latestTrailers = sortCards(trailers, "newest").slice(0, 4);

  // Upcoming Events
  const upcomingEvents = (siteData.events || [])
    .filter((e) => isUpcoming(e.date))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4)
    .map((e) => makeCard("event", e));

  // Merch Preview
  const merchCards = (siteData.merchandise || []).map((m) => makeCard("merchandise", m));
  const popularMerch = sortCards(merchCards, "popular").slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Slider */}
      <section className="hero" id="hero">
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={`slide ${idx === slideIndex ? "active" : ""}`}
          >
            <img src={s.img} alt={s.title} />
            <div className="hero-text">
              <span className="featured-tag">{s.tag}</span>
              <h1>{s.title}</h1>
              <p>{s.text}</p>
              {s.videoId ? (
                <button className="btn" onClick={() => openVideo(s.videoId)}>
                  {s.btn}
                </button>
              ) : (
                <Link className="btn" to={s.link}>
                  {s.btn}
                </Link>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="slider-arrow prev"
          onClick={() =>
            setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)
          }
        >
          Prev
        </button>
        <button
          type="button"
          className="slider-arrow next"
          onClick={() => setSlideIndex((prev) => (prev + 1) % slides.length)}
        >
          Next
        </button>
        <div className="slider-dots">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === slideIndex ? "active" : ""}`}
              onClick={() => setSlideIndex(idx)}
            ></span>
          ))}
        </div>
      </section>

      {/* Welcome + animated heading */}
      <section className="welcome">
        <div className="container">
          <h2 className="animated-heading">One Portal. Every Fandom.</h2>
          <p className="typing-line">
            Discover the best of <span className="typing-word" id="typing-word">{typingWord}</span>
          </p>
          <p>
            FandomVerse brings seven fan worlds together. Read articles, watch trailers, browse galleries,
            meet your favourite characters, find fan events near you and save everything you love with bookmarks.
          </p>

          <div className="stats visible">
            <div className="stat">
              <h3 id="stat-articles">{articleCount}</h3>
              <p>Featured articles</p>
            </div>
            <div className="stat">
              <h3 id="stat-videos">{mediaCount}</h3>
              <p>Videos &amp; audio clips</p>
            </div>
            <div className="stat">
              <h3 id="stat-characters">{charCount}</h3>
              <p>Character profiles</p>
            </div>
            <div className="stat">
              <h3 id="stat-events">{eventCount}</h3>
              <p>Fan events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Explore Categories</h2>
            <Link className="view-all" to="/search">
              Browse everything{" "}
            </Link>
          </div>
          <div className="category-grid" id="category-grid">
            {siteData.categories?.map((c) => (
              <Link
                key={c.id}
                className="category-tile"
                to={`/category?cat=${c.id}`}
                style={{ "--tile-color": c.color }}
              >
                <img src={c.banner} alt={c.name} />
                <h3>{c.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured content */}
      <section className="section alt visible">
        <div className="container">
          <div className="section-title">
            <h2>Featured This Week</h2>
            <Chips
              values={["all", "article", "video"]}
              activeValue={featuredFilter}
              onChange={setFeaturedFilter}
              labels={["All featured", "Articles", "Trailers & Videos"]}
            />
          </div>
          <div className="card-grid" id="featured-grid">
            {featuredList.map((card) => (
              <Card key={`${card.kind}-${card.id}`} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest trailers */}
      <section className="section visible">
        <div className="container">
          <div className="section-title">
            <h2>New &amp; Upcoming Trailers</h2>
            <Link className="view-all" to="/trailers">
              All trailers{" "}
            </Link>
          </div>
          <div className="card-grid" id="home-trailers">
            {latestTrailers.map((card) => (
              <Card key={`trailer-${card.id}`} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="section alt visible">
        <div className="container">
          <div className="section-title">
            <h2>Upcoming Events</h2>
            <Link className="view-all" to="/events">
              All events{" "}
            </Link>
          </div>
          <div className="card-grid" id="home-events">
            {upcomingEvents.map((card) => (
              <Card key={`event-${card.id}`} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* Merch preview */}
      <section className="section visible">
        <div className="container">
          <div className="section-title">
            <h2>Fan Merchandise</h2>
            <Link className="view-all" to="/merchandise">
              Visit store{" "}
            </Link>
          </div>
          <div className="card-grid" id="home-merch">
            {popularMerch.map((card) => (
              <Card key={`merch-${card.id}`} card={card} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
