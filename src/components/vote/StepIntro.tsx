'use client';

import { useTranslation } from '@/app/i18n/useTranslation';
import { Button } from '@/components/ui/button';

type Props = { onNext: () => void };

export default function StepIntro({ onNext }: Props) {
  const { t } = useTranslation('common');
  return (
    <div className="container mx-auto max-w-3xl p-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">{t('intro.title')}</h1>
      {/* 팜플렛 이미지 */}
    {/*   <img
        src="/pamphlet.jpg"
        alt="Event"
        className="mx-auto mb-6 max-h-[420px] object-contain rounded-lg shadow-sm"
      /> */}
      <p className="text-muted-foreground mb-6">
        {t('intro.description')}
      </p>
      <Button size="lg" onClick={onNext}>
        {t('button.next')}
      </Button>
    </div>
  );
}
