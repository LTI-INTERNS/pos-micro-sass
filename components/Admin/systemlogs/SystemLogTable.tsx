"use client";

import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import type { SystemLogEntry, SystemActionType } from "@/lib/services/system-log-service";

// ── Diff-aware JSON renderer ──────────────────────────────────────────────────

/**
 * Renders a JSON object line-by-line, highlighting lines that differ
 * between beforeObj and afterObj.
 * mode="before" → removed/changed lines highlighted red
 * mode="after"  → added/changed lines highlighted green
 * When the peer object is absent, renders plain JSON without highlights.
 */
function DiffPre({
  obj,
  peer,
  mode,
}: {
  obj: unknown;
  peer: unknown | null;
  mode: "before" | "after";
}) {
  const lines = JSON.stringify(obj, null, 2).split("\n");
  const peerLines = peer ? JSON.stringify(peer, null, 2).split("\n") : null;

  const changedSet = new Set<number>();
  if (peerLines) {
    const maxLen = Math.max(lines.length, peerLines.length);
    for (let i = 0; i < maxLen; i++) {
      const a = lines[i] ?? "";
      const b = peerLines[i] ?? "";
      if (a !== b) changedSet.add(i);
    }
  }

  const highlightCls =
    mode === "before"
      ? "bg-red-50 text-red-700"
      : "bg-green-50 text-green-700";

  return (
    <pre className="max-h-48 overflow-auto rounded-lg bg-white border border-gray-100 p-3 text-[11px] text-gray-700">
      {lines.map((line, i) => (
        <span
          key={i}
          className={`block whitespace-pre ${
            changedSet.has(i) ? highlightCls : ""
          }`}
        >
          {line}
        </span>
      ))}
    </pre>
  );
}

// ── Action badge using plain inline styles matching app's orange/gray palette ─

const ACTION_LABEL: Record<SystemActionType, string> = {
  CREATE: "Create",
  UPDATE: "Update",
  DELETE: "Delete",
  LOGIN:  "Login",
  LOGOUT: "Logout",
  REFUND: "Refund",
};

const ACTION_COLOR: Record<SystemActionType, string> = {
  CREATE: "text-green-600  bg-green-50  border-green-200",
  UPDATE: "text-amber-600  bg-amber-50  border-amber-200",
  DELETE: "text-red-600    bg-red-50    border-red-200",
  LOGIN:  "text-blue-600   bg-blue-50   border-blue-200",
  LOGOUT: "text-gray-500   bg-gray-50   border-gray-200",
  REFUND: "text-orange-600 bg-orange-50 border-orange-200",
};

// ── Row shape for CommonTable ─────────────────────────────────────────────────

export type LogRow = {
  id: string;
  timestamp: string;
  role: string;
  action: SystemActionType;
  entity: string;
  branch: string;
  message: string;
  // keep originals for expandable detail
  _raw: SystemLogEntry;
};

type Props = {
  logs: SystemLogEntry[];
  expandedId: string | null;
  onExpand: (id: string | null) => void;
};

function toRow(log: SystemLogEntry): LogRow {
  const loginDate = new Date(log.createdAt);
  const formattedLogin = loginDate.toLocaleString("en-GB", {
    day:    "2-digit",
    month:  "short",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  });

  const timestamp = formattedLogin;
  const message = log.message ?? "—";

  return {
    id:      log.logId,
    timestamp,
    role:    log.role,
    action:  log.actionType,
    entity:  log.entityType,
    branch:  log.branch?.name ?? "—",
    message,
    _raw:    log,
  };
}

export default function SystemLogTable({ logs, expandedId, onExpand }: Props) {
  const rows: LogRow[] = logs.map(toRow);

  const columns: Column<LogRow>[] = [
    {
      key: "index",
      label: "",
      render: (_, i) => i + 1,
    },
    { key: "timestamp", label: "Timestamp" },
    { key: "role",      label: "Role" },
    {
      key: "action",
      label: "Action",
      render: (row) => {
        const cls = ACTION_COLOR[row.action] ?? "text-gray-500 bg-gray-50 border-gray-200";
        return (
          <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cls}`}>
            {ACTION_LABEL[row.action] ?? row.action}
          </span>
        );
      },
    },
    { key: "entity",  label: "Entity" },
    { key: "branch",  label: "Branch" },
    { key: "message", label: "Message" },
    {
      key: "details",
      label: "",
      render: (row) => {
        const hasDetails = row._raw.beforeState || row._raw.afterState;
        if (!hasDetails) return null;
        const open = expandedId === row.id;
        return (
          <button
            onClick={(e) => { e.stopPropagation(); onExpand(open ? null : row.id); }}
            className="text-orange-500 hover:text-orange-600 text-xs font-medium"
          >
            {open ? "Hide ▲" : "Details ▼"}
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-0">
      <CommonTable<LogRow>
        title="System Logs"
        data={rows}
        columns={columns}
        emptyMessage="No log entries found"
      />

      {/* Expandable detail panel — rendered below the matching row via portal-less approach */}
      {expandedId && (() => {
        const row = rows.find((r) => r.id === expandedId);
        if (!row) return null;
        const log = row._raw;
        return (
          <div className="rounded-b-xl border-x border-b border-gray-100 bg-gray-50 px-6 py-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Audit Detail — {log.entityType} / {log.entityId}
            </p>
            <p className="mb-3 text-[11px] text-gray-400">
              IP: {log.ipAddress} &nbsp;·&nbsp;
              UA: {(log.deviceInfo as { userAgent?: string } | null)?.userAgent?.slice(0, 80) ?? "—"}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {log.beforeState && (
                <div>
                  <p className="mb-1 text-[11px] font-semibold text-gray-500">
                    Before State
                    {log.afterState && (
                      <span className="ml-2 text-red-400 font-normal">(changed lines highlighted)</span>
                    )}
                  </p>
                  <DiffPre
                    obj={log.beforeState}
                    peer={log.afterState ?? null}
                    mode="before"
                  />
                </div>
              )}
              {log.afterState && (
                <div>
                  <p className="mb-1 text-[11px] font-semibold text-gray-500">
                    After State
                    {log.beforeState && (
                      <span className="ml-2 text-green-500 font-normal">(changed lines highlighted)</span>
                    )}
                  </p>
                  <DiffPre
                    obj={log.afterState}
                    peer={log.beforeState ?? null}
                    mode="after"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
