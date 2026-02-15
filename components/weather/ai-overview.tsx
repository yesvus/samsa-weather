"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AIOverviewProps {
  onGenerate: () => Promise<void>;
  suggestion: string;
  loading: boolean;
  language: string;
}

export function AIOverview({
  onGenerate,
  suggestion,
  loading,
  language,
}: AIOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">
          {language === "en" ? "AI Overview" : "AI Özeti"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-slate-700 whitespace-pre-wrap min-h-[80px]">
            {suggestion}
          </p>
          <Button
            onClick={onGenerate}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "en" ? "Generating..." : "Oluşturuluyor..."}
              </>
            ) : (
              language === "en" ? "Ask AI!" : "AI'ya Sor!"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
