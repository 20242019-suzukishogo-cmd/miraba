function getMirabaUser() {
  const profile =
    JSON.parse(localStorage.getItem("miraba_profile")) || {};

  const storeUser = MirabaUser.get();

  const name =
    [profile.lastName, profile.firstName]
      .filter(Boolean)
      .join(" ")
      || storeUser.name
      || "MIRABA User";

  return {
    id: storeUser.id,  // 🔥 追加
    name,
    avatar: profile.avatar || storeUser.avatar || null
  };
}
