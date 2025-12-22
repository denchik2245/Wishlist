import "./EmptyState.css";

export default function EmptyState() {
  return (
    <div className="emptyBox">
      <div className="emptyCenter">
        <div className="emptyTitle">Список пуст</div>
        <div className="emptySubtitle">Добавьте первый предмет</div>
      </div>
    </div>
  );
}