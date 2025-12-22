const STORAGE_KEY = "wishlist_state_v1";

export function loadWishlistState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { wishlist: [], archived: [] };
    }
    const parsed = JSON.parse(raw);

    return {
      wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
      archived: Array.isArray(parsed.archived) ? parsed.archived : [],
    };
  } catch {
    return { wishlist: [], archived: [] };
  }
}

export function saveWishlistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // если localStorage переполнен/запрещён — просто молча игнорируем
  }
}
