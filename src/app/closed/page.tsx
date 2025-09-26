export default function ClosedPage() {
  return (
    <main className="min-h-[calc(100dvh-65px)] flex items-center justify-center">
         <div className="container mx-auto max-w-xl px-10">
            <div className="w-full max-w-md rounded-2xl border bg-white p-6 text-center shadow-sm">
                <h2 className="h1-onboarding text-primary mb-3">Voting has closed.</h2>
                  <p className="text-center text5">
                   Thank you for your participation.
                  </p>
                 <p className="mt-3 text-xs text-muted-foreground">
                    Deadline:{' '}
                    {new Intl.DateTimeFormat('en-GB', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        timeZone: 'Asia/Seoul',
                    }).format(new Date(process.env.NEXT_PUBLIC_VOTE_DEADLINE!))}
                    </p>
                </div>
            </div>
        </main>
    )}
