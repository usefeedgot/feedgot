I will implement a global voting function for posts by creating a new API router.

1.  **Create Post Router**: I will create a new file `packages/api/src/router/post.ts` and implement a `vote` procedure.
    *   This procedure will be protected (requiring authentication for now).
    *   It will accept a `postId`.
    *   It will check if the user has already voted for this post.
    *   If they have, it will remove the vote and decrement the post's upvote count.
    *   If they haven't, it will add a vote and increment the post's upvote count.
    *   It will return the updated upvote count and the user's vote status (`hasVoted`).

2.  **Register Router**: I will register the new `post` router in `packages/api/src/index.ts` so it's accessible via the API client as `client.post.vote`.

This will allow you to use `client.post.vote({ postId: "..." })` globally in your application (both in the subdomain/feed app and the workspace app).