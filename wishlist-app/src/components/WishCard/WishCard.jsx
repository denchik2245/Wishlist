import "./WishCard.css";

import PLACEHOLDER_SRC from "../../assets/image/placeholder.png";

import LinkIcon from "../../assets/icons/link.svg?react";
import CheckIcon from "../../assets/icons/galochka.svg?react";

const CURRENCY_SIGN = {
  RUB: "₽",
  EUR: "€",
  USD: "$",
};

export default function WishCard({
  item,
  mode = "active",
  onBought,
  onEdit,
  onRestore,
}) {
  const { title, price, currency, link, imageDataUrl } = item;

  const hasLink = Boolean(link && link.trim());
  const imgSrc =
    imageDataUrl && imageDataUrl.trim() ? imageDataUrl : PLACEHOLDER_SRC;

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
        {price ? `${price} ${CURRENCY_SIGN[currency] ?? "₽"}` : "Цена не указана"}
      </div>

      {!isArchived ? (
        <div className="cardActions">
          {hasLink && (
            <button
              className="linkBtn"
              type="button"
              onClick={handleOpenLink}
              aria-label="Открыть ссылку"
            >
              <LinkIcon className="icon" aria-hidden="true" />
            </button>
          )}

          <button
            className={`boughtBtn ${hasLink ? "boughtBtnNarrow" : "boughtBtnWide"}`}
            type="button"
            onClick={() => onBought?.(item)}
          >
            <span className="boughtText">Куплено</span>
            <span className="boughtIcon" aria-hidden="true">
              <CheckIcon className="icon icon14" />
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