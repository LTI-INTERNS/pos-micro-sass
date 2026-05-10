"use client";

import { useState, useEffect, useCallback } from "react";
import ProductForecastChart from "@/components/Admin/aiprediction/Product/ProductForecastChart";
import InsightCard from "@/components/Admin/aiprediction/MetricCard";
import ProductDemandList from "@/components/Admin/aiprediction/Product/ProductDemanCard";
import AiInsightLoader from "@/components/Admin/aiprediction/AiInsightLoader";
import { aiInsightService } from "@/lib/services/ai-insight-service";
import type { AiInsightResponse, ProductPayload } from "@/types/ai-insight.types";
import { Brain, RefreshCcw } from "lucide-react";

type Props = { branchId?: string };

export default function ProductAnalysisContent({ branchId }: Props) {
  const [insight, setInsight] = useState<AiInsightResponse<ProductPayload>>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsight = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiInsightService.getProductInsight(branchId);
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
      const data = await aiInsightService.generateProductInsight(branchId);
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
      />

      {payload && (
        <>
          {payload.summary && (
            <p className="text-sm text-gray-500 mb-4 bg-orange-50 rounded-xl px-4 py-3 border border-orange-100">
              {payload.summary}
            </p>
          )}

          <div className="flex flex-col md:flex-col lg:flex-row w-full gap-4">
            <div className="w-full lg:flex-3 min-w-0">
              <ProductForecastChart data={payload.forecastPoints} />
            </div>
            <div className="w-full lg:flex-1 min-w-0 flex justify-center items-start lg:items-center">
              <InsightCard
                title="AI Insight"
                icon={<Brain size={20} />}
                metrics={[
                  { label: "Confidence Level", value: `${payload.confidenceLevel}%`, size: "large" },
                  { label: "Analysis Type", value: "Time Series Forecast", size: "small" },
                ]}
                buttonText={generating ? "Regenerating..." : "Re-analyze"}
                onReanalyze={handleGenerate}
              />
            </div>
          </div>

          <div className="pt-5">
            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Products by Predicted Demand
              </h3>
              <ProductDemandList products={payload.topProducts} />
            </div>
          </div>

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
              {generating ? "Regenerating..." : "Regenerate Product Analysis"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
