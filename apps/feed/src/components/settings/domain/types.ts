export type DomainInfo = {
  id: string
  host: string
  cnameName: string
  cnameTarget: string
  txtName: string
  txtValue: string
  status: "pending" | "verified" | "error"
} | null

