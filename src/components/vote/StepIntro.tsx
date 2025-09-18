'use client';

import { useTranslation } from '@/app/i18n/useTranslation';
import { Button } from '@/components/ui/button';

type Props = { onNext: () => void };

export default function StepIntro({ onNext }: Props) {
  const { t } = useTranslation('common');
  return (
    <div className="container mx-auto max-w-3xl p-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">이벤트 안내</h1>
      {/* 팜플렛 이미지 */}
    {/*   <img
        src="/pamphlet.jpg"
        alt="Event"
        className="mx-auto mb-6 max-h-[420px] object-contain rounded-lg shadow-sm"
      /> */}
      <p className="text-muted-foreground mb-6">
        참여 국가와 팀을 선택하고 투표를 진행해주세요.
      </p>
      <Button size="lg" onClick={onNext}>
        {t('button.next')}
      </Button>
    </div>
  );
}
