import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [timeString, setTimeString] = useState("");
  const [visitorCount, setVisitorCount] = useState(12480);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const date = now.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const time = now.toLocaleTimeString("en-US");
      setTimeString(`${date}  |  ${time}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let count = parseInt(localStorage.getItem("fv_visitors"));
    if (isNaN(count)) count = 12480;
    setVisitorCount(count);
  }, []);

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="logo">
            <span>
              Fandom<b>Verse</b>
            </span>
          </Link>
          <p style={{ marginTop: "12px" }}>
            Your home for anime, gaming, movies, TV shows, K-Pop, comics and manga. Made by fans, for fans.
          </p>
          <div className="footer-info">
            <span>
              Time: <span className="live-clock">{timeString}</span>
            </span>
            <span>
              Visitors: <span className="visitor-count">{visitorCount.toLocaleString()}</span>
            </span>
          </div>
          <div className="socials">
            <a href="#facebook" onClick={(e) => e.preventDefault()}>Facebook</a>
            <a href="#instagram" onClick={(e) => e.preventDefault()}>Instagram</a>
            <a href="#youtube" onClick={(e) => e.preventDefault()}>YouTube</a>
            <a href="#discord" onClick={(e) => e.preventDefault()}>Discord</a>
          </div>
        </div>

        <div>
          <h4>Categories</h4>
          <ul>
            <li>
              <Link to="/category?cat=anime">Anime</Link>
            </li>
            <li>
              <Link to="/category?cat=gaming">Gaming</Link>
            </li>
            <li>
              <Link to="/category?cat=movies">Movies</Link>
            </li>
            <li>
              <Link to="/category?cat=tv">TV Shows</Link>
            </li>
            <li>
              <Link to="/category?cat=kpop">K-Pop</Link>
            </li>
            <li>
              <Link to="/category?cat=comics">Comics</Link>
            </li>
            <li>
              <Link to="/category?cat=manga">Manga</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            <li>
              <Link to="/articles">Featured Articles</Link>
            </li>
            <li>
              <Link to="/gallery">Image Gallery</Link>
            </li>
            <li>
              <Link to="/media">Videos &amp; Audio</Link>
            </li>
            <li>
              <Link to="/trailers">Trailers</Link>
            </li>
            <li>
              <Link to="/characters">Characters</Link>
            </li>
            <li>
              <Link to="/events">Events</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Website</h4>
          <ul>
            <li>
              <Link to="/merchandise">Merch Store</Link>
            </li>
            <li>
              <Link to="/bookmarks">My Bookmarks</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/login">Login</Link> / <Link to="/signup">Sign Up</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        2026 FandomVerse - Student Project. All videos belong to their YouTube owners.
      </div>
    </footer>
  );
}
