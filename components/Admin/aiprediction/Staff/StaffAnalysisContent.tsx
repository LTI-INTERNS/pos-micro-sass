// StaffAnalysisContent.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCcw } from "lucide-react";
import Staff from "@/components/Admin/aiprediction/Staff/staff";
import AiInsightLoader from "@/components/Admin/aiprediction/AiInsightLoader";
import { aiInsightService } from "@/lib/services/ai-insight-service";
import type { AiInsightResponse, StaffPayload } from "@/types/ai-insight.types";

type Props = { branchId?: string };

export default function StaffAnalysisContent({ branchId }: Props) {
  const [insight,    setInsight]    = useState<AiInsightResponse<StaffPayload>>(null);
  const [loading,    setLoading]    = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const fetchInsight = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiInsightService.getStaffInsight(branchId);
      setInsight(data);
    } catch {
      setError("Failed to load insight.");
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => { fetchInsight(); }, [fetchInsight]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const data = await aiInsightService.generateStaffInsight(branchId);
      setInsight(data);
    } catch {
      setError("Failed to generate insight. Check your Gemini API key.");
    } finally {
      setGenerating(false);
    }
  };

  const payload = insight?.payload;

  return (
    <div>
      <AiInsightLoader
        loading={loading}
        generating={generating}
        error={error}
        hasData={!!payload}
        onGenerate={handleGenerate}
        generateLabel="Generate Staff AI Analysis"
      />

      {payload && (
        <>
          {payload.summary && (
            <p className="text-sm text-gray-500 mb-4 bg-orange-50 rounded-xl px-4 py-3 border border-orange-100">
              {payload.summary}
            </p>
          )}

          <Staff cashiers={payload.cashiers} />

          {payload.recommendations?.length > 0 && (
            <div className="pt-5">
              <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-3">AI Recommendations</h3>
                <ul className="space-y-2">
                  {payload.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-orange-500 mt-0.5">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              Last updated: {new Date(insight.generatedAt).toLocaleString()}
            </p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCcw size={16} className={generating ? "animate-spin" : ""} />
              {generating ? "Regenerating..." : "Regenerate Staff Analysis"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
