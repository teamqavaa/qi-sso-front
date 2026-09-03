import PathDetailView from "@/components/dashboard/path-detail/PathDetailView";

export default async function CareerTrackDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <PathDetailView
      kind="career"
      slug={slug}
      crumbs={[
        { label: "Career tracks", href: "/career-tracks" },
        { label: slug, href: `/career-tracks/${slug}` },
      ]}
      courseLinkBase="/browse-courses"
    />
  );
}
