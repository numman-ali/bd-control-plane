import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  githubUsername: text("githubUsername"),
  githubAccessToken: text("githubAccessToken"), // Encrypted GitHub token
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// Custom table for Personal Access Tokens
export const personalAccessToken = pgTable(
  "personalAccessToken",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => user.id),
    name: text("name").notNull(), // Friendly name for the token
    token: text("token").notNull(), // GitHub PAT (encrypted)
    scopes: text("scopes"), // GitHub scopes
    createdAt: timestamp("createdAt").notNull(),
    lastUsedAt: timestamp("lastUsedAt"),
    expiresAt: timestamp("expiresAt"),
  },
  (table) => ({
    userIdIdx: index("pat_user_id_idx").on(table.userId),
  })
);

// Store user's connected repos
export const connectedRepo = pgTable(
  "connectedRepo",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => user.id),
    repoFullName: text("repoFullName").notNull(), // e.g., "numman-ali/bd-control-plane"
    repoUrl: text("repoUrl").notNull(),
    hasBeads: boolean("hasBeads").notNull().default(false),
    lastSyncedAt: timestamp("lastSyncedAt"),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => ({
    userIdIdx: index("repo_user_id_idx").on(table.userId),
    repoNameIdx: index("repo_name_idx").on(table.repoFullName),
  })
);
