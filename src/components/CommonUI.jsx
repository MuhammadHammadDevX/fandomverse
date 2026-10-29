import React from "react";

export function Chips({ values, activeValue, onChange, labels }) {
  return (
    <div className="chips">
      {values.map((val, idx) => (
        <button
          key={val}
          type="button"
          className={`chip ${activeValue === val ? "active" : ""}`}
          onClick={() => onChange(val)}
        >
          {labels ? labels[idx] : val}
        </button>
      ))}
    </div>
  );
}

export function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      <div className="container">
        <ol>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={idx}>
                {isLast ? (
                  item.label
                ) : (
                  <a href={item.href || "#"} onClick={item.onClick}>
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export function BackToTop() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const checkScroll = () => {
      setShow(window.scrollY > 500);
    };
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={`back-top ${show ? "show" : ""}`}
      title="Back to top"
      onClick={scrollToTop}
    >
      Top
    </button>
  );
}
