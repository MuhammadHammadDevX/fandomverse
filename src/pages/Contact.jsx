import React, { useState } from "react";
import { Breadcrumb } from "../components/CommonUI";

const OFFICE = { lat: 24.8607, lng: 67.0011 };

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General question",
    message: "",
  });
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });

  const [mapUrl, setMapUrl] = useState(
    `https://maps.google.com/maps?q=${OFFICE.lat},${OFFICE.lng}&z=13&output=embed`
  );
  const [gpsInfo, setGpsInfo] = useState(
    'Click "Use my GPS location" and allow location access in your browser.'
  );
  const [gpsData, setGpsData] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (name.length < 3) {
      setFormMsg({ type: "error", text: "Please enter your full name." });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setFormMsg({ type: "error", text: "Please enter a valid email address." });
      return;
    }
    if (message.length < 10) {
      setFormMsg({ type: "error", text: "Message should be at least 10 characters." });
      return;
    }

    setFormMsg({
      type: "ok",
      text: `Thank you ${name}! This is a demo form so the message was not really sent, but we got your point :)`,
    });
    setFormData({ name: "", email: "", subject: "General question", message: "" });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsInfo("Sorry, your browser does not support GPS location.");
      setGpsData(null);
      return;
    }

    setGpsInfo("Finding your location...");
    setGpsData(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const km = distanceKm(lat, lng, OFFICE.lat, OFFICE.lng);

        setGpsData({
          lat: lat.toFixed(4),
          lng: lng.toFixed(4),
          accuracy: Math.round(pos.coords.accuracy),
          km: km.toFixed(1),
          directionsUrl: `https://www.google.com/maps/dir/${lat},${lng}/${OFFICE.lat},${OFFICE.lng}`,
        });
        setGpsInfo("");
        setMapUrl(`https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`);
      },
      (err) => {
        setGpsInfo(
          `Could not get your location (${err.message}). Please allow location access and try again.`
        );
        setGpsData(null);
      }
    );
  };

  const handleShowOffice = () => {
    setMapUrl(`https://maps.google.com/maps?q=${OFFICE.lat},${OFFICE.lng}&z=13&output=embed`);
  };

  return (
    <div className="contact-page">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
      />

      <header className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Questions, suggestions or want your event listed? Send us a message.</p>
        </div>
      </header>

      <section className="section">
        <div className="container contact-grid">
          <div className="form-box">
            <div className="section-title">
              <h2>Get In Touch</h2>
            </div>
            <div className="contact-info-list">
              <p>
                <span>
                  <strong>Office</strong>
                  <br />
                  FandomVerse Studio, I.I. Chundrigar Road, Karachi, Pakistan
                </span>
              </p>
              <p>
                <span>
                  <strong>Email</strong>
                  <br />
                  fandomverse.team@gmail.com
                </span>
              </p>
              <p>
                <span>
                  <strong>Phone / WhatsApp</strong>
                  <br />
                  +92 300 1234567
                </span>
              </p>
              <p>
                <span>
                  <strong>Working hours</strong>
                  <br />
                  Mon - Fri, 10:00 AM - 6:00 PM
                </span>
              </p>
            </div>
          </div>

          <form className="form-box" id="contact-form" onSubmit={handleFormSubmit}>
            <div className="section-title">
              <h2>Send a Message</h2>
            </div>
            <div className="form-group">
              <label htmlFor="c-name">Your name</label>
              <input
                type="text"
                id="c-name"
                placeholder="e.g. Ahmed Khan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="c-email">Email</label>
              <input
                type="email"
                id="c-email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="c-subject">Subject</label>
              <select
                id="c-subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                <option>General question</option>
                <option>Suggest content</option>
                <option>List my event</option>
                <option>Report a problem</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="c-message">Message</label>
              <textarea
                id="c-message"
                placeholder="Write your message..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <button className="btn" type="submit">
              Send message
            </button>
            {formMsg.text && (
              <p className={`form-msg ${formMsg.type}`} id="contact-msg">
                {formMsg.text}
              </p>
            )}
          </form>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-title">
            <h2>Team Contacts</h2>
          </div>
          <div className="team-grid">
            <div className="team-card">
              <div className="avatar">AH</div>
              <h3>Ali Hassan</h3>
              <p className="role">Team Lead</p>
              <a href="mailto:ali.fandomverse@gmail.com">ali.fandomverse@gmail.com</a>
              <p>+92 300 1112233</p>
            </div>
            <div className="team-card">
              <div className="avatar">SN</div>
              <h3>Sara Noor</h3>
              <p className="role">Design</p>
              <a href="mailto:sara.fandomverse@gmail.com">sara.fandomverse@gmail.com</a>
              <p>+92 301 4455667</p>
            </div>
            <div className="team-card">
              <div className="avatar">UA</div>
              <h3>Usman Ahmed</h3>
              <p className="role">Content</p>
              <a href="mailto:usman.fandomverse@gmail.com">usman.fandomverse@gmail.com</a>
              <p>+92 302 7788990</p>
            </div>
            <div className="team-card">
              <div className="avatar">MT</div>
              <h3>Mahnoor Tariq</h3>
              <p className="role">Events &amp; Community</p>
              <a href="mailto:mahnoor.fandomverse@gmail.com">mahnoor.fandomverse@gmail.com</a>
              <p>+92 303 2233445</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Find Us</h2>
            <p>Use GPS to see your location on the map and how far you are from our office.</p>
          </div>
          <div className="map-box">
            <iframe
              id="map-frame"
              src={mapUrl}
              loading="lazy"
              title="FandomVerse location map"
            />
          </div>
          <div style={{ marginTop: "18px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="btn" onClick={handleGetLocation}>
              Use my GPS location
            </button>
            <button className="btn btn-outline" onClick={handleShowOffice}>
              Show our office
            </button>
          </div>
          <div className="gps-result" id="gps-result">
            {gpsData ? (
              <>
                <strong>Your location:</strong> {gpsData.lat}, {gpsData.lng}
                <br />
                <strong>Accuracy:</strong> about {gpsData.accuracy} meters
                <br />
                <strong>Distance to our office:</strong> {gpsData.km} km
                <br />
                <a href={gpsData.directionsUrl} target="_blank" rel="noreferrer">
                  Get directions on Google Maps{" "}
                </a>
              </>
            ) : (
              gpsInfo
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
