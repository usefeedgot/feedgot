"use client"

import { Button } from "@feedgot/ui/components/button"
import { Popover, PopoverTrigger, PopoverContent, PopoverList, PopoverListItem } from "@feedgot/ui/components/popover"
import { DropdownIcon } from "@feedgot/ui/icons/dropdown"

type SidebarPosition = "left" | "right"

export default function SidebarPositionPicker({ value, onSelect, options = ["left", "right"] }: { value: SidebarPosition; onSelect: (p: SidebarPosition) => void; options?: SidebarPosition[] }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="h-9 w-fit min-w-0 justify-between px-2">
          <span className="text-sm capitalize">{value}</span>
          <DropdownIcon className="opacity-60" size={12} />
        </Button>
      </PopoverTrigger>
      <PopoverContent list>
        <PopoverList>
          {options.map((p) => (
            <PopoverListItem key={p} onClick={() => onSelect(p)}>
              <span className="text-sm capitalize">{p}</span>
            </PopoverListItem>
          ))}
        </PopoverList>
      </PopoverContent>
    </Popover>
  )
}

