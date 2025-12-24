import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header/Header";
import EmptyState from "../components/EmptyState/EmptyState";
import WishGrid from "../components/WishGrid/WishGrid";
import Modal from "../components/Modal/Modal";
import ItemForm from "../components/ItemForm/ItemForm";
import { loadWishlistState, saveWishlistState } from "../services/wishlistStorage";
import "./App.css";

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function App() {
  const initial = useMemo(() => loadWishlistState(), []);
  const [wishlist, setWishlist] = useState(initial.wishlist);
  const [archived, setArchived] = useState(initial.archived);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    saveWishlistState({ wishlist, archived });
  }, [wishlist, archived]);

  const hasAnyItems = wishlist.length > 0 || archived.length > 0;

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmitForm = (payload) => {
    if (!payload.title) {
      alert("Введите название предмета");
      return;
    }

    if (payload.id) {
      setWishlist((prev) =>
        prev.map((it) => (it.id === payload.id ? { ...it, ...payload } : it))
      );
      setArchived((prev) =>
        prev.map((it) => (it.id === payload.id ? { ...it, ...payload } : it))
      );
    } else {
      const newItem = {
        id: makeId(),
        title: payload.title,
        link: payload.link,
        price: payload.price,
        currency: payload.currency,
        imageDataUrl: payload.imageDataUrl,
        fileName: payload.fileName,
        createdAt: Date.now(),
      };
      setWishlist((prev) => [newItem, ...prev]);
    }

    closeModal();
  };

  const handleDeleteItem = (id) => {
    setWishlist((prev) => prev.filter((it) => it.id !== id));
    setArchived((prev) => prev.filter((it) => it.id !== id));
    closeModal();
  };

  const handleBought = (item) => {
    setWishlist((prev) => prev.filter((it) => it.id !== item.id));
    setArchived((prev) => {
      const exists = prev.some((it) => it.id === item.id);
      if (exists) return prev;
      return [{ ...item, boughtAt: Date.now() }, ...prev];
    });
  };

  const handleRestore = (item) => {
    setArchived((prev) => prev.filter((it) => it.id !== item.id));
    setWishlist((prev) => {
      const exists = prev.some((it) => it.id === item.id);
      if (exists) return prev;
      return [{ ...item, restoredAt: Date.now() }, ...prev];
    });
  };

  return (
    <div className="page">
      <div className="container">
        <Header title="Желаемые предметы" onAdd={openAddModal} showAdd />

        {wishlist.length > 0 ? (
          <div style={{ marginTop: 53 }}>
            <WishGrid
              items={wishlist}
              mode="active"
              onBought={handleBought}
              onEdit={openEditModal}
            />
          </div>
        ) : (
          !hasAnyItems ? <EmptyState /> : <div style={{ marginTop: 53 }} />
        )}

        {archived.length > 0 && (
          <div style={{ marginTop: 100 }}>
            <Header title="Раннее желаемые предметы" showAdd={false} size="md" />

            <div style={{ marginTop: 32 }}>
              <WishGrid
                items={archived}
                mode="archived"
                onEdit={openEditModal}
                onRestore={handleRestore}
              />
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        isEdit={Boolean(editingItem)}
      >
        <ItemForm
          initialItem={editingItem}
          onSubmit={handleSubmitForm}
          onDelete={handleDeleteItem}
        />
      </Modal>

    </div>
  );
}