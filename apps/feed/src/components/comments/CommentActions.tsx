"use client"

import React from "react"
import { MoreHorizontal, Pencil } from "lucide-react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverList,
  PopoverListItem,
} from "@feedgot/ui/components/popover"
import CommentDeleteAction from "./CommentDeleteAction"
import CommentReportAction from "./CommentReportAction"

interface CommentActionsProps {
  commentId: string
  isAuthor: boolean
  canDelete?: boolean
  onEdit?: () => void
  onDeleteSuccess?: () => void
}

export default function CommentActions({
  commentId,
  isAuthor,
  canDelete = false,
  onEdit,
  onDeleteSuccess,
}: CommentActionsProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
          aria-label="More options"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" list>
        <PopoverList>
          {isAuthor ? (
            <>
              {onEdit && (
                <PopoverListItem onClick={() => { onEdit(); setOpen(false); }}>
                  <Pencil className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-sm">Edit</span>
                </PopoverListItem>
              )}
              {canDelete && (
                <CommentDeleteAction 
                  commentId={commentId} 
                  onSuccess={onDeleteSuccess} 
                  onCloseMenu={() => setOpen(false)} 
                />
              )}
            </>
          ) : (
            <>
              {canDelete && (
                <CommentDeleteAction 
                  commentId={commentId} 
                  onSuccess={onDeleteSuccess} 
                  onCloseMenu={() => setOpen(false)} 
                />
              )}
              <CommentReportAction 
                commentId={commentId} 
                onCloseMenu={() => setOpen(false)} 
              />
            </>
          )}
        </PopoverList>
      </PopoverContent>
    </Popover>
  )
}

