'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { ESG_MOCK } from '../../lib/esgMockData';

export default function EmissionsChart({ height = 180 }: { height?: number }) {
  const data = ESG_MOCK.emissions.map((d) => ({
    y: d.y,
    actual: d.a,
    target: d.t,
    gap: d.a !== null ? Math.max(0, d.a - d.t) : null,
  }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--esg-border)" />
          <XAxis
            dataKey="y"
            tick={{ fontFamily: 'var(--esg-mono)', fontSize: 10, fill: 'var(--esg-fg-muted)' }}
            tickLine={false}
            axisLine={{ stroke: 'var(--esg-border)' }}
          />
          <YAxis
            tick={{ fontFamily: 'var(--esg-mono)', fontSize: 10, fill: 'var(--esg-fg-muted)' }}
            tickLine={false}
            axisLine={{ stroke: 'var(--esg-border)' }}
            width={36}
          />
          <Tooltip />
          {/* Target line (dashed green) */}
          <Line
            type="monotone"
            dataKey="target"
            stroke="var(--esg-green-mid)"
            strokeWidth={1.6}
            strokeDasharray="5 4"
            dot={false}
            isAnimationActive={false}
          />
          {/* Actual line + gap area (red) */}
          <Area
            type="monotone"
            dataKey="actual"
            stroke="var(--esg-red)"
            strokeWidth={2.4}
            fill="var(--esg-red)"
            fillOpacity={0.08}
            connectNulls={false}
            isAnimationActive={false}
            dot={{ r: 3, fill: 'var(--esg-red)', stroke: '#fff', strokeWidth: 1.5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
