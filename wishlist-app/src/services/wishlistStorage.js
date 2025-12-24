const STORAGE_KEY = "wishlist_state_v1";

// Загрузка состояния из localStorage
export function loadWishlistState() {
  try {

    // Если данных нет, возвращаем пустое состояние
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { wishlist: [], archived: [] };
    }
    const parsed = JSON.parse(raw);

    // Проверяем, что данные корректны
    return {
      wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
      archived: Array.isArray(parsed.archived) ? parsed.archived : [],
    };
  } catch {
    // Если ошибка,  возвращаем пустое состояние
    return { wishlist: [], archived: [] };
  }
}

// Сохранение состояния в localStorage
export function saveWishlistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
  }
}