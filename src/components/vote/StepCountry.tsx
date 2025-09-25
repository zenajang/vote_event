'use client';

import { useTranslation } from '@/app/i18n/useTranslation';
import { Button } from '@/components/ui/button';
import { cn, regionNameByLocale } from '@/lib/utils';
import Image from 'next/image';
import StepDot from '../common/StepDot';

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
  const { t, lng } = useTranslation('common');
  return (
    <>
    <div className="container mx-auto max-w-xl px-6 pt-6">
      <h1 className="heading3-primary text-primary text-center">
          GME Cricket Tournament-2025
      </h1>    
    </div>
      <div className="container mx-auto mt-4 max-w-xl rounded-xl bg-[#FFF4F4] px-10 py-5 flex items-start justify-between">
        <div>
          <div className="text-[15px] font-medium text-primary">
            Powered by GME Finance
          </div>
          <div className="text-[9px] text-muted-foreground">
            Fast, Easy and Safe Loan
          </div>
        </div>
        <div className="text-2xl leading-none select-none">
          <Image
            src="/images/stopwatch.png"
            alt="stopwatch" 
            width={80}
            height={24}
          />
        </div>
      </div>
    <div className="container mx-auto max-w-xl p-6">
      <section className="mb-5">
        <h2 className="heading3-primary mb-2">Vote Your Favorite Team</h2>
        <div className="flex items-start gap-3">
          <StepDot 
            items={['Select Your Country', 'Choose Your Team', 'Submit Your Vote']}
            dotSize={18} gap={19} />
        </div>

      </section>
      <h1 className="heading3-primary mb-4">{t('country.title')}</h1>

      <div className="grid grid-cols-1 gap-3">
        {countries.map((c) => {
          const active = selectedCountryId === c.id;
          const label = regionNameByLocale(c.code, lng);

          return (
            <Button
              key={c.id}
              variant="outline"
              size="lg"
              onClick={() => onSelect(c.id)}
              className={cn(
                "w-full h-16 px-4 justify-start gap-3 rounded-2xl",
                "border border-input text-foreground hover:bg-transparent hover:text-inherit",
                "shadow-[0_6px_10px_rgba(0,0,0,0.14)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]",
                active && "border-1 border-primary text-primary"
              )}
            >
              <Image
                src={`/images/country/${c.code.toLowerCase()}.png`}
                alt={`${label} flag`}
                width={32}
                height={22}
                className="object-cover"
              />
              <span className="text-[14px] font-bold leading-none">{label}</span>
            </Button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" className="btn-prev" onClick={onPrev}>
          {t('button.back')}
        </Button>
        <Button onClick={onNext} className="btn-next" disabled={!selectedCountryId}>
          {t('button.next')}
        </Button>
      </div>
    </div>
    </>
  );
}
