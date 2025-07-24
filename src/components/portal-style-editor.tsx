"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Palette } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/trpc/react"
import { ColorPicker } from "@/components/ui/color-picker"
import { useSession } from "next-auth/react"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface PortalStyleEditorProps {
  projectId: string
}

const themes = [
  {
    name: "Default",
    id: "default",
    styles: {
      primaryColor: "#3b82f6",
      textColor: "#1f2937",
      backgroundColor: "#ffffff",
    },
  },
  {
    name: "Dark",
    id: "dark",
    styles: {
      primaryColor: "#60a5fa",
      textColor: "#e5e7eb",
      backgroundColor: "#111827",
    },
  },
  {
    name: "Stone",
    id: "stone",
    styles: {
      primaryColor: "#7c3aed",
      textColor: "#1c1917",
      backgroundColor: "#fafaf9",
    },
  },
  {
    name: "Emerald",
    id: "emerald",
    styles: {
      primaryColor: "#10b981",
      textColor: "#064e3b",
      backgroundColor: "#ecfdf5",
    },
  },
  {
    name: "Rose",
    id: "rose",
    styles: {
      primaryColor: "#f43f5e",
      textColor: "#881337",
      backgroundColor: "#fff1f2",
    },
  },
  {
    name: "Amber",
    id: "amber",
    styles: {
      primaryColor: "#f59e42",
      textColor: "#78350f",
      backgroundColor: "#fffbeb",
    },
  },
  {
    name: "Slate",
    id: "slate",
    styles: {
      primaryColor: "#64748b",
      textColor: "#0f172a",
      backgroundColor: "#f1f5f9",
    },
  },
  {
    name: "Sky",
    id: "sky",
    styles: {
      primaryColor: "#0ea5e9",
      textColor: "#0c4a6e",
      backgroundColor: "#e0f2fe",
    },
  },
  {
    name: "Violet",
    id: "violet",
    styles: {
      primaryColor: "#8b5cf6",
      textColor: "#312e81",
      backgroundColor: "#f5f3ff",
    },
  },
  {
    name: "Fuchsia",
    id: "fuchsia",
    styles: {
      primaryColor: "#d946ef",
      textColor: "#701a75",
      backgroundColor: "#fdf4ff",
    },
  },
  {
    name: "Teal",
    id: "teal",
    styles: {
      primaryColor: "#14b8a6",
      textColor: "#134e4a",
      backgroundColor: "#f0fdfa",
    },
  },
  {
    name: "Indigo",
    id: "indigo",
    styles: {
      primaryColor: "#6366f1",
      textColor: "#312e81",
      backgroundColor: "#eef2ff",
    },
  },
  {
    name: "Lime",
    id: "lime",
    styles: {
      primaryColor: "#a3e635",
      textColor: "#365314",
      backgroundColor: "#f7fee7",
    },
  },
  {
    name: "Orange",
    id: "orange",
    styles: {
      primaryColor: "#fb923c",
      textColor: "#7c2d12",
      backgroundColor: "#fff7ed",
    },
  },
  {
    name: "Cyan",
    id: "cyan",
    styles: {
      primaryColor: "#06b6d4",
      textColor: "#164e63",
      backgroundColor: "#ecfeff",
    },
  },
  {
    name: "Pink",
    id: "pink",
    styles: {
      primaryColor: "#ec4899",
      textColor: "#831843",
      backgroundColor: "#fdf2f8",
    },
  },
  {
    name: "Forest",
    id: "forest",
    styles: {
      primaryColor: "#166534",
      textColor: "#f0fdf4",
      backgroundColor: "#052e16",
    },
  },
  {
    name: "Night",
    id: "night",
    styles: {
      primaryColor: "#0ea5e9",
      textColor: "#f1f5f9",
      backgroundColor: "#0f172a",
    },
  },
  {
    name: "Coffee",
    id: "coffee",
    styles: {
      primaryColor: "#a16207",
      textColor: "#3f2e1c",
      backgroundColor: "#f5f5dc",
    },
  },
  {
    name: "Mint",
    id: "mint",
    styles: {
      primaryColor: "#2dd4bf",
      textColor: "#134e4a",
      backgroundColor: "#f0fdfa",
    },
  },
  {
    name: "Sunset",
    id: "sunset",
    styles: {
      primaryColor: "#f472b6",
      textColor: "#be185d",
      backgroundColor: "#fff7fb",
    },
  },
  {
    name: "Royal",
    id: "royal",
    styles: {
      primaryColor: "#3b82f6",
      textColor: "#1e293b",
      backgroundColor: "#e0e7ff",
    },
  },
  {
    name: "Charcoal",
    id: "charcoal",
    styles: {
      primaryColor: "#64748b",
      textColor: "#f1f5f9",
      backgroundColor: "#1e293b",
    },
  },
  {
    name: "Gold",
    id: "gold",
    styles: {
      primaryColor: "#f59e42",
      textColor: "#78350f",
      backgroundColor: "#fffbe6",
    },
  },
  {
    name: "Aqua",
    id: "aqua",
    styles: {
      primaryColor: "#22d3ee",
      textColor: "#0e7490",
      backgroundColor: "#f0fdfa",
    },
  },
  {
    name: "Ruby",
    id: "ruby",
    styles: {
      primaryColor: "#be123c",
      textColor: "#fef2f2",
      backgroundColor: "#881337",
    },
  },
  {
    name: "Steel",
    id: "steel",
    styles: {
      primaryColor: "#64748b",
      textColor: "#1e293b",
      backgroundColor: "#f1f5f9",
    },
  },
  {
    name: "Lavender",
    id: "lavender",
    styles: {
      primaryColor: "#a78bfa",
      textColor: "#4c1d95",
      backgroundColor: "#f5f3ff",
    },
  },
  {
    name: "Coral",
    id: "coral",
    styles: {
      primaryColor: "#fb7185",
      textColor: "#7f1d1d",
      backgroundColor: "#fff0f0",
    },
  },
  {
    name: "Platinum",
    id: "platinum",
    styles: {
      primaryColor: "#a3a3a3",
      textColor: "#18181b",
      backgroundColor: "#fafafa",
    },
  },
];

const ROUNDEDNESS_ENUM = ["none", "sm", "md", "lg", "xl"] as const;
const TEXTSIZE_ENUM = ["sm", "base", "lg"] as const;

function getValidEnumValue<T extends readonly string[]>(
  value: string | undefined | null,
  allowed: T,
  fallback: T[number]
): T[number] {
  if (value && allowed.includes(value as T[number])) {
    return value as T[number];
  }
  return fallback;
}

export function PortalStyleEditor({ projectId }: PortalStyleEditorProps) {
  const { data: session } = useSession();
  const { data: project } = api.project.getById.useQuery({ id: projectId })

  const isSubscribed = session?.user?.stripeSubscriptionStatus === "active";

  const [formData, setFormData] = useState({
    primaryColor: "#3b82f6",
    textColor: "#1f2937",
    backgroundColor: "#ffffff",
    textSize: "base" as "sm" | "base" | "lg",
    roundedness: "md" as "none" | "sm" | "md" | "lg" | "xl",
  })

  const utils = api.useUtils()
  const updatePortalStyle = api.project.updatePortalStyle.useMutation({
    onSuccess: () => {
      toast.success("Portal style updated")
      utils.project.getById.invalidate({ id: projectId })
    },
    onError: (error: { message: any }) => {
      toast.error(error.message || "Failed to update portal style")
    },
  })

  useEffect(() => {
    if (project) {
      setFormData({
        primaryColor: project.primaryColor || "#3b82f6",
        textColor: project.textColor || "#1f2937",
        backgroundColor: project.backgroundColor || "#ffffff",
        textSize: getValidEnumValue(project.textSize, TEXTSIZE_ENUM, "base"),
        roundedness: getValidEnumValue(project.roundedness, ROUNDEDNESS_ENUM, "md"),
      })
    }
  }, [project])

  const handleThemeChange = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (theme) {
      setFormData((prev) => ({
        ...prev,
        ...theme.styles,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ensure only valid enum values are sent
    const safeFormData = {
      ...formData,
      textSize: getValidEnumValue(formData.textSize, TEXTSIZE_ENUM, "base"),
      roundedness: getValidEnumValue(formData.roundedness, ROUNDEDNESS_ENUM, "md"),
    }
    updatePortalStyle.mutate({ id: projectId, ...safeFormData })
  }

  return (
<Card className="w-full mx-auto border border-border bg-background shadow-none">
  <CardContent className="pt-6">
    <div className="flex flex-col md:flex-row gap-10 md:gap-16">
      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="w-full md:max-w-2xl space-y-8">
        {/* Theme Selector */}
        <div>
          <Label className="block mb-2 text-sm font-semibold">Theme</Label>
          <Select onValueChange={handleThemeChange} disabled={!isSubscribed}>
            <SelectTrigger>
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              {themes.map((theme) => (
                <SelectItem key={theme.id} value={theme.id}>
                  {theme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border-t border-border" />

        {/* Color Pickers */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold">Colors</h3>
          {[
            { label: "Primary", key: "primaryColor" },
            { label: "Text", key: "textColor" },
            { label: "Background", key: "backgroundColor" },
          ].map(({ label, key }) => {
            const isDisabled = !isSubscribed && key !== 'primaryColor';
            const colorPicker = (
              <ColorPicker
                background={formData[key as keyof typeof formData]}
                setBackground={(val) => {
                  if (!isDisabled) {
                    setFormData({ ...formData, [key]: val });
                  }
                }}
              />
            );
            return (
              <div
                key={key}
                className="flex items-center justify-between bg-muted/40 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <Label className="font-medium">{label}</Label>
                  {isDisabled && <Badge variant="secondary">Pro</Badge>}
                </div>

                {isDisabled ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-not-allowed">{colorPicker}</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upgrade to Pro to customize.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  colorPicker
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t border-border" />

        {/* Typography & Layout */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Typography & Layout</h3>
            {!isSubscribed && <Badge variant="secondary">Pro</Badge>}
          </div>
          {[
            {
              label: "Text Size",
              key: "textSize",
              enum: TEXTSIZE_ENUM,
              default: "base",
              options: [
                { value: "sm", label: "Small" },
                { value: "base", label: "Base" },
                { value: "lg", label: "Large" },
              ],
            },
            {
              label: "Roundedness",
              key: "roundedness",
              enum: ROUNDEDNESS_ENUM,
              default: "md",
              options: [
                { value: "none", label: "None" },
                { value: "sm", label: "Small" },
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
                { value: "xl", label: "Extra Large" },
              ],
            },
          ].map(({ label, key, options, enum: ENUM, default: defVal }) => (
            <div
              key={key}
              className="flex items-center justify-between bg-muted/40 rounded-lg px-4 py-3"
            >
              <Label className="font-medium">{label}</Label>
              <Select
                value={formData[key as keyof typeof formData]}
                onValueChange={(val) => {
                  if (isSubscribed) {
                    // @ts-ignore - TODO: fix this
                    setFormData({ ...formData, [key]: getValidEnumValue(val, ENUM, defVal) })
                  }
                }}
                disabled={!isSubscribed}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SelectTrigger className="w-28">
                        <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                      </SelectTrigger>
                    </TooltipTrigger>
                    {!isSubscribed && (
                      <TooltipContent>
                        <p>Upgrade to Pro to customize.</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="border-t border-border" />

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={updatePortalStyle.isPending}
            className="w-full text-sm"
          >
            {updatePortalStyle.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Save Changes
          </Button>
        </div>
      </form>

      {/* Live Preview */}
      <div className="w-full md:max-w-xs border rounded-lg p-4 flex-1">
        <Label className="mb-2 block">Preview</Label>
        <div
          className="rounded-xl border-2 shadow-lg w-full flex flex-col gap-0 relative overflow-hidden"
          style={{
            background: formData.backgroundColor,
            color: formData.textColor,
            borderColor: formData.primaryColor,
            borderWidth: 2,
            fontSize:
              formData.textSize === "sm"
                ? "0.95rem"
                : formData.textSize === "lg"
                ? "1.15rem"
                : "1rem",
            borderRadius:
              formData.roundedness === "none"
                ? "0rem"
                : formData.roundedness === "sm"
                ? "0.375rem"
                : formData.roundedness === "md"
                ? "0.75rem"
                : formData.roundedness === "lg"
                ? "1rem"
                : "1.25rem",
          }}
        >
          {/* Blurred primary color background effect for dark mode */}
          {formData.backgroundColor === "#111827" && (
            <div
              className="absolute inset-0 z-0"
              style={{
                background: `radial-gradient(circle at 60% 40%, ${formData.primaryColor}33 0%, transparent 70%)`,
                filter: "blur(32px)",
                opacity: 0.7,
              }}
            />
          )}
          {/* Header */}
          <div className="flex items-center gap-3 px-5 pt-5 pb-3 relative z-10">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-base shadow"
              style={{ background: formData.primaryColor, color: "#fff" }}
            >
              CL
            </div>
            <div className="flex flex-col">
              <span
                className="font-semibold text-base"
                style={{ color: formData.primaryColor }}
              >
                Client Portal
              </span>
              <span className="text-xs opacity-70" style={{ color: formData.textColor }}>
                Welcome, Client
              </span>
            </div>
          </div>
          {/* Divider */}
          <div className="w-full border-t relative z-10" style={{ borderColor: formData.primaryColor, opacity: 0.12 }} />
          {/* Content */}
          <div className="flex flex-col gap-3 px-5 py-4 relative z-10">
            <div className="text-sm opacity-80" style={{ color: formData.textColor }}>
              This is your homebase for updates, milestones, and chat.
            </div>
            {/* Stat Card */}
            <div
              className="rounded-lg border flex items-center gap-3 px-3 py-2"
              style={{
                background: formData.backgroundColor === "#fff" ? "#f9fafb" : "#fff1",
                color: formData.primaryColor,
                borderColor: formData.primaryColor,
                fontWeight: 600,
                fontSize: "0.95em",
              }}
            >
              <span className="text-xs font-semibold">Milestones</span>
              <span className="ml-auto text-xs font-bold" style={{ color: formData.textColor }}>
                3/5
              </span>
            </div>
            {/* Progress Bar */}
            <div
              className="w-full h-2 rounded-full"
              style={{ background: formData.backgroundColor === "#fff" ? "#e5e7eb" : "#d1d5db33" }}
            >
              <div
                className="h-2 rounded-full"
                style={{
                  width: "60%",
                  background: formData.primaryColor,
                  transition: "width 0.3s",
                }}
              />
            </div>
            {/* Primary Button */}
            <button
              type="button"
              style={{
                background: formData.primaryColor,
                color: "#fff",
                borderRadius:
                  formData.roundedness === "none"
                    ? "0rem"
                    : formData.roundedness === "sm"
                    ? "0.375rem"
                    : formData.roundedness === "md"
                    ? "0.5rem"
                    : formData.roundedness === "lg"
                    ? "0.75rem"
                    : "1rem",
                padding: "0.5rem 1.25rem",
                fontWeight: 600,
                fontSize: "0.95em",
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              Primary Button
            </button>
          </div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

  )
}
