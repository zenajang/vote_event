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

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  const handleNext = () => {
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

      <div className="px-6 pb-9">
        <Button
            onClick={handleNext}
            className="btn-primary1">
            Next
        </Button>
      </div>
    </main>
  );
}
