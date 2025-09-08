import { downloadUrl } from '@/lib/mongo/download-url';
import { Guide, ResourceType } from '@prisma/client';
import { GuideLink } from '../content/guides/guide-link';

interface GuideCardProps {
  guide: Guide;
}

export const NewsGuideCard = ({ guide }: GuideCardProps) => {
  const resource = typeof guide.resource === 'string' ? JSON.parse(guide.resource) : guide.resource || {};

  const fileUrl =
    guide.resourceType === ResourceType.FILE
      ? downloadUrl(resource.file?.value?.id, true)
      : resource.url || resource.link;
  return <GuideLink key={guide.id} title={guide.title} fileUrl={fileUrl} />;
};
