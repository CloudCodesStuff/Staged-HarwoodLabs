"use client"

import { Suspense } from 'react'
import { Editor } from "@/components/editor"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

function EditorComponent() {
  const searchParams = useSearchParams()
  const projectId = searchParams?.get("projectId")
  const updateId: string | null = searchParams?.get("updateId") ?? null

  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4">Project ID is missing.</p>
        <Link href="/dashboard">
          <Button variant="outline">Go to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return <Editor projectId={projectId} updateId={updateId} />
}

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="max-w-6xl py-4 px-2 md:px-2 md:py-8 mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <EditorComponent />
        </Suspense>
      </div>
    </div>
  )
} 