'use client';

import { useDataset } from '../../lib/DatasetContext';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  ShieldAlert,
  FileText,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Building2,
  Globe,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { mockCaseLaw } from '../../lib/caseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const RISK_LEVEL_TR: Record<string, string> = {
  LOW: 'Dusuk',
  MEDIUM: 'Orta',
  HIGH: 'Yuksek',
  CRITICAL: 'Kritik',
};

function RiskBadge({ level }: { level: string }) {
  const variant = {
    LOW: 'success',
    MEDIUM: 'warning',
    HIGH: 'danger',
    CRITICAL: 'danger',
  }[level] || 'secondary';

  return (
    <Badge variant={variant as 'success' | 'warning' | 'danger' | 'secondary'}>
      {RISK_LEVEL_TR[level] ?? level}
    </Badge>
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg p-3 bg-popover border border-border text-sm shadow-lg">
      <div className="mb-2 text-muted-foreground">FY {label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold text-foreground">{p.value.toLocaleString()} ktCO2e</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { activeDataset: data } = useDataset();
  const isHighRisk = data.compliance.riskLevel === 'HIGH' || data.compliance.riskLevel === 'CRITICAL';
  const score = data.compliance.overallScore;
  
  const getScoreColor = (s: number) => {
    if (s >= 70) return 'text-emerald-500';
    if (s >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (s: number) => {
    if (s >= 70) return 'bg-emerald-500';
    if (s >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <motion.div 
      className="px-8 py-6 max-w-7xl mx-auto"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Company Context Bar */}
      <motion.div variants={fadeInUp}>
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-lg font-semibold text-foreground">{data.company.name}</span>
                <span className="ml-2 text-sm text-muted-foreground">[{data.company.ticker}]</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 ml-auto">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Globe className="h-3 w-3" /> {data.company.jurisdiction}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" /> {data.company.reportTitle}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" /> FY{data.company.reportYear}
                </div>
                <RiskBadge level={data.compliance.riskLevel} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* KPI Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        variants={staggerContainer}
      >
        {/* Compliance Score Card */}
        <motion.div variants={fadeInUp}>
          <Card className={cn(
            "h-full",
            score < 40 && "border-red-500/30",
            score >= 40 && score < 70 && "border-amber-500/30",
            score >= 70 && "border-emerald-500/30"
          )}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg",
                  score < 40 && "bg-red-500/10 border border-red-500/20",
                  score >= 40 && score < 70 && "bg-amber-500/10 border border-amber-500/20",
                  score >= 70 && "bg-emerald-500/10 border border-emerald-500/20"
                )}>
                  <ShieldAlert className={cn("h-5 w-5", getScoreColor(score))} />
                </div>
                <Badge variant={score >= 70 ? "success" : score >= 40 ? "warning" : "danger"}>
                  Derece {data.compliance.grade}
                </Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={cn("text-5xl font-bold tracking-tight", getScoreColor(score))}>
                  {score}
                </span>
                <span className="text-lg text-muted-foreground">/100</span>
              </div>
              <div className="h-2 rounded-full bg-muted mt-3">
                <div 
                  className={cn("h-full rounded-full transition-all duration-500", getScoreBgColor(score))} 
                  style={{ width: `${score}%` }} 
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">Genel Uyum Skoru</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Documents Card */}
        <motion.div variants={fadeInUp}>
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 mb-4">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tight text-foreground">
                  {data.compliance.activeDocuments}
                </span>
                <span className="text-lg text-muted-foreground">belge</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Analiz Edilen Aktif Belgeler</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Critical Flags Card */}
        <motion.div variants={fadeInUp}>
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg",
                  data.compliance.criticalFlags > 0 
                    ? "bg-red-500/10 border border-red-500/20" 
                    : "bg-emerald-500/10 border border-emerald-500/20"
                )}>
                  <AlertTriangle className={cn(
                    "h-5 w-5",
                    data.compliance.criticalFlags > 0 ? "text-red-500" : "text-emerald-500"
                  )} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  data.compliance.criticalFlags > 0 ? "text-red-500" : "text-emerald-500"
                )}>
                  {data.compliance.criticalFlags > 0 ? (
                    <><TrendingDown className="h-3 w-3" /> Aksiyon Gerekli</>
                  ) : (
                    <><TrendingUp className="h-3 w-3" /> Uyumlu</>
                  )}
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  "text-5xl font-bold tracking-tight",
                  data.compliance.criticalFlags > 0 ? "text-red-500" : "text-emerald-500"
                )}>
                  {data.compliance.criticalFlags}
                </span>
                {data.compliance.criticalFlags > 0 && (
                  <span className="text-lg text-muted-foreground">isaret</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Tespit Edilen Kritik Isaretler</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Emissions Chart */}
      <motion.div variants={fadeInUp}>
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg">
                  Kapsam 1+2 Emisyonlari - Taahhut Edilen Azaltim Hedefine Karsi
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  ktCO2e · 5 yillik tarihsel seri · Baz yil: FY{data.emissions[0].year}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  { color: 'bg-red-500', label: 'Gercek Emisyonlar' },
                  { color: 'bg-emerald-500', label: 'Taahhut Hedefi' },
                  { color: 'bg-muted-foreground', label: '2020 Baz Degeri' },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className={cn("w-5 h-0.5 rounded", l.color)} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isHighRisk && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-lg mb-4 bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  <strong>Sapma Uyarisi:</strong> Gercek emisyonlar yillik %3,5 artis egilimindeyken taahhut edilen hedefler dik bir dusus gerektiriyor. Biriken bu ucurum, CSRD / ESRS E1-4 kapsaminda onemli bir uyum riski olusturmaktadir.
                </p>
              </div>
            )}

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.emissions} margin={{ top: 8, right: 20, bottom: 8, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} 
                  axisLine={{ stroke: 'hsl(var(--border))' }} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(v) => v.toLocaleString()} 
                  label={{ 
                    value: 'ktCO2e', 
                    angle: -90, 
                    position: 'insideLeft', 
                    fill: 'hsl(var(--muted-foreground))', 
                    fontSize: 10, 
                    dx: -8 
                  }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine 
                  y={data.emissions[0].baseline} 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeDasharray="4 4" 
                  strokeWidth={1} 
                  opacity={0.35} 
                />
                <Line 
                  type="monotone" 
                  dataKey="pledgedTarget" 
                  name="Taahhut Hedefi" 
                  stroke="hsl(160 84% 39%)" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: 'hsl(160 84% 39%)', strokeWidth: 0 }} 
                  activeDot={{ r: 5, strokeWidth: 0 }} 
                  strokeOpacity={0.8} 
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="Gercek Emisyonlar" 
                  stroke="hsl(0 84% 60%)" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: 'hsl(0 84% 60%)', strokeWidth: 0 }} 
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Case Law */}
      <motion.div variants={fadeInUp} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Son Emsal Kararlar</h3>
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href="/analysis">
              Iddia analizi yap <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {mockCaseLaw.slice(0, 3).map((c) => (
            <Card 
              key={c.id} 
              className="shrink-0 w-[300px] border-t-2 border-t-red-500"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs text-muted-foreground">
                    {c.jurisdiction} · {c.year}
                  </span>
                  <Badge variant="danger">%{c.similarityThreshold}</Badge>
                </div>
                <h4 className="font-semibold text-foreground mb-2 leading-tight">
                  {c.caseName}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {c.violationReason.slice(0, 110)}{c.violationReason.length > 110 ? '...' : ''}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Critical Flags */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">En Kritik Uyum Isaretleri - Acil Inceleme Gerekli</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.exportFlags.slice(0, 4).map((flag) => {
              const severityTr: Record<string, string> = { CRITICAL: 'Kritik', HIGH: 'Yuksek', MEDIUM: 'Orta', LOW: 'Dusuk' };
              const severityColor: Record<string, string> = { 
                CRITICAL: 'text-red-500', 
                HIGH: 'text-orange-500', 
                MEDIUM: 'text-amber-500', 
                LOW: 'text-muted-foreground' 
              };
              return (
                <div 
                  key={flag.id} 
                  className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-muted/50 border border-border"
                >
                  <span className={cn(
                    "text-xs font-semibold min-w-[56px] mt-0.5",
                    severityColor[flag.severity] || 'text-muted-foreground'
                  )}>
                    {severityTr[flag.severity] ?? flag.severity}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground mb-0.5">
                      {flag.id} · {flag.regulation}
                    </div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      {flag.description}
                    </div>
                  </div>
                </div>
              );
            })}
            <Button variant="ghost" size="sm" asChild className="gap-1 mt-2">
              <Link href="/analysis">
                Detayli analiz yap <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
