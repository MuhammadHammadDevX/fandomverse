import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useModal } from "../context/ModalContext";

const genericWords = [
  "anime", "game", "games", "gaming", "gamer", "movie", "movies", "film", "films",
  "cinema", "tv", "tv show", "tv shows", "series", "drama", "kpop", "k-pop", "k pop",
  "korean music", "comic", "comics", "superhero", "superheroes", "manga"
];

const stopWords = [
  "the", "and", "are", "what", "who", "about", "show", "tell", "you", "have", "any", "can",
  "please", "some", "this", "that", "cool", "nice", "wow", "lol", "yes", "good", "very",
  "really", "just", "want", "like", "know", "how", "why", "where", "when", "your", "there",
  "here", "with", "from", "its", "give", "find", "info", "information", "more", "all", "get",
  "see", "let", "watch", "need", "not", "but", "was", "were", "has", "had"
];

export default function Chatbot() {
  const { siteData, botData, categoryName, getCategory, getAllCards, sortCards, makeCard } = useData();
  const { openItem } = useModal();

  const [isOpen, setIsOpen] = useState(() => sessionStorage.getItem("fv_chat_open") === "yes");
  const [hasUnread, setHasUnread] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("fv_chat")) || [];
    } catch {
      return [];
    }
  });
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastCategory, setLastCategory] = useState(null);

  const bodyRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0 && botData?.greeting) {
      setMessages([
        {
          from: "bot",
          text: botData.greeting,
          links: [],
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setHasUnread(true);
    }
  }, [botData, messages.length]);

  useEffect(() => {
    sessionStorage.setItem("fv_chat", JSON.stringify(messages));
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    sessionStorage.setItem("fv_chat_open", isOpen ? "yes" : "no");
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      }, 50);
    }
  }, [isOpen]);

  const cleanText = (text) => {
    return (
      " " +
      text
        .toLowerCase()
        .replace(/'/g, "")
        .replace(/[^a-z0-9\s-]/g, " ")
        .replace(/\s+/g, " ")
        .trim() +
      " "
    );
  };

  const hasPhrase = (cleaned, phrase) => {
    return cleaned.indexOf(" " + phrase.toLowerCase() + " ") > -1;
  };

  const detectCategory = (cleaned) => {
    if (!botData?.categoryWords) return null;
    const words = botData.categoryWords;
    let best = null;
    for (let cat in words) {
      words[cat].forEach((w) => {
        if (hasPhrase(cleaned, w) && (!best || w.length > best.word.length)) {
          best = { cat: cat, word: w };
        }
      });
    }
    return best;
  };

  const findIntent = (cleaned) => {
    if (!botData?.intents) return null;
    let best = null;
    let bestScore = 0;

    botData.intents.forEach((intent) => {
      let score = 0;
      intent.keywords.forEach((k) => {
        if (hasPhrase(cleaned, k)) {
          score += k.indexOf(" ") > -1 ? 3 : 2;
        }
      });
      if (score > bestScore) {
        bestScore = score;
        best = intent;
      }
    });
    return best;
  };

  const searchWords = (cleaned) => {
    return cleaned
      .trim()
      .split(" ")
      .filter((w) => w.length > 2 && stopWords.indexOf(w) === -1);
  };

  const matchScore = (card, words) => {
    const hay = cleanText(
      card.title +
        " " +
        card.tags.join(" ") +
        " " +
        (card.item?.series || "") +
        " " +
        (card.item?.franchise || "")
    );
    let score = 0;
    words.forEach((w) => {
      if (hasPhrase(hay, w)) score++;
    });
    return score;
  };

  const searchContent = (cleaned) => {
    const words = searchWords(cleaned);
    if (words.length === 0) return [];
    const scored = getAllCards()
      .map((c) => ({ card: c, score: matchScore(c, words) }))
      .filter((x) => x.score > 0);

    scored.sort((a, b) => b.score - a.score || b.card.popularity - a.card.popularity);
    return scored.slice(0, 3).map((x) => x.card);
  };

  const recommendReply = (catId) => {
    const cat = getCategory(catId);
    const cards = sortCards(
      getAllCards(catId).filter(
        (c) => c.kind === "video" || c.kind === "article" || c.kind === "character"
      ),
      "popular"
    );

    const picks = [];
    ["video", "article", "character"].forEach((kind) => {
      const c = cards.find((x) => x.kind === kind);
      if (c) picks.push(c);
    });

    return {
      text: `Great choice! ${cat ? cat.name : "Fans"} love these right now:`,
      recItems: picks,
      links: [
        { text: `Open ${cat?.name || ""} hub`, url: `/category?cat=${catId}` },
        { text: `${cat?.name || ""} events`, url: `/category?cat=${catId}#events` },
      ],
    };
  };

  const categoryTopicReply = (catId, topic, cleaned) => {
    const name = categoryName(catId);
    const d = siteData;
    let list = [];
    let links = [];

    if (topic === "events") {
      list = d.events
        .filter((e) => e.category === catId)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((e) => makeCard("event", e));
      links = [{ text: `All ${name} events`, url: `/category?cat=${catId}#events` }];
    } else if (topic === "characters") {
      list = d.characters
        .filter((c) => c.category === catId)
        .map((c) => makeCard("character", c));
      links = [{ text: `${name} characters`, url: `/characters?cat=${catId}` }];
    } else if (topic === "trailers" || topic === "videos") {
      list = sortCards(
        d.videos.filter((v) => v.category === catId).map((v) => makeCard("video", v)),
        "newest"
      );
      links = [{ text: `${name} videos`, url: `/category?cat=${catId}#media` }];
    } else if (topic === "articles") {
      list = d.articles
        .filter((a) => a.category === catId)
        .map((a) => makeCard("article", a));
      links = [{ text: "All articles", url: "/articles" }];
    } else if (topic === "gallery") {
      const gCount = d.gallery.filter((g) => g.category === catId).length;
      return {
        text: `The ${name} gallery has ${gCount} images.`,
        links: [{ text: `Open ${name} gallery`, url: `/gallery?cat=${catId}` }],
      };
    } else if (topic === "store") {
      list = d.merchandise
        .filter((m) => m.category === catId)
        .map((m) => makeCard("merchandise", m));
      links = [{ text: "Go to Store", url: "/merchandise" }];
    }

    const words = searchWords(cleaned);
    list.sort((a, b) => matchScore(b, words) - matchScore(a, words));

    if (list.length === 0) {
      return { text: `I couldn't find ${topic} for ${name} yet.`, links: links };
    }
    return {
      text: `Here are some ${name} ${topic}:`,
      recItems: list.slice(0, 3),
      links: links,
    };
  };

  const buildReply = (text) => {
    const cleaned = cleanText(text);
    const found = detectCategory(cleaned);
    const category = found ? found.cat : null;
    const intent = findIntent(cleaned);
    const wantsRecommend = botData?.recommendWords?.some((w) => hasPhrase(cleaned, w));

    if (category) setLastCategory(category);

    // 1) category + a topic
    if (
      category &&
      intent &&
      ["events", "characters", "trailers", "videos", "articles", "gallery", "store"].includes(
        intent.id
      )
    ) {
      return categoryTopicReply(category, intent.id, cleaned);
    }

    // 2) specific keyword search
    if (found && !genericWords.includes(found.word) && !wantsRecommend) {
      const results = searchContent(cleaned);
      if (results.length) {
        return {
          text: `Here's what I found about <b>${text}</b>:`,
          recItems: results,
          links: [
            { text: `Open ${categoryName(category)} hub`, url: `/category?cat=${category}` },
            { text: "See all results", url: `/search?q=${encodeURIComponent(text)}` },
          ],
        };
      }
    }

    // 3) recommendation
    if (wantsRecommend || (category && (!intent || intent.id === "categories"))) {
      const cat = category || lastCategory;
      if (cat) return recommendReply(cat);
      return {
        text: "Sure! Which fandom are you into? Pick one and I'll show you the best stuff.",
        links: siteData.categories.map((c) => ({
          text: c.name,
          url: `/category?cat=${c.id}`,
        })),
      };
    }

    // 4) standard intent
    if (intent) {
      const pick = intent.answers[Math.floor(Math.random() * intent.answers.length)];
      return { text: pick, links: intent.links || [] };
    }

    // 5) full site content search
    const results = searchContent(cleaned);
    if (results.length) {
      return {
        text: "Here's what I found on FandomVerse:",
        recItems: results,
        links: [{ text: "See all results", url: `/search?q=${encodeURIComponent(text)}` }],
      };
    }

    // 6) fallback
    const fallbackPick = botData?.fallback
      ? botData.fallback[Math.floor(Math.random() * botData.fallback.length)]
      : "I'm not sure about that. Try asking about anime, characters or trailers!";
    return { text: fallbackPick, links: [] };
  };

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg = {
      from: "user",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = buildReply(text);
      setIsTyping(false);
      const botMsg = {
        from: "bot",
        text: reply.text,
        recItems: reply.recItems || [],
        links: reply.links || [],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600 + Math.random() * 400);
  };

  const handleClearChat = () => {
    sessionStorage.removeItem("fv_chat");
    setLastCategory(null);
    setMessages([
      {
        from: "bot",
        text: "Chat cleared! " + (botData?.greeting || "How can I help you today?"),
        links: [],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <>
      <button
        type="button"
        className="chat-launcher"
        id="chat-launcher"
        title="Chat with Verse Bot"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          "Close"
        ) : (
          <>
            Chat
            {hasUnread && (
              <span className="badge" style={{ display: "grid" }}>
                1
              </span>
            )}
          </>
        )}
      </button>

      <div className={`chat-window ${isOpen ? "open" : ""}`} id="chat-window">
        <div className="chat-header">
          <div className="bot-avatar">VB</div>
          <div>
            <h4>Verse Bot</h4>
            <small>Online - replies instantly</small>
          </div>
          <button
            type="button"
            id="chat-clear"
            title="Clear chat"
            onClick={handleClearChat}
          >
            Clear
          </button>
          <button
            type="button"
            id="chat-close"
            title="Close"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </div>

        <div className="chat-body" id="chat-body" ref={bodyRef}>
          {messages.map((m, idx) => (
            <div key={idx} className={`msg ${m.from}`}>
              <div dangerouslySetInnerHTML={{ __html: m.text }} />
              {m.recItems && m.recItems.length > 0 && (
                <div style={{ marginTop: "8px" }}>
                  {m.recItems.map((rec) => (
                    <a
                      key={rec.id}
                      className="rec-item"
                      href={`#${rec.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        openItem(rec.kind, rec.id, rec.item);
                      }}
                    >
                      <img src={rec.image} alt={rec.title} />
                      <span>
                        {rec.title}{" "}
                        <small style={{ color: "var(--gold)" }}>({rec.typeLabel})</small>
                      </span>
                    </a>
                  ))}
                </div>
              )}
              {m.links && m.links.length > 0 && (
                <div className="msg-links">
                  {m.links.map((link, lIdx) => (
                    <Link key={lIdx} to={link.url} onClick={() => setIsOpen(false)}>
                      {link.text}
                    </Link>
                  ))}
                </div>
              )}
              <time>{m.time}</time>
            </div>
          ))}
          {isTyping && (
            <div className="typing" id="typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>

        <div className="quick-replies" id="quick-replies">
          {botData?.quickReplies?.map((qr, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(qr)}
            >
              {qr}
            </button>
          ))}
        </div>

        <form
          className="chat-form"
          id="chat-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="text"
            id="chat-input"
            placeholder="Ask me anything..."
            autoComplete="off"
            maxLength={200}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}
