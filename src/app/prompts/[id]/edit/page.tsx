import { notFound } from "next/navigation"
import { EditPromptForm } from "@/components/EditPromptForm"
import { PageHeader } from "@/components/PageHeader"

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
      <PageHeader title="Edit Prompt" />
      <EditPromptForm prompt={prompt} />
    </>
  )
}

export default EditPromptPage
