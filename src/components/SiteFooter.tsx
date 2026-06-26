"use client";

import { useEffect, useState } from "react";
import { getFeeds } from "@/lib/api";
import type { FeedInfo } from "@/lib/types";

export function SiteFooter() {
  const [feeds, setFeeds] = useState<FeedInfo[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    getFeeds()
      .then((res) => setFeeds(res.feeds))
      .catch(() => setFeeds([]));
  }, []);

  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-6 text-xs text-slate-400">
        <p>
          経路・時刻情報は各事業者公開データを基にした
          {" "}
          <a
            href="https://api.transit.ls8h.com/api/docs"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-teal-600"
          >
            Transit API
          </a>
          {" "}
          を利用しています。実際の運行とは異なる場合があります。
        </p>
        {feeds.length > 0 && (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setIsExpanded((v) => !v)}
              className="underline hover:text-teal-600"
            >
              {isExpanded ? "データ提供元を閉じる" : `データ提供元一覧 (${feeds.length}件)`}
            </button>
            {isExpanded && (
              <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                {feeds.map((feed) => (
                  <li key={feed.feedId}>
                    {feed.name}
                    {feed.attribution ? `（${feed.attribution}）` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <p className="mt-3">
          <a
            href="https://github.com/Lapius7/transit.lapius7.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 underline hover:text-teal-600"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub でソースコードを見る
          </a>
        </p>
      </div>
    </footer>
  );
}
