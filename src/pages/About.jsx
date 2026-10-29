import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../components/CommonUI";

export default function About() {
  return (
    <div className="about-page">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
      />

      <header className="page-header">
        <div className="container">
          <h1>About FandomVerse</h1>
          <p>Who we are, why we built this and what you can do here.</p>
        </div>
      </header>

      <section className="section">
        <div className="container about-grid visible">
          <img src="/Images/banner 2.jfif" alt="FandomVerse Story" />
          <div>
            <div className="section-title">
              <h2>Our Story</h2>
            </div>
            <p>
              FandomVerse started as a university web development project. We are a small group of students who
              spend way too much time watching anime, playing games and arguing about Marvel vs DC. We wanted one
              place where fans of different things could meet.
            </p>
            <p>
              Instead of opening ten different websites, you can read articles, watch trailers, check upcoming events
              in Pakistan, look at character profiles and save your favourite things - all on FandomVerse.
            </p>
            <p>
              The site is built with modern web technologies and React. All the content is loaded from JSON files, and
              features like bookmarks and the cart use the browser's local and session storage.
            </p>
            <Link className="btn" to="/contact">
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-title">
            <h2>What You Can Do</h2>
          </div>
          <div className="feature-grid visible">
            <div className="feature-box">
              <h3>7 Category Hubs</h3>
              <p>Anime, Gaming, Movies, TV Shows, K-Pop, Comics and Manga - each with its own catalog.</p>
            </div>
            <div className="feature-box">
              <h3>Global Search</h3>
              <p>Search everything and filter by category and content type.</p>
            </div>
            <div className="feature-box">
              <h3>Galleries</h3>
              <p>Image galleries with a lightbox viewer for every category.</p>
            </div>
            <div className="feature-box">
              <h3>Videos &amp; Podcasts</h3>
              <p>Trailers, music videos, fan content, podcasts and interviews.</p>
            </div>
            <div className="feature-box">
              <h3>Character Profiles</h3>
              <p>Bios and traits for heroes, villains and idols.</p>
            </div>
            <div className="feature-box">
              <h3>Events</h3>
              <p>Conventions, watch parties and meetups in Karachi, Lahore and Islamabad.</p>
            </div>
            <div className="feature-box">
              <h3>Bookmarks &amp; Notes</h3>
              <p>Save anything, add notes and export your list.</p>
            </div>
            <div className="feature-box">
              <h3>Verse Bot</h3>
              <p>Our chatbot answers questions and recommends content.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Meet the Team</h2>
          </div>
          <div className="team-grid visible">
            <div className="team-card">
              <div className="avatar">AH</div>
              <h3>Ali Hassan</h3>
              <p className="role">Team Lead &amp; JavaScript</p>
              <p>Built the search, filters and chatbot. Big One Piece fan.</p>
            </div>
            <div className="team-card">
              <div className="avatar">SN</div>
              <h3>Sara Noor</h3>
              <p className="role">UI / UX Design</p>
              <p>Designed the layout and colours. Watches every K-Drama.</p>
            </div>
            <div className="team-card">
              <div className="avatar">UA</div>
              <h3>Usman Ahmed</h3>
              <p className="role">Content &amp; JSON Data</p>
              <p>Wrote articles and collected trailers. Plays Elden Ring way too much.</p>
            </div>
            <div className="team-card">
              <div className="avatar">MT</div>
              <h3>Mahnoor Tariq</h3>
              <p className="role">HTML / CSS &amp; Testing</p>
              <p>Made the pages responsive and tested everything. BLINK forever.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
