'use client';

import { useReportWebVitals } from 'next/web-vitals';

export default function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== 'development') return;
    if (['FCP', 'LCP', 'TTFB', 'CLS', 'INP'].includes(metric.name)) {
      console.log(`[Web Vitals] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        id: metric.id
      });
    }
  });

  return null;
}
