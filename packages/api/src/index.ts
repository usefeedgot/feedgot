import { j, privateProcedure } from "./jstack"

const api = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  .onError(j.defaults.errorHandler)

const routerImports = {
  workspace: () => import("./router/workspace").then((m) => m.createWorkspaceRouter()),
}

const appRouter = j.mergeRouters(api, {
  workspace: routerImports.workspace,
})

export type AppRouter = typeof appRouter
export default appRouter
