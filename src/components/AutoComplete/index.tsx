'use client';

import {
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"
import { useState, useRef, useCallback, type KeyboardEvent } from "react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export type Option = Record<"value" | "label", string> & Record<string, string>

type AutoCompleteProps = {
  options: Option[]
  emptyMessage: string
  value?: Option
  onValueChange?: (value: Option) => void
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
  height?: number
  width?: number
  visibleItemsCount?: number
  name?: string
}

export const AutoComplete = ({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading = false,
  height,
  width,
  visibleItemsCount = 2,
  name,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState<string>(value?.label ?? "")
  const [selectedValue, setSelectedValue] = useState<string>(value?.value ?? "")

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (!input) {
        return
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setIsOpen(true)
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = options.find(
          (option) => option.label === input.value,
        )
        if (optionToSelect) {
          onValueChange?.(optionToSelect)
        }
      }

      if (event.key === "Escape") {
        input.blur()
      }
    },
    [isOpen, options, onValueChange],
  )

  const handleBlur = useCallback(() => {
    setIsOpen(false)

    // Verifica se o valor digitado corresponde a uma opção
    const matchingOption = options.find(option => option.label === inputValue)

    if (matchingOption) { 
      setSelectedValue(matchingOption.value)
    onValueChange?.(matchingOption)
    } else {
      // Se o valor digitado não corresponder a nenhuma opção, ainda assim será considerado
      setSelectedValue(inputValue)
      onValueChange?.({ value: inputValue, label: inputValue })
    }
  }, [inputValue, options, onValueChange])

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label)
      setSelectedValue(selectedOption.value)
      onValueChange?.(selectedOption)

      setTimeout(() => {
        inputRef?.current?.blur()
      }, 0)
    },
    [onValueChange],
  )

  const maxHeight = 36 * visibleItemsCount + 4

  return (
    <CommandPrimitive onKeyDown={handleKeyDown} className="h-9 border border-input shadow shadow-md rounded-md bg-white">
      <input type="hidden" name={name} value={selectedValue} />
      <div>
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={isLoading ? undefined : setInputValue}
          onBlur={handleBlur}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`text-base h-${height} w-${width} `}
        />
      </div>
      <div className="relative" >
        <div
          className={cn(
            `animate-in fade-in-0 zoom-in-95 absolute top-2 z-100 w-full rounded-xl bg-white outline-none shadow-xl`,
            isOpen ? "block" : "hidden",
          )}
        >
            <CommandList
              style={{ maxHeight: `${maxHeight}px` }}
              className={`rounded-lg ring-1 ring-slate-200 overflow-y-auto scrollbar`}>
              {isLoading ? (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-9 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              ) : null}
              {options.length > 0 && !isLoading ? (
                <CommandGroup>
                  {options.map((option) => {
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onMouseDown={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                        }}
                        onSelect={() => handleSelectOption(option)}
                        className="flex w-full items-center gap-2 text-base pl-8 h-9"
                      >
                        {option.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              ) : null}
              {!isLoading ? (
                <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-base">
                  {emptyMessage}
                </CommandPrimitive.Empty>
              ) : null}
            </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  )
}