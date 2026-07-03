import { redirect } from "next/navigation"
import { ReviewUpdateForm } from "./ReviewUpdateForm"
import { PageHeader } from "@/components/PageHeader"
import { BackLink } from "@/components/BackLink"

const fetchUpdateStatus = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/prompts/${id}/update-status`,
    { cache: "no-store" }
  )
  return res.json()
}

const ReviewUpdatePage = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const status = await fetchUpdateStatus(id)

  if (!status.hasUpdate) redirect(`/prompts/${id}`)

  return (
    <>
      <PageHeader title="Review Update" />

      <main className="flex-1 px-8 py-6">
        <BackLink href={`/prompts/${id}`} label="Back to Prompt" />

        <ReviewUpdateForm
          promptId={id}
          base={status.base}
          upstream={status.upstream}
          customer={status.customer}
        />
      </main>
    </>
  )
}

export default ReviewUpdatePage
