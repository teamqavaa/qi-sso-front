import PathDetailView from "@/components/dashboard/path-detail/PathDetailView";

export default async function SkillPathDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PathDetailView kind="skill" slug={slug} />;
}
