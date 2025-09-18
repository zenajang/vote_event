'use client';

import { useTranslation } from '@/app/i18n/useTranslation';
import { Button } from '@/components/ui/button';

type Country = { id: number; code: string; name: string };

type Props = {
  countries: Country[];
  selectedCountryId: number | null;
  onSelect: (id: number) => void;
  onPrev: () => void;
  onNext: () => void;
  loading?: boolean;   
};

export default function StepCountry({
  countries,
  selectedCountryId,
  onSelect,
  onPrev,
  onNext,
}: Props) {
  const { t } = useTranslation('common');
  return (
    <div className="container mx-auto max-w-xl p-6">
      <h1 className="text-xl font-semibold mb-4">나라 선택</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {countries.map((c) => {
          const active = selectedCountryId === c.id;
          return (
            <Button
              key={c.id}
              variant={active ? 'default' : 'outline'}
              className="h-12"
              onClick={() => onSelect(c.id)}
            >
              {c.name}
            </Button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          {t('button.back')}
        </Button>
        <Button onClick={onNext} disabled={!selectedCountryId}>
          {t('button.next')}
        </Button>
      </div>
    </div>
  );
}
