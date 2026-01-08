import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/*
  Tabela de usuários.
  O ID é string porque o sistema de autenticação (Clerk)
  gera identificadores nesse formato.
*/
export const users = pgTable("users", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    imageUrl: text("image_url"),
});

/*
  Tabela de produtos.
  Cada produto pertence a um único usuário.
  A exclusão em cascata garante consistência:
  se o usuário for removido, seus produtos também.
*/
export const products = pgTable("products", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    imageUrl: text("image_url").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { mode: "date" })
        .defaultNow()
        .notNull(),

    updateAt: timestamp("updated_at", { mode: "date" })
        .defaultNow()
        .notNull(),
});

/*
  Tabela de comentários.
  Um comentário sempre depende de:
  - um usuário
  - um produto
  Não existe comentário isolado no sistema.
*/
export const comments = pgTable("comments", {
    id: uuid("id").defaultRandom().primaryKey(),
    content: text("content").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
        .notNull()
        .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" })
        .defaultNow()
        .notNull(),
});

/*
  Relacionamentos do usuário.
  Importante: isso não cria regras de limite,
  apenas informa ao Drizzle como montar JOINs.
*/
export const usersRelations = relations(users, ({ many }) => ({
    products: many(products),
    comments: many(comments),
}));

/*
  Relacionamentos de produtos.
  Define claramente quem é o dono do produto
  e quais comentários pertencem a ele.
*/
export const productsRelations = relations(products, ({ one, many }) => ({
    comments: many(comments),
    user: one(users, {
        fields: [products.userId],
        references: [users.id],
    }),
}));

/*
  Relacionamentos de comentários.
  Comentários funcionam como tabela de ligação
  entre usuários e produtos.
*/
export const commentsRelations = relations(comments, ({ one }) => ({
    user: one(users, {
        fields: [comments.userId],
        references: [users.id],
    }),
    product: one(products, {
        fields: [comments.productId],
        references: [products.id],
    }),
}));

/*
  Tipos inferidos automaticamente pelo Drizzle.
  Garantem tipagem correta em queries e inserts,
  evitando inconsistências entre código e banco.
*/
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
