import { createWorkspaceRouter } from "./router/workspace"
import { createJ } from "./jstack"
import { jstack } from "jstack"

export function createAppRouter(opts: { db: any; auth: any; getHeaders: () => any }) {
  const { j, publicProcedure, privateProcedure } = createJ(opts)

  const api = j
    .router()
    .basePath("/api")
    .use(j.defaults.cors)
    .onError(j.defaults.errorHandler)

  const workspaceRouter = createWorkspaceRouter(j, privateProcedure)

  const appRouter = j.mergeRouters(api, {
    workspace: workspaceRouter,
  })

  return appRouter
}

const _j = jstack.init()
const _api = _j.router()
const _workspaceRouter = createWorkspaceRouter(_j, _j.procedure)
const _appRouter = _j.mergeRouters(_api, { workspace: _workspaceRouter })
export type AppRouter = typeof _appRouter
