import { pgTable, text, timestamp, boolean, integer, json, uuid } from 'drizzle-orm/pg-core'
import { board, boardCategory } from './board'
import { user } from './auth'

export const post = pgTable('post', {
  id: uuid('id').primaryKey().defaultRandom(),
  boardId: uuid('board_id')
    .notNull()
    .references(() => board.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id')
    .references(() => boardCategory.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  slug: text('slug').notNull(),
  
  // Author info (can be anonymous)
  authorId: text('author_id')
    .references(() => user.id, { onDelete: 'set null' }),
  authorName: text('author_name'), // for anonymous posts
  authorEmail: text('author_email'), // for anonymous posts
  isAnonymous: boolean('is_anonymous').default(false),
  
  // Post status and metadata
  status: text('status', { 
    enum: ['draft', 'published', 'archived', 'spam', 'pending_approval'] 
  }).default('published'),
  
  // Roadmap specific status
  roadmapStatus: text('roadmap_status'), // references roadmapStatuses in board
  
  // Priority and effort estimation
  priority: text('priority', { enum: ['low', 'medium', 'high', 'critical'] })
    .default('medium'),
  effort: text('effort', { enum: ['small', 'medium', 'large', 'extra_large'] }),
  
  // Engagement metrics
  upvotes: integer('upvotes').default(0),
  downvotes: integer('downvotes').default(0),
  commentCount: integer('comment_count').default(0),
  viewCount: integer('view_count').default(0),
  
  // Moderation
  isPinned: boolean('is_pinned').default(false),
  isLocked: boolean('is_locked').default(false),
  isFeatured: boolean('is_featured').default(false),
  
  // Timestamps
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  
  // Additional metadata
  metadata: json('metadata').$type<{
    attachments?: { name: string; url: string; type: string }[];
    integrations?: { github?: string; jira?: string };
    customFields?: Record<string, any>;
  }>(),
  
  // SEO and social
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  
  // Moderation info
  moderatedBy: text('moderated_by')
    .references(() => user.id),
  moderatedAt: timestamp('moderated_at'),
  moderationReason: text('moderation_reason'),
})



export const tag = pgTable('tag', {
  id: uuid('id').primaryKey().defaultRandom(),
  boardId: uuid('board_id')
    .notNull()
    .references(() => board.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  color: text('color').default('#6b7280'),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const postTag = pgTable('post_tag', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id')
    .notNull()
    .references(() => post.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id')
    .notNull()
    .references(() => tag.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const postView = pgTable('post_view', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id')
    .notNull()
    .references(() => post.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' }),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const postUpdate = pgTable('post_update', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id')
    .notNull()
    .references(() => post.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: text('author_id')
    .notNull()
    .references(() => user.id),
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type Post = typeof post.$inferSelect
export type PostTag = typeof postTag.$inferSelect
export type Tag = typeof tag.$inferSelect
export type PostView = typeof postView.$inferSelect
export type PostUpdate = typeof postUpdate.$inferSelect