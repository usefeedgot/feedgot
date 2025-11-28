"use client"

import React from "react"
import { Button } from "@feedgot/ui/components/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@feedgot/ui/components/table"
import type { DomainInfo } from "./types"

export default function RecordsTable({ info, onVerify, verifying, onDelete }: { info: DomainInfo; onVerify: () => void; verifying: boolean; onDelete: () => void }) {
  if (!info) return null
  return (
    <div className="rounded-md border p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm">{info.host}</div>
        <div className="text-xs">Status: {info.status.toUpperCase()}</div>
      </div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-3">Type</TableHead>
              <TableHead className="px-3">Name</TableHead>
              <TableHead className="px-3">Value</TableHead>
              <TableHead className="px-3 w-28 text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="px-3">CNAME</TableCell>
              <TableCell className="px-3">{info.cnameName}</TableCell>
              <TableCell className="px-3 truncate">{info.cnameTarget}</TableCell>
              <TableCell className="px-3 text-center">{info.status === "verified" ? "VALID" : "PENDING"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-3">TXT</TableCell>
              <TableCell className="px-3 truncate">{info.txtName}</TableCell>
              <TableCell className="px-3 truncate">{info.txtValue}</TableCell>
              <TableCell className="px-3 text-center">{info.status === "verified" ? "VALID" : "PENDING"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="quiet" onClick={onVerify} disabled={verifying}>{verifying ? "Verifying..." : "Verify"}</Button>
        <Button variant="destructive" onClick={onDelete}>Delete</Button>
      </div>
    </div>
  )
}
