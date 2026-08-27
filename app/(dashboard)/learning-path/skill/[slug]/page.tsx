import SkillDetailView from "@/components/dashboard/path-detail/SkillDetailView";

export default async function SkillPathDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <SkillDetailView slug={slug} />;
}
