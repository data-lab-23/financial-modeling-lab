"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: Record<string, never>[];
  }
}

export function AdSenseInitializer() {
  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // 広告ブロッカーや配信前の状態では、本文表示を優先する。
    }
  }, []);

  return null;
}
