import { useEffect, useMemo, useRef, useState } from "react";
import "./ItemForm.css";

const CURRENCIES = [
  { value: "RUB", label: "RUB, ₽" },
  { value: "EUR", label: "EUR, €" },
  { value: "USD", label: "USD, $" },
];

export default function ItemForm({ initialItem = null, onSubmit, onDelete }) {
  const isEdit = Boolean(initialItem?.id);

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("RUB");

  const [imageDataUrl, setImageDataUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!initialItem) {
      setTitle("");
      setLink("");
      setPrice("");
      setCurrency("RUB");
      setImageDataUrl("");
      setFileName("");
      return;
    }

    setTitle(initialItem.title ?? "");
    setLink(initialItem.link ?? "");
    setPrice(initialItem.price ?? "");
    setCurrency(initialItem.currency ?? "RUB");
    setImageDataUrl(initialItem.imageDataUrl ?? "");
    setFileName(initialItem.fileName ?? "");
  }, [initialItem]);

  const currencyLabel = useMemo(() => {
    return CURRENCIES.find((c) => c.value === currency)?.label ?? "RUB, ₽";
  }, [currency]);

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFileName("");
      setImageDataUrl("");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setImageDataUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id: initialItem?.id ?? null,
      title: title.trim(),
      link: link.trim(),
      price: price.trim(),
      currency,
      imageDataUrl,
      fileName,
    };

    onSubmit?.(payload);
  };

  const handleDelete = () => {
    if (!initialItem?.id) return;

    const ok = window.confirm("Удалить предмет? Это действие нельзя отменить.");
    if (!ok) return;

    onDelete?.(initialItem.id);
  };

  return (
    <form className="itemForm" onSubmit={handleSubmit}>
      <h2 className="itemFormTitle">
        {isEdit ? "Изменить предмет" : "Добавить предмет"}
      </h2>

      <div className="formSection">
        <div className="fieldBlock">
          <div className="fieldLabel">Название предмета</div>
          <input
            className="textInput"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: «iPhone 17 Pro»"
          />
        </div>
      </div>

      <div className="formSection">
        <div className="fieldBlock">
          <div className="fieldLabel">Ссылка на предмет</div>
          <input
            className="textInput"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Например: «https://market.yandex.ru/cc/8FqSZm»"
          />
        </div>
      </div>

      <div className="formSection">
        <div className="row2">
          <div className="fieldBlock">
            <div className="fieldLabel">Цена предмета</div>
            <input
              className="textInput textInputWide"
              type="text"
              value={price}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                setPrice(onlyDigits);
              }}
              placeholder="Например: «100000»"
            />
          </div>

          <div className="fieldBlock">
            <div className="fieldLabel">Валюта</div>

            <div className="selectWrap">
              <select
                className="selectInput"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

              <span className="selectIcon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span className="selectValue" aria-hidden="true">
                {currencyLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="formSection">
        <div className="fieldBlock">
          <div className="fieldLabel">Фото предмета</div>

          <div
            className={`uploadBox ${imageDataUrl ? "uploadBoxActive" : ""}`}
            role="button"
            tabIndex={0}
            onClick={handlePickFile}
            onKeyDown={(e) => e.key === "Enter" && handlePickFile()}
          >
            <div className="uploadText">
              {imageDataUrl
                ? `Выбрано: ${fileName || "изображение"}`
                : "Прикрепить фото"}
            </div>

            <input
              ref={fileInputRef}
              className="hiddenFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      <div className="formSection">
        <button className="submitBtn" type="submit">
          <span className="submitBtnText">{isEdit ? "Сохранить" : "Добавить"}</span>
          <span className="submitBtnIcon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 1.5V16.5M1.5 9H16.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>

        {isEdit && (
          <button
            className="deleteBtn"
            type="button"
            onClick={handleDelete}
          >
            Удалить предмет
          </button>
        )}
      </div>
    </form>
  );
}