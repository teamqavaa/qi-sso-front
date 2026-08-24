import PathDetailView from "@/components/dashboard/path-detail/PathDetailView";

export default async function CareerPathDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PathDetailView kind="career" slug={slug} />;
}
