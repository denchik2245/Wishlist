import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header/Header";
import EmptyState from "../components/EmptyState/EmptyState";
import WishGrid from "../components/WishGrid/WishGrid";
import Modal from "../components/Modal/Modal";
import ItemForm from "../components/ItemForm/ItemForm";
import { loadWishlistState, saveWishlistState } from "../services/wishlistStorage";
import "./App.css";

//Генератор уникального id для новых предметов
function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function App() {
  const initial = useMemo(() => loadWishlistState(), []);

  const [wishlist, setWishlist] = useState(initial.wishlist);
  const [archived, setArchived] = useState(initial.archived);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Сохраняем состояние в localStorage при изменении wishlist или archived
  useEffect(() => {
    saveWishlistState({ wishlist, archived });
  }, [wishlist, archived]);

  // Проверка, есть ли вообще предметы в списке, нужен для отображения пустого состояния
  const hasAnyItems = wishlist.length > 0 || archived.length > 0;

  //Открыть/закрыть модалку для добавления/редактирования предметов
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

  // Обработчики для формы
  const handleSubmitForm = (payload) => {

    // Название предмета обязательно
    if (!payload.title) {
      alert("Введите название предмета");
      return;
    }

    // Если есть id, значит редактируем существующий предмет
    if (payload.id) {
      setWishlist((prev) =>
        prev.map((it) => (it.id === payload.id ? { ...it, ...payload } : it))
      );
      setArchived((prev) =>
        prev.map((it) => (it.id === payload.id ? { ...it, ...payload } : it))
      );
    } else {
      // Иначе создаём новый предмет
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

      // Добавляем новый предмет в начало списка
      setWishlist((prev) => [newItem, ...prev]);
    }

    closeModal();
  };

  // Удаление предмета
  const handleDeleteItem = (id) => {
    setWishlist((prev) => prev.filter((it) => it.id !== id));
    setArchived((prev) => prev.filter((it) => it.id !== id));
    closeModal();
  };

  // Переносим item из wishlist в archived
  const handleBought = (item) => {
    setWishlist((prev) => prev.filter((it) => it.id !== item.id));
    setArchived((prev) => {
      const exists = prev.some((it) => it.id === item.id);
      if (exists) return prev;
      return [{ ...item, boughtAt: Date.now() }, ...prev];
    });
  };

  // Восстанавливаем item из archived в wishlist
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