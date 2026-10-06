"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent, type AnalyticsProps } from "@/lib/analytics";

export default function TrackView({ event, props }: { event: AnalyticsEvent; props: AnalyticsProps }) {
  const key = JSON.stringify(props);
  useEffect(() => {
    track(event, JSON.parse(key));
  }, [event, key]);
  return null;
}
