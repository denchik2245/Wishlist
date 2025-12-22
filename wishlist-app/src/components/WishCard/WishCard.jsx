import "./WishCard.css";

const PLACEHOLDER_SRC = "/placeholder.png";

const CURRENCY_SIGN = {
  RUB: "₽",
  EUR: "€",
  USD: "$",
};

export default function WishCard({
  item,
  mode = "active", // "active" | "archived"
  onBought,
  onEdit,
  onRestore,
}) {
  const { title, price, currency, link, imageDataUrl } = item;

  const hasLink = Boolean(link && link.trim());
  const imgSrc = imageDataUrl && imageDataUrl.trim() ? imageDataUrl : PLACEHOLDER_SRC;

  const handleOpenLink = () => {
    if (!hasLink) return;
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const isArchived = mode === "archived";

  return (
    <div className={`card ${isArchived ? "cardArchived" : ""}`}>
      <div className="cardTitleArea">
        <div className="cardTitle" title={title}>
          {title}
        </div>
      </div>

      <img className="cardImage" src={imgSrc} alt={title} />

      <div className="cardPrice">
        {price
          ? `${price} ${CURRENCY_SIGN[currency] ?? "₽"}`
          : "Цена не указана"}
      </div>

      {!isArchived ? (
        <div className="cardActions">
          {hasLink && (
            <button className="linkBtn" type="button" onClick={handleOpenLink} aria-label="Открыть ссылку">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6.2 9.8L9.8 6.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M6.6 4.9L5.4 3.7C4.3 2.6 2.5 2.6 1.4 3.7C0.3 4.8 0.3 6.6 1.4 7.7L2.6 8.9C3.7 10 5.5 10 6.6 8.9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M9.4 11.1L10.6 12.3C11.7 13.4 13.5 13.4 14.6 12.3C15.7 11.2 15.7 9.4 14.6 8.3L13.4 7.1C12.3 6 10.5 6 9.4 7.1"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}

          <button
            className={`boughtBtn ${hasLink ? "boughtBtnNarrow" : "boughtBtnWide"}`}
            type="button"
            onClick={() => onBought?.(item)}
          >
            <span className="boughtText">Куплено</span>
            <span className="boughtIcon" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 7.5L5.6 10.5L11.5 3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          <button className="editBtn" type="button" onClick={() => onEdit?.(item)}>
            Изменить
          </button>
        </div>
      ) : (
        <div className="cardActionsArchived">
          <button className="restoreBtn" type="button" onClick={() => onRestore?.(item)}>
            Вернуть в вишлист
          </button>
        </div>
      )}
    </div>
  );
}