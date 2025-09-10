import { pgTable, text, timestamp, boolean, integer, json, uuid } from 'drizzle-orm/pg-core'
import { workspace } from './workspace'
import { user } from './auth'

export const board = pgTable('board', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspace.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(), // URL-friendly name
  description: text('description'),
  type: text('type', { enum: ['feedback', 'updates', 'roadmap'] })
    .notNull()
    .default('feedback'),
  isPublic: boolean('is_public').default(true),
  isActive: boolean('is_active').default(true),
  allowAnonymous: boolean('allow_anonymous').default(true),
  requireApproval: boolean('require_approval').default(false),
  allowVoting: boolean('allow_voting').default(true),
  allowComments: boolean('allow_comments').default(true),
  sortOrder: integer('sort_order').default(0),
  createdBy: text('created_by')
    .notNull()
    .references(() => user.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  // Board customization
  color: text('color').default('#3b82f6'),
  icon: text('icon'), // emoji or icon name
  welcomeMessage: text('welcome_message'),
  // Roadmap specific fields
  roadmapStatuses: json('roadmap_statuses').$type<{
    id: string;
    name: string;
    color: string;
    order: number;
  }[]>().default([
    { id: 'planned', name: 'Planned', color: '#6b7280', order: 0 },
    { id: 'in-progress', name: 'In Progress', color: '#f59e0b', order: 1 },
    { id: 'completed', name: 'Completed', color: '#10b981', order: 2 }
  ]),
})

export const boardCategory = pgTable('board_category', {
  id: uuid('id').primaryKey().defaultRandom(),
  boardId: uuid('board_id')
    .notNull()
    .references(() => board.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  color: text('color').default('#6b7280'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const boardModerator = pgTable('board_moderator', {
  id: uuid('id').primaryKey().defaultRandom(),
  boardId: uuid('board_id')
    .notNull()
    .references(() => board.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  permissions: json('permissions').$type<{
    canModerate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canPin: boolean;
    canChangeStatus: boolean;
  }>().default({
    canModerate: true,
    canEdit: false,
    canDelete: false,
    canPin: true,
    canChangeStatus: true
  }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type Board = typeof board.$inferSelect
export type BoardCategory = typeof boardCategory.$inferSelect
export type BoardModerator = typeof boardModerator.$inferSelect