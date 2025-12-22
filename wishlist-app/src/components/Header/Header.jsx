import "./Header.css";

export default function Header({ title, onAdd, showAdd = true, size = "lg" }) {
  return (
    <div className="headerRow">
      <h1 className={`headerTitle ${size === "md" ? "headerTitleMd" : ""}`}>
        {title}
      </h1>

      {showAdd && (
        <button className="addBtn" type="button" onClick={onAdd}>
          <span className="addBtnText">Добавить</span>
          <span className="addBtnIcon" aria-hidden="true">
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
      )}
    </div>
  );
}