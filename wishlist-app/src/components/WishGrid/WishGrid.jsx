import WishCard from "../WishCard/WishCard";
import "./WishGrid.css";

export default function WishGrid({ items, mode = "active", onBought, onEdit, onRestore }) {
  return (
    <div className="wishGrid">
      {items.map((item) => (
        <WishCard
          key={item.id}
          item={item}
          mode={mode}
          onBought={onBought}
          onEdit={onEdit}
          onRestore={onRestore}
        />
      ))}
    </div>
  );
}