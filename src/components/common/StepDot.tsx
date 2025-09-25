'use client';

type Props = {
  items: string[];
  dotSize?: number;
  gap?: number;
};

export default function StepDot({ items, dotSize = 17, gap = 28 }: Props) {
  return (
    <ol className="space-y-0">
      {items.map((label, i) => {
        const isLast = i === items.length - 1;
        return (
          <li
            key={`${label}-${i}`}
            className="relative grid gap-3 items-start"          
            style={{
              gridTemplateColumns: `${dotSize}px 1fr`,
              paddingBottom: isLast ? 0 : `${gap}px`,
            }}
          >

            <div className="flex flex-col items-center" style={{ width: dotSize }}>
              <span
                className="grid place-items-center rounded-full text-[10px] font-semibold text-red-500"
                style={{
                  width: dotSize,
                  height: dotSize,
                  backgroundColor: '#FFCFCF',
                  border: '1px solid #FFCFCF',
                }}
              >
                {i + 1}
              </span>
            </div>

            {!isLast && (
              <span
                className="absolute border-l-2 border-dotted"
                style={{
                  left: `${dotSize / 2}px`,          
                  top: `${dotSize}px`,               
                  bottom: '-1px',                    
                  transform: 'translateX(-1px)',     
                  borderColor: '#FFCFCF',
                }}
                aria-hidden
              />
            )}

            <div className="text-[12px] font-medium">{label}</div>
          </li>
        );
      })}
    </ol>
  );
}
