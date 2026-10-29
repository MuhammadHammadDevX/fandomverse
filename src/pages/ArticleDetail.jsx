import React, { useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useBookmarks } from "../context/BookmarkContext";
import { useModal } from "../context/ModalContext";
import { Breadcrumb } from "../components/CommonUI";

export default function ArticleDetail() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const { siteData, categoryName, formatDate, getAllCards, sortCards } = useData();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { openItem } = useModal();
  const navigate = useNavigate();

  const article = useMemo(() => {
    if (!siteData?.articles) return null;
    return siteData.articles.find((a) => a.id === id) || siteData.articles[0];
  }, [siteData, id]);

  const relatedArticles = useMemo(() => {
    if (!siteData?.articles || !article) return [];
    return siteData.articles
      .filter((a) => a.id !== article.id)
      .sort((a, b) => {
        return (b.category === article.category ? 1 : 0) - (a.category === article.category ? 1 : 0);
      })
      .slice(0, 4);
  }, [siteData, article]);

  const moreCategoryContent = useMemo(() => {
    if (!article) return [];
    let more = getAllCards(article.category).filter(
      (c) => c.kind !== "article" && c.kind !== "gallery"
    );
    return sortCards(more, "popular").slice(0, 5);
  }, [article, getAllCards, sortCards]);

  if (!article) {
    return (
      <div className="container section">
        <div className="empty-box">
          <p>Article not found.</p>
          <Link className="btn" to="/articles">
            All articles
          </Link>
        </div>
      </div>
    );
  }

  const saved = isBookmarked(article.id);

  return (
    <div className="article-detail-page">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          {
            label: categoryName(article.category),
            href: `/category?cat=${article.category}`,
          },
          { label: article.title },
        ]}
      />

      <article className="article-layout container section">
        <div className="article-main" id="article-main">
          <img
            id="article-img"
            className="article-hero-img"
            src={article.image}
            alt={article.title}
          />
          <span className="cat-chip" style={{ marginTop: "16px", display: "inline-block" }}>
            {categoryName(article.category).toUpperCase()}
          </span>
          <h1>{article.title}</h1>
          <div className="info-row">
            <span>By {article.author}</span>
            <span>{formatDate(article.date)}</span>
            <span>{article.readTime}</span>
          </div>
          <p className="lead">{article.description}</p>
          <div className="body">
            {article.body?.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
          <div className="tags">
            {article.tags?.map((t, idx) => (
              <span key={idx} className="tag">
                #{t}
              </span>
            ))}
          </div>
          <div
            className="card-actions"
            style={{ justifyContent: "flex-start", gap: "12px", marginTop: "24px" }}
          >
            <button
              className={`bookmark-btn ${saved ? "saved" : ""}`}
              data-id={article.id}
              onClick={() => toggleBookmark("article", article.id)}
            >
              {saved ? "Saved" : "Save"}
            </button>
            <Link className="btn btn-small btn-outline" to="/articles">
              All articles
            </Link>
          </div>
        </div>

        <aside className="article-sidebar">
          <div className="sidebar-box">
            <h3>Related Articles</h3>
            <div id="related-articles">
              {relatedArticles.map((a) => (
                <div
                  key={a.id}
                  className="mini-item"
                  onClick={() => navigate(`/article?id=${a.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={a.image} alt={a.title} />
                  <div>
                    <small>{categoryName(a.category)}</small>
                    <h4>{a.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-box" style={{ marginTop: "24px" }}>
            <h3>More in {categoryName(article.category)}</h3>
            <div id="related-content">
              {moreCategoryContent.map((c) => (
                <div
                  key={`${c.kind}-${c.id}`}
                  className="mini-item"
                  onClick={() => openItem(c.kind, c.id, c.item)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={c.image} alt={c.title} />
                  <div>
                    <small>{c.typeLabel}</small>
                    <h4>{c.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </article>
    </div>
  );
}
