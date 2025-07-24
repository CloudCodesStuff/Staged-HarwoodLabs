'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Paintbrush } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

export function PickerExample() {
  const [background, setBackground] = useState('#B4D455')

  return (
    <div
      className="w-full h-full preview flex min-h-[350px] justify-center p-10 items-center rounded !bg-cover !bg-center transition-all"
      style={{ background }}
    >
      <ColorPicker background={background} setBackground={setBackground} />
    </div>
  )
}

export function ColorPicker({
  background,
  setBackground,
  className,
}: {
  background: string
  setBackground: (background: string) => void
  className?: string
}) {
  const solids = [
    // Neutrals
    '#FFFFFF', // White
    '#F5F5F5', // Light Gray
    '#E2E2E2', // Gray
    '#BDBDBD', // Medium Gray
    '#757575', // Dark Gray
    '#000000', // Black

    // Primary Colors
    '#FF0000', // Red
    '#FF6B6B', // Soft Red
    '#FFA647', // Orange
    '#FFD580', // Pastel Orange
    '#FFE83F', // Yellow
    '#FFFACD', // Lemon Chiffon
    '#9FFF5B', // Lime
    '#B4D455', // Pastel Green
    '#70E2FF', // Cyan
    '#A7FFEB', // Mint
    '#5B9CFF', // Blue
    '#B3C7F7', // Pastel Blue
    '#CD93FF', // Lavender
    '#E0BBE4', // Pastel Purple
    '#FF75C3', // Pink
    '#FFD1DC', // Pastel Pink
    '#C1F0F6', // Baby Blue
    '#F3E5F5', // Lilac
    '#F8B195', // Pastel Coral
    '#F67280', // Watermelon
    '#C8E6C9', // Mint Green
    '#FFF9C4', // Light Yellow

    // Deep/Dark Colors
    '#09203F', // Navy
    '#1A1A2E', // Deep Blue
    '#22223B', // Charcoal
    '#2D3142', // Slate

    // Earthy/Muted
    '#A3A380', // Olive
    '#D6CDA4', // Sand
    '#FFE5B4', // Peach
    '#B5EAD7', // Mint Pastel
    '#FFDAC1', // Apricot
    '#E2F0CB', // Light Green
    '#BFD8B8', // Sage
  ]

  const defaultTab = useMemo(() => {
    if (background.includes('url')) return 'image'
    if (background.includes('gradient')) return 'gradient'
    return 'solid'
  }, [background])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'max-w-[220px] justify-start text-left font-normal',
            !background && 'text-muted-foreground',
            className
          )}
        >
          <div className="w-full flex items-center gap-2">
            {background ? (
              <div
                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                style={{ background }}
              ></div>
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="truncate flex-1">
              {background ? background : 'Pick a color'}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
     

          <div  className="flex flex-wrap gap-1 mt-0">
            {solids.map((s) => (
              <div
                key={s}
                style={{ background: s }}
                className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                onClick={() => setBackground(s)}
              />
            ))}
          </div>

    

   


        <Input
          id="custom"
          value={background}
          className="col-span-2 h-8 mt-4 truncate max-w-[220px]"
          onChange={(e) => setBackground(e.currentTarget.value)}
        />
      </PopoverContent>
    </Popover>
  )
}

const GradientButton = ({
  background,
  children,
}: {
  background: string
  children: React.ReactNode
}) => {
  return (
    <div
      className="p-0.5 rounded-md relative !bg-cover !bg-center transition-all"
      style={{ background }}
    >
      <div className="bg-popover/80 rounded-md p-1 text-xs text-center">
        {children}
      </div>
    </div>
  )
}