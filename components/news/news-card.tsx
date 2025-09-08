import { News } from '@prisma/client';
import { PropsWithChildren } from 'react';
import { NewsImage } from '@/components/news/news-image';

type Prp = {
  news: News;
};

export function NewsCard({ news, children }: PropsWithChildren<Prp>) {
  return (
    <div key={news.id} className="flex flex-col flex-grow border border-primary max-w-96 h-full">
      {news.mainPictureId && <NewsImage imageId={news.mainPictureId} />}
      <div className="flex flex-col gap-8 p-8 flex-grow justify-between md:w-[384px]">
        <div>
          <h2 className="overflow-hidden text-ellipsis leading-8 mb-6 font-bold">{news.title}</h2>
          {(news.description || children) && (
            <div className="overflow-hidden text-ellipsis line-clamp-3">{news.description}</div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
