import { jstack } from "jstack"

export function createJ({ db, auth, getHeaders }: { db: any; auth: any; getHeaders: () => any }) {
  const j = jstack.init()

  const databaseMiddleware = j.middleware(async ({ next }) => {
    return await next({ db })
  })

  const authMiddleware = j.middleware(async ({ next }) => {
    const session = await auth.api.getSession({
      headers: await getHeaders(),
    })
    if (!session || !session.user) {
      throw new Error("Unauthorized")
    }
    return await next({ session })
  })

  const publicProcedure = j.procedure.use(databaseMiddleware)
  const privateProcedure = publicProcedure.use(authMiddleware)

  return { j, publicProcedure, privateProcedure }
}