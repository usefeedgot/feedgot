import { pgTable, text, timestamp, boolean, integer, json, uuid } from 'drizzle-orm/pg-core'
import { post } from './post'
import { user } from './auth'

export const vote = pgTable('vote', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // What is being voted on
  postId: uuid('post_id')
    .references(() => post.id, { onDelete: 'cascade' }),
  commentId: uuid('comment_id'), // Will be linked via foreign key constraint later
  
  // Who voted (can be anonymous)
  userId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' }),
  
  // For anonymous voting tracking
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  fingerprint: text('fingerprint'), // browser fingerprint for anonymous users
  
  // Vote type
  type: text('type', { enum: ['upvote', 'downvote'] }).notNull(),
  
  // Metadata
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Vote aggregation table for performance
export const voteAggregate = pgTable('vote_aggregate', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // What is being voted on
  postId: uuid('post_id')
    .references(() => post.id, { onDelete: 'cascade' }),
  commentId: uuid('comment_id'), // Will be linked via foreign key constraint later
  
  // Aggregated counts
  upvotes: integer('upvotes').default(0),
  downvotes: integer('downvotes').default(0),
  totalVotes: integer('total_votes').default(0),
  score: integer('score').default(0), // upvotes - downvotes
  
  // Timestamps
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// User voting history for recommendations and analytics
export const userVoteHistory = pgTable('user_vote_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  
  // Voting patterns
  totalVotes: integer('total_votes').default(0),
  upvotesGiven: integer('upvotes_given').default(0),
  downvotesGiven: integer('downvotes_given').default(0),
  
  // Engagement metrics
  lastVotedAt: timestamp('last_voted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Vote = typeof vote.$inferSelect
export type VoteAggregate = typeof voteAggregate.$inferSelect
export type UserVoteHistory = typeof userVoteHistory.$inferSelect