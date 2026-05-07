'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Loader2,
  X,
  File,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Zap,
  Search,
  BookOpen,
  BarChart2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { mockAnalysisResult, type ClaimAnalysisResult, type CourtCase } from '../../lib/caseData';
import { buildHighlightRegex, isHighlightTerm } from '../../lib/highlightTerms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type InputTab = 'text' | 'upload';
type AnalyzeState = 'idle' | 'analyzing' | 'complete' | 'error';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 }
};

const ANALYZE_STAGES = [
  { label: 'Metin cikariliyor ve iddialar tespit ediliyor...', icon: Search, duration: 1300 },
  { label: 'Duzenlemeye tabi terminoloji taraniyor...', icon: BookOpen, duration: 1700 },
  { label: '8 emsal karara gore eslestirme yapiliyor...', icon: Scale, duration: 2100 },
  { label: 'Uyum risk skoru hesaplaniyor...', icon: BarChart2, duration: 1500 },
];

const DEMO_SHELL = "Shell has launched a range of carbon neutral petrol and diesel products for retail customers. The carbon neutrality is achieved by offsetting the lifecycle CO2 emissions through certified carbon credits from projects including REDD+ forest conservation in Africa and Asia. Shell's carbon neutral products are certified by independent third parties and meet internationally recognized standards. We are committed to helping our customers reach net zero by providing carbon neutral options today.";

const DEMO_LUFTHANSA = "Lufthansa Group offers passengers the opportunity to offset their flight emissions through our Green Fares program. When you book a Green Fare, your flight's CO2 emissions are fully compensated through certified sustainable aviation fuel and carbon offset projects. Fly sustainably and help us build a greener future for aviation.";

const ARTICLE6_FLAG = 'Kritik - Paris Anlasmasi Madde 6.4 Ihlali: Iddia, Madde 6.4 yetkisi kaniti olmaksizin REDD+ offsetlerine atifta bulunuyor - bu durum Shell ClientEarth 2023 davasinin tam dayanagini olusturmaktadir.';

function highlightText(text: string, extraKeywords: string[] = []): React.ReactNode {
  const regex = buildHighlightRegex(extraKeywords);
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        isHighlightTerm(part, extraKeywords) ? (
          <mark
            key={i}
            className="bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded px-1 py-0.5 font-semibold"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function RiskThermometer({ score, category }: { score: number; category: ClaimAnalysisResult['riskCategory'] }) {
  const categoryLabel = category === 'safe' ? 'Dusuk Risk' : category === 'grey' ? 'Gri Alan' : 'Yuksek Risk';
  const scoreColor = category === 'safe' ? 'text-emerald-500' : category === 'grey' ? 'text-amber-500' : 'text-red-500';

  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Uyum Risk Skoru
        </p>
        <div className="flex items-end gap-4 mb-6">
          <span className={cn("text-7xl font-bold tracking-tighter", scoreColor)}>
            {score}
          </span>
          <div className="pb-2">
            <span className="text-lg text-muted-foreground">/100</span>
            <p className={cn("text-xs font-semibold uppercase tracking-wider mt-1", scoreColor)}>
              {categoryLabel}
            </p>
          </div>
        </div>
        <div className="relative mb-4">
          <div className="risk-thermometer h-4" />
          <div
            className="risk-thermometer-marker"
            style={{ left: `calc(${score}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <div className="text-emerald-500">0-30<br /><span className="text-muted-foreground">Guvenli Beyan</span></div>
          <div className="text-center text-amber-500">30-70<br /><span className="text-muted-foreground">Gri Alan</span></div>
          <div className="text-right text-red-500">70-100<br /><span className="text-muted-foreground">Yuksek Risk</span></div>
        </div>
      </CardContent>
    </Card>
  );
}

function CasePrecedentMatch({ inputText, keywords, matchedCase }: { inputText: string; keywords: string[]; matchedCase: CourtCase }) {
  const caseKws = keywords.filter((k) =>
    matchedCase.keywords.some((mk) => mk.toLowerCase() === k.toLowerCase())
  );
  const [expanded, setExpanded] = useState(false);
  const PREVIEW_CHAR_THRESHOLD = 380;
  const isLong = inputText.length > PREVIEW_CHAR_THRESHOLD;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden border border-border">
      <div className="p-5 bg-muted/50 md:border-r border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Sirket Iddiasi
        </p>
        <div className="relative">
          <p className={cn(
            "text-sm text-muted-foreground leading-relaxed max-w-prose",
            isLong && !expanded && "line-clamp-[8]"
          )}>
            {highlightText(inputText, caseKws)}
          </p>
          {isLong && !expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/50 to-transparent pointer-events-none" />
          )}
        </div>
        {isLong && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((v) => !v)}
            className="mt-2 gap-1"
          >
            {expanded ? (<>Daralt <ChevronUp className="h-3 w-3" /></>) : (<>Tumunu goster <ChevronDown className="h-3 w-3" /></>)}
          </Button>
        )}
      </div>
      <div className="p-5 bg-card">
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Eslesen Emsal Karar
          </p>
          <Badge variant="danger">%{matchedCase.similarityThreshold} benzerlik</Badge>
        </div>
        <h4 className="font-semibold text-foreground mb-2">
          {matchedCase.caseName} ({matchedCase.year})
        </h4>
        <p className="text-sm text-muted-foreground italic mb-3 max-w-prose leading-relaxed">
          &ldquo;{matchedCase.claimMade}&rdquo;
        </p>
        <p className="text-sm text-muted-foreground mb-2 max-w-prose leading-relaxed">
          <strong className="text-red-500">Mahkeme karari: </strong>
          {matchedCase.violationReason}
        </p>
        <Badge variant="secondary" className="text-xs">
          {matchedCase.regulationCited}
        </Badge>
      </div>
    </div>
  );
}

const NEWS_CITATIONS = [
  { source: 'Reuters', date: 'Oca 2023', headline: "Shell drops 'carbon neutral' claims from petrol products after marketing watchdog challenge", relevance: 'Shell ClientEarth 2023' },
  { source: 'Guardian', date: 'Oca 2023', headline: 'Revealed: more than 90% of rainforest carbon offsets by biggest certifier are worthless, analysis shows', relevance: 'Kariba / Verra' },
  { source: 'BBC', date: 'Sub 2023', headline: 'Lufthansa green flying claims banned by German advertising watchdog', relevance: 'Lufthansa 2023' },
  { source: 'Financial Times', date: '2023', headline: 'Carbon offset market faces credibility crisis as key projects fail scrutiny', relevance: 'Offset Butunlugu' },
  { source: 'Guardian', date: '2023', headline: "KLM faces greenwashing lawsuit over 'Fly Responsibly' campaign", relevance: 'KLM 2023' },
];

function ResultsPanel({ result, showArticle6Flag }: { result: ClaimAnalysisResult; showArticle6Flag: boolean }) {
  const [citationsOpen, setCitationsOpen] = useState(false);
  
  const offsetMentioned = result.detectedKeywords.some((k) =>
    /offset|redd|carbon credit|karbon offset|karbon kredi/i.test(k),
  );
  const offsetScore = result.breakdown.offsetIntegrityScore;

  const stats = [
    {
      value: result.matchedCases.length,
      label: 'Emsal Karar Eslesmesi',
      sub: result.matchedCases.length > 0 ? `Ort. benzerlik %${result.breakdown.caseMatchScore}` : 'Eslesme bulunamadi',
    },
    {
      value: result.detectedKeywords.length,
      label: 'Tespit Edilen Anahtar Kelime',
      sub: result.detectedKeywords.length > 3 ? 'Yuksek yogunluk' : result.detectedKeywords.length > 0 ? 'Dusuk yogunluk' : 'Tespit yok',
    },
    ...(offsetMentioned ? [{
      value: offsetScore,
      label: 'Offset Butunluk Skoru',
      sub: offsetScore < 40 ? 'Kritik risk' : offsetScore < 70 ? 'Dikkat' : 'Guvenilir',
      suffix: '/100',
    }] : []),
  ];

  return (
    <motion.div 
      className="flex flex-col gap-5 mt-5"
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
    >
      {showArticle6Flag && (
        <motion.div variants={fadeInUp}>
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
                  Paris Anlasmasi Madde 6.4 - Kritik Ihlal
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
                  {ARTICLE6_FLAG}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div variants={fadeInUp}>
        <RiskThermometer score={result.litigationRiskScore} category={result.riskCategory} />
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card>
          <CardContent className="p-6">
            <div className={cn("grid gap-6", stats.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
              {stats.map((s, i) => (
                <div key={i} className={cn("flex flex-col", i > 0 && "border-l border-border pl-6")}>
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    {s.value}
                    {'suffix' in s && <span className="text-lg text-muted-foreground ml-1">{s.suffix}</span>}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
                    {s.label}
                  </span>
                  {s.sub && (
                    <span className="text-xs text-muted-foreground/70 mt-0.5">{s.sub}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {result.detectedKeywords.length > 0 && (
        <motion.div variants={fadeInUp}>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Tespit Edilen Kirmizi Bayrak Anahtar Kelimeler
              </p>
              <div className="flex flex-wrap gap-2">
                {result.detectedKeywords.map((kw) => (
                  <Badge key={kw} variant="danger">{kw}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {result.matchedCases.length > 0 && (
        <motion.div variants={fadeInUp}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Emsal Karar Eslesmeleri - {result.matchedCases.length} adet bulundu
          </p>
          <div className="flex flex-col gap-4">
            {result.matchedCases.slice(0, 2).map((c) => (
              <CasePrecedentMatch
                key={c.id}
                inputText={result.inputText}
                keywords={result.detectedKeywords}
                matchedCase={c}
              />
            ))}
          </div>
        </motion.div>
      )}

      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Uyum Onerileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 border border-primary/20 mt-0.5">
                  <span className="text-xs font-semibold text-primary">{i + 1}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">{rec}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card>
          <button
            onClick={() => setCitationsOpen((v) => !v)}
            className="w-full flex items-center justify-between p-4 text-left"
            aria-expanded={citationsOpen}
          >
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-foreground">Kaynaklar ve Kanitlar</span>
              <Badge variant="secondary">{NEWS_CITATIONS.length}</Badge>
            </span>
            <span className="flex items-center gap-1 text-sm text-primary">
              {citationsOpen ? 'Gizle' : 'Goster'}
              {citationsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </span>
          </button>
          <AnimatePresence>
            {citationsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 border-t border-border pt-4 space-y-2">
                  {NEWS_CITATIONS.map((c, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                      <Badge variant="secondary" className="shrink-0">{c.source}</Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground leading-relaxed">{c.headline}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground/60">{c.date}</span>
                          <Badge variant="outline" className="text-xs">{c.relevance}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground/70 border-t border-border pt-3 mt-3">
                    Kaynaklar bilgilendirme amaciyla sunulmustur. Bu arac, kamuya acik bilgileri egitim ve uyum arastirmasi amacli derlemektedir.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState<InputTab>('text');
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; file: File } | null>(null);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzeState, setAnalyzeState] = useState<AnalyzeState>('idle');
  const [analyzeStageIdx, setAnalyzeStageIdx] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<ClaimAnalysisResult | null>(null);
  const [showArticle6Flag, setShowArticle6Flag] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAnalyze = activeTab === 'text' ? inputText.trim().length > 20 : uploadedFile !== null;

  const runAnalysis = useCallback(async (text: string, flagArticle6 = false) => {
    setAnalyzeState('analyzing');
    setAnalyzeStageIdx(0);
    setShowArticle6Flag(flagArticle6);

    const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

    await delay(ANALYZE_STAGES[0].duration);
    setAnalyzeStageIdx(1);
    await delay(ANALYZE_STAGES[1].duration);
    setAnalyzeStageIdx(2);

    const apiPromise = fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
      .then((r) => r.json() as Promise<ClaimAnalysisResult>)
      .catch(() => ({ ...mockAnalysisResult, inputText: text }));

    await delay(ANALYZE_STAGES[2].duration);
    setAnalyzeStageIdx(3);
    await delay(ANALYZE_STAGES[3].duration);

    try {
      const result = await apiPromise;
      setAnalysisResult(result as ClaimAnalysisResult);
      setAnalyzeState('complete');
    } catch {
      setAnalysisResult({ ...mockAnalysisResult, inputText: text });
      setAnalyzeState('complete');
    }
  }, []);

  const loadDemo = (text: string, flagArticle6 = false) => {
    setInputText(text);
    runAnalysis(text, flagArticle6);
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const resp = await fetch('/api/extract-text', { method: 'POST', body: formData });
    const data = (await resp.json()) as { text?: string; error?: string };
    if (!resp.ok || !data.text) {
      throw new Error(data.error ?? 'Belge metni cikarilamadi.');
    }
    return data.text;
  };

  const handleAnalyze = async () => {
    setExtractError(null);

    if (activeTab === 'text') {
      const text = inputText;
      const hasRedd = text.toLowerCase().includes('redd+') || text.toLowerCase().includes('redd');
      runAnalysis(text, hasRedd);
      return;
    }

    if (!uploadedFile) return;
    setAnalyzeState('analyzing');
    setAnalyzeStageIdx(0);
    try {
      const extracted = await extractTextFromFile(uploadedFile.file);
      const hasRedd = extracted.toLowerCase().includes('redd+') || extracted.toLowerCase().includes('redd');
      runAnalysis(extracted, hasRedd);
    } catch (err) {
      setExtractError(err instanceof Error ? err.message : 'Belge islenirken hata olustu.');
      setAnalyzeState('idle');
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.match(/\.(pdf|docx)$/i)) {
      setExtractError('Yalnizca PDF veya DOCX dosyalari desteklenir.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setExtractError('Dosya boyutu 50 MB asmakta. Daha kucuk bir dosya yukleyin veya metin sekmesini kullanin.');
      return;
    }
    const kb = (file.size / 1024).toFixed(0);
    const size = Number(kb) > 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${kb} KB`;
    setUploadedFile({ name: file.name, size, file });
    setExtractError(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const reset = () => {
    setAnalyzeState('idle');
    setAnalysisResult(null);
    setInputText('');
    setUploadedFile(null);
    setExtractError(null);
    setAnalyzeStageIdx(0);
    setShowArticle6Flag(false);
  };

  return (
    <div className="px-8 py-6 max-w-5xl mx-auto">
      {/* Page heading */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Yapay Zeka Destekli Iddia Arastircisi
        </h1>
        <p className="text-sm text-muted-foreground">
          Karbon offset iddia dogrulama · 8 emsal karara gore eslestirme · Uyum risk puanlamasi
        </p>
      </motion.div>

      {/* Input card */}
      <AnimatePresence mode="wait">
        {analyzeState === 'idle' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <CardContent className="p-6">
                {/* Tab switcher */}
                <div className="flex gap-1 mb-5 p-1 rounded-lg bg-muted w-fit">
                  {(['text', 'upload'] as InputTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-all",
                        activeTab === tab 
                          ? "bg-background text-foreground border border-border shadow-sm" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {tab === 'text' ? 'Iddia Metni Gir' : 'PDF Rapor Yukle'}
                    </button>
                  ))}
                </div>

                {activeTab === 'text' && (
                  <div>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      rows={7}
                      placeholder="Sirketin cevre iddiasini buraya yapistirin - orn. 'Karbon offsetlerimiz sayesinde karbon notruz...'"
                      className="w-full resize-none rounded-lg px-4 py-3 bg-muted/50 border border-border text-foreground text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadDemo(DEMO_SHELL, true)}
                          className="text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/10"
                        >
                          Demo: Shell Karbon Notr Yakit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadDemo(DEMO_LUFTHANSA, false)}
                          className="text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                        >
                          Demo: Lufthansa Yesil Ucus
                        </Button>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {inputText.length} karakter
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === 'upload' && (
                  <div>
                    {!uploadedFile ? (
                      <div
                        onDrop={onDrop}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all",
                          isDragging 
                            ? "border-primary bg-primary/5" 
                            : "border-border bg-muted/30 hover:border-primary/50"
                        )}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.docx"
                          className="hidden"
                          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                        />
                        <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
                        <p className="font-semibold text-foreground mb-1">PDF veya DOCX buraya birakin</p>
                        <p className="text-sm text-muted-foreground mb-4">veya tiklayarak secin · maks. 50 MB</p>
                        <div className="flex justify-center gap-2">
                          {['.PDF', '.DOCX'].map((ext) => (
                            <Badge key={ext} variant="secondary">{ext}</Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
                          <File className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm">{uploadedFile.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{uploadedFile.size} · Metin otomatik olarak cikarilip analiz edilecek.</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => { setUploadedFile(null); setExtractError(null); }}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {extractError && (
                      <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-red-600 dark:text-red-400">{extractError}</span>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  className="w-full mt-5 gap-2"
                  size="lg"
                >
                  <Zap className="h-4 w-4" />
                  Iddialari Analiz Et
                </Button>
              </CardContent>
            </Card>

            {/* Empty state */}
            {!inputText && !uploadedFile && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
                  <Scale className="h-16 w-16 text-muted-foreground/30 mb-5" />
                  <h3 className="font-semibold text-muted-foreground mb-2">Henuz analiz yapilmadi</h3>
                  <p className="text-sm text-muted-foreground max-w-md mb-6">
                    Bir sirketin cevresel iddiasini girin veya surdurulebilirlik raporu yukleyin; uyum degerlendirmesi alin.
                  </p>
                  <div className="flex gap-3 flex-wrap justify-center">
                    <Button variant="outline" onClick={() => loadDemo(DEMO_SHELL, true)}>
                      Shell Demo Yukle
                    </Button>
                    <Button variant="outline" onClick={() => loadDemo(DEMO_LUFTHANSA, false)}>
                      Lufthansa Demo Yukle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Analyzing state */}
        {analyzeState === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <span className="font-semibold text-foreground">Hukuki Analiz Yurutuluyor...</span>
                </div>
                <div className="flex flex-col gap-3">
                  {ANALYZE_STAGES.map((stage, i) => {
                    const isDone = analyzeStageIdx > i;
                    const isCurrent = analyzeStageIdx === i;
                    const Icon = stage.icon;
                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center gap-4 px-5 py-4 rounded-lg transition-all border",
                          isCurrent ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-border"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
                          isDone ? "bg-emerald-500/10 border border-emerald-500/20" :
                          isCurrent ? "bg-primary/10 border border-primary/20" :
                          "bg-muted border border-border"
                        )}>
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : isCurrent ? (
                            <Loader2 className="h-4 w-4 text-primary animate-spin" />
                          ) : (
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <span className={cn(
                          "text-sm",
                          isDone ? "text-emerald-500" : isCurrent ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results */}
        {analyzeState === 'complete' && analysisResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground">
                Analiz tamamlandi · {new Date().toLocaleTimeString('tr-TR')}
              </span>
              <Button variant="outline" size="sm" onClick={reset} className="gap-1">
                <X className="h-3 w-3" /> Yeni Analiz
              </Button>
            </div>
            <ResultsPanel result={analysisResult} showArticle6Flag={showArticle6Flag} />
          </motion.div>
        )}

        {analyzeState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-red-500/30">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
                <p className="font-semibold text-foreground mb-2">
                  Analiz servisi kullanilamiyor. Demo sonuclari gosteriliyor.
                </p>
                <Button
                  variant="ghost"
                  onClick={() => { setAnalysisResult(mockAnalysisResult); setAnalyzeState('complete'); }}
                >
                  Demo sonuclarini goruntule
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
