"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";


export default function MainClient() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const qs = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsLoadingAuth(false);
    });
  }, [supabase]);

  const handleNext = () => {
    if (isLoading) return;
    setIsLoading(true);
    const current = pathname + (qs?.toString() ? `?${qs}` : "");
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(current)}`);
    } else {
      router.push(`/vote`);
    }
  };

  return (
    <main className="flex flex-col min-h-[calc(100dvh-65px)] bg-[#FAFAFA]">
      <div className="flex-1 px-4 py-6 space-y-4">
        <h1 className="h1-onboarding text-primary text-center">
          GME Cricket Tournament-2025
        </h1>
        <p className="heading3-secondary text-center">
          Organized by: GME Finance Co., Ltd.<br />
          Supported by: Korea Cricket Association (KCA)
        </p>

        <div className="flex justify-center">
          <Image
            src="/images/poster.png"
            alt="Cricket Tournament Poster"
            width={320}
            height={420}
            className="rounded-xl border border-gray-200 shadow"
          />
        </div>
      </div>

      <div className="px-6 pb-10">
        <Button
            onClick={handleNext}
            disabled={isLoading}
            className="btn-primary1">
            {isLoadingAuth || isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{isLoadingAuth ? "Signing..." : "Loading..."}</span>
              </div>
            ) : (
              "Next"
            )}
        </Button>
      </div>
    </main>
  );
}
