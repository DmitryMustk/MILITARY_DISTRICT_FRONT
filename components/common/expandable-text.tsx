'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';

export default function ExpandableText({ text }: { text: string }) {
  const t = useTranslations('Component.ExpandableText');
  const [isTruncated, setIsTruncated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, []);

  return (
    <div className="relative">
      <div
        ref={textRef}
        className={
          'whitespace-pre-line truncate' + (isExpanded ? 'overflow-visible' : 'line-clamp-[5] overflow-hidden')
        }
      >
        {text}
      </div>

      {isTruncated && !isExpanded && (
        <Button variant={'link'} className="mt-2 pl-0" onClick={() => setIsExpanded(true)}>
          {t('showMore')}
        </Button>
      )}

      {isTruncated && isExpanded && (
        <Button variant={'link'} className="mt-2 pl-0" onClick={() => setIsExpanded(false)}>
          {t('collapse')}
        </Button>
      )}
    </div>
  );
}
