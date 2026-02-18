/* =====================================
   MIRABA | User Store（ID対応版）
===================================== */

const MirabaUser = {

  KEY: "miraba_user",

  get() {
    try {
      const raw = localStorage.getItem(this.KEY);

      if (!raw) {
        const newUser = this._createDefaultUser();
        localStorage.setItem(this.KEY, JSON.stringify(newUser));
        return newUser;
      }

      const parsed = JSON.parse(raw);

      if (!parsed.id) {
        parsed.id = this._generateId();
        localStorage.setItem(this.KEY, JSON.stringify(parsed));
      }

      return parsed;

    } catch (e) {
      console.warn("MirabaUser broken. Reset.", e);
      localStorage.removeItem(this.KEY);
      const newUser = this._createDefaultUser();
      localStorage.setItem(this.KEY, JSON.stringify(newUser));
      return newUser;
    }
  },

  set(user) {
    const current = this.get();

    const safe = {
      id: current.id,
      name: user.name || current.name || "MIRABA User",
      avatar: user.avatar || current.avatar || null
    };

    localStorage.setItem(this.KEY, JSON.stringify(safe));
  },

  clear() {
    localStorage.removeItem(this.KEY);
  },

  _createDefaultUser() {
    return {
      id: this._generateId(),
      name: "MIRABA User",
      avatar: null
    };
  },

  _generateId() {
    return "u_" + Date.now().toString(36) + "_" +
           Math.random().toString(36).substring(2, 8);
  }
};
