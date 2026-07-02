import { notFound } from "next/navigation"
import { EditPromptForm } from "@/components/EditPromptForm"

const fetchPrompt = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/prompts/${id}`,
    { cache: "no-store" }
  )
  if (res.status === 404) return null
  return res.json()
}

const EditPromptPage = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const prompt = await fetchPrompt(id)

  if (!prompt) notFound()

  return (
    <>
      <header className="flex items-center justify-between px-8 h-16 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Edit Prompt</h1>
      </header>
      <EditPromptForm prompt={prompt} />
    </>
  )
}

export default EditPromptPage
