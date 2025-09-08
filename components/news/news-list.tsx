import { News } from '@prisma/client';
import Link from 'next/link';
import { NewsCard } from '@/components/news/news-card';

type Prp = {
  news: News[];
  backLink: 'home' | 'news' | 'managers';
};
export default function NewsList({ news, backLink }: Prp) {
  return (
    <div className="flex justify-center flex-wrap gap-8 md:m-8">
      {news.length > 0 &&
        news.map((n) => (
          <Link className="max-w-[80vw]" key={n.id} href={`/news/${n.id}?backLink=${backLink}`}>
            <NewsCard news={n} />
          </Link>
        ))}
    </div>
  );
}
