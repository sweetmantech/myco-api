'use client';
import FeedFilter from '@/components/Feed/Filter';
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Tabs from '@/components/Tabs';
import { tabs } from '@/lib/consts';

export default function FeedLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <meta property="of:accepts:xmtp" content="2024-02-01" />
      <div className="container flex justify-center py-12 font-proxima bg-blend-color-burn">
        <div className="flex w-full max-w-4xl items-start md:gap-10">
          <div className="max-w-full grow">{children}</div>
          <Card className="min-w-64 max-md:hidden">
            <CardHeader className="flex flex-col">
              <Tabs tabs={tabs} />
            </CardHeader>
            <CardContent>
              <FeedFilter />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}