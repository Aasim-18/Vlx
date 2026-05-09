export type UserRole = "buyer" | "seller" | "admin";

export interface AppUser {
  id: string;
  role: UserRole;
  email?: string;
}

const users = new Map<string, AppUser>();

export const getOrCreateUser = (id: string, email?: string): AppUser => {
  const existing = users.get(id);
  if (existing) {
    if (email && !existing.email) existing.email = email;
    return existing;
  }

  const created: AppUser = { id, role: "buyer", email };
  users.set(id, created);
  return created;
};

export const listUsers = (): AppUser[] => Array.from(users.values());

export const upgradeUserToSeller = (id: string): AppUser => {
  const user = getOrCreateUser(id);
  if (user.role === "buyer") {
    user.role = "seller";
  }
  return user;
};

export const getUserStats = (): { totalUsers: number; sellerCount: number } => {
  const allUsers = listUsers();
  const sellerCount = allUsers.filter((user) => user.role === "seller").length;
  return { totalUsers: allUsers.length, sellerCount };
};
