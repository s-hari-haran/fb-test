'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarGroup
} from '@/components/ui/sidebar';
import { Bot, Loader2, NotebookText } from 'lucide-react';

type SummarySidebarProps = {
  summary: string;
  onSummarize: () => void;
  isSummarizing: boolean;
};

export default function SummarySidebar({
  summary,
  onSummarize,
  isSummarizing,
}: SummarySidebarProps) {
  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-foreground">
              InnerSight
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <Card className="shadow-none border-none bg-transparent">
                    <CardHeader className="p-2 pt-0">
                        <CardTitle className="flex items-center gap-2 text-base font-semibold">
                            <NotebookText className="w-5 h-5" />
                            Session Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 pt-0">
                        {isSummarizing ? (
                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Generating summary...</span>
                            </div>
                        ) : summary ? (
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Click the button below to get a summary of your session.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Button onClick={onSummarize} disabled={isSummarizing} className="w-full">
            {isSummarizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              'Generate Summary'
            )}
          </Button>
        </SidebarFooter>
      </Sidebar>
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <SidebarTrigger />
      </div>
    </>
  );
}
