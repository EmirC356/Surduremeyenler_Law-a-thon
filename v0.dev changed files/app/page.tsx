'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Scale,
  Shield,
  FileSearch,
  Target,
  Check,
  ArrowRight,
  Zap,
  Globe,
  ShieldCheck,
  TrendingUp,
  Building2,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const TIERS = [
  {
    id: 'starter',
    name: 'Compliance Starter',
    subtitle: 'KOBi & Kucuk Hukuk Burolari',
    monthlyPrice: 99,
    popular: false,
    cta: 'Hemen Basla',
    features: [
      '2 Tam Belge Analizi / ay',
      'Temel TR & AB Mevzuat Eslestirici',
      'Standart PDF Disa Aktarma',
      'E-posta Destegi',
      'Dava Riski Skoru (0-100)',
      'AB Yesil Iddia Direktifi Temel Kontrol',
    ],
  },
  {
    id: 'pro',
    name: 'ESG Professional',
    subtitle: 'Buyuk Sirketler & ESG Danismanlari',
    monthlyPrice: 499,
    popular: true,
    cta: 'Ucretsiz Dene',
    features: [
      '20 Tam Belge Analizi / ay',
      'Derin Karbon Offset Butunluk Analizi',
      'Ek Katki & Kalicilik Derinlemesine Inceleme',
      'Dava Riski Esigi Uyarilari',
      'Paris Anlasmasi Madde 6 Tarama',
      'Oncelikli Insan Destegi',
      'Tum Emsal Kararlar Veritabani (8 dava)',
      'Ozel PDF + Sirket Logosu',
    ],
  },
  {
    id: 'enterprise',
    name: 'Global Enterprise',
    subtitle: 'Holding Gruplari & Denetim Firmalari',
    monthlyPrice: null,
    popular: false,
    cta: 'Satis Ekibiyle Iletisim',
    features: [
      'Sinirsiz Analiz',
      'Otomatik Uyumluluk icin API Erisimi',
      'Ozel Risk Kiyaslamalari',
      'Ozel ESG Hukuk Danismani',
      'ERP / SAP Entegrasyonu',
      'SLA ile 7/24 Destek',
      'CSRD, SFDR & SPK Denetim Raporlari',
      'Coklu Kullanici & Takim Yonetimi',
    ],
  },
] as const;

const ROI_STATS = [
  {
    Icon: Shield,
    title: 'Hukuki Koruma',
    value: '€30M+',
    desc: 'VW, Shell ve Lufthansa davalarinda toplam yaptirim tutari. Erken tespit bu riski minimize eder.',
  },
  {
    Icon: Zap,
    title: 'Maliyet Verimliligi',
    value: '%95',
    desc: 'Manuel denetim saatlerine kiyasla daha ucuz. Ortalama ESG denetimi €15.000+ iken bizde $499/ay.',
  },
  {
    Icon: Globe,
    title: 'Denetim Hazirligi',
    value: '2024/825',
    desc: 'AB Yesil Iddia Direktifi ile aninda uyumluluk. CSRD ve SFDR yukumluluklerini otomatik takip.',
  },
  {
    Icon: ShieldCheck,
    title: 'Pazarlama Guvencesi',
    value: '%100',
    desc: 'AB Yesil Iddia Direktifi uyarinca reklam durdurma riskini onler. Kampanya surekliligi saglar.',
  },
];

const FEATURES = [
  {
    Icon: FileSearch,
    title: 'Yapay Zeka Destekli Belge Analizi',
    desc: 'Surdurulebilirlik raporlarini yukleyin; cevresel iddialari otomatik olarak tarayin ve uyum riskini puanlayin.',
  },
  {
    Icon: Target,
    title: 'Offset Butunlugu Analizi',
    desc: 'Karbon offset projelerini Kariba, Rimba Raya ve REDD+ standartlari ile karsilastirin. Gecersiz projeleri tespit edin.',
  },
  {
    Icon: Building2,
    title: 'Emsal Karar Eslestirme',
    desc: '8 emsal mahkeme karari veritabanina gore sirket iddialarini karsilastirin. AB ve TR mevzuati kapsaminda.',
  },
];

export default function HomePage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold tracking-tight text-foreground">Lawathon</span>
              <span className="hidden sm:inline text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Legal Intelligence
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Paneli Ac</span>
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/analysis" className="gap-2">
                Analizi Baslat
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,hsl(var(--primary)/0.12),transparent)]" />
        <motion.div 
          className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="secondary" className="mb-6 gap-2 px-4 py-1.5">
              <TrendingUp className="h-3 w-3" />
              AB Yesil Iddia Direktifi 2024/825 Uyumlu
            </Badge>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance mb-6"
            variants={fadeInUp}
          >
            ESG Iddialarinizi{' '}
            <span className="text-gradient">Hukuki Riske</span>{' '}
            Karsi Koruyun
          </motion.h1>

          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty"
            variants={fadeInUp}
          >
            Surdurulebilirlik iddialarinizi yapay zeka ile tarayin, 8 emsal mahkeme kararina gore eslestirin ve uyum riskini olcun.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={fadeInUp}
          >
            <Button size="lg" asChild className="gap-2 w-full sm:w-auto">
              <Link href="/analysis">
                <Zap className="h-4 w-4" />
                Belge Analizi Baslat
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 w-full sm:w-auto">
              <Link href="/dashboard">
                Uyum Panelini Gor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mt-16"
            variants={fadeInUp}
          >
            {[
              { value: '8', label: 'Emsal Mahkeme Karari' },
              { value: '95%', label: 'Daha Dusuk Maliyet' },
              { value: '€30M+', label: 'Korunan Risk' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {FEATURES.map((feature) => {
              const FIcon = feature.Icon;
              return (
                <motion.div key={feature.title} variants={fadeInUp}>
                  <Card className="h-full hover-lift">
                    <CardContent className="p-6">
                      <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                        <FIcon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
              Fiyatlandirma
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              KOBi&apos;lerden kuresel holding gruplarina kadar her olcekte olceklenebilir cozumler.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className={cn(
                "text-sm font-medium transition-colors",
                !annual ? "text-foreground" : "text-muted-foreground"
              )}>
                Aylik
              </span>
              <button
                onClick={() => setAnnual(v => !v)}
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors",
                  annual ? "bg-primary" : "bg-muted"
                )}
                aria-label="Toggle annual billing"
              >
                <span className={cn(
                  "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform",
                  annual && "translate-x-5"
                )} />
              </button>
              <span className={cn(
                "text-sm font-medium transition-colors",
                annual ? "text-foreground" : "text-muted-foreground"
              )}>
                Yillik
              </span>
              {annual && (
                <Badge variant="success" className="ml-2">%20 Tasarruf</Badge>
              )}
            </div>
          </div>

          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {TIERS.map((tier) => {
              const price = tier.monthlyPrice ? Math.round(tier.monthlyPrice * (annual ? 0.8 : 1)) : null;
              return (
                <motion.div key={tier.id} variants={fadeInUp}>
                  <Card className={cn(
                    "relative h-full",
                    tier.popular && "border-primary shadow-lg shadow-primary/10"
                  )}>
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground shadow-sm">
                          En Populer
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-6 pt-8">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                        {tier.id === 'starter' && <FileSearch className="h-5 w-5 text-muted-foreground" />}
                        {tier.id === 'pro' && <Zap className="h-5 w-5 text-primary" />}
                        {tier.id === 'enterprise' && <Building2 className="h-5 w-5 text-muted-foreground" />}
                      </div>
                      
                      <h3 className="text-xl font-semibold tracking-tight text-foreground">{tier.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-6">{tier.subtitle}</p>

                      <div className="mb-6 pb-6 border-b border-border">
                        {price !== null ? (
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold tracking-tight text-foreground">${price}</span>
                            <span className="text-muted-foreground">/ay</span>
                          </div>
                        ) : (
                          <div className="text-2xl font-semibold text-primary">Ozel Fiyat</div>
                        )}
                        {annual && price && (
                          <p className="text-sm text-primary mt-1">
                            Kullanim hacminize gore teklif
                          </p>
                        )}
                      </div>

                      <ul className="space-y-3 mb-6">
                        {tier.features.map((feature, fi) => (
                          <li key={fi} className="flex items-start gap-3 text-sm">
                            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button 
                        className="w-full" 
                        variant={tier.popular ? "default" : "outline"}
                      >
                        {tier.cta}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Detayli fiyatlandirma ve SaaS is modeli icin{' '}
            <Link href="/pricing" className="text-primary hover:underline font-medium">
              Tum planlari incele
            </Link>
          </p>
        </div>
      </section>

      {/* ROI Stats Section */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
              Neden Lawathon?
            </h2>
            <p className="text-muted-foreground">
              AB mahkeme kararlari ve piyasa verileriyle desteklenen somut getiri.
            </p>
          </div>

          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {ROI_STATS.map((item) => {
              const StatIcon = item.Icon;
              return (
                <motion.div key={item.title} variants={fadeInUp}>
                  <Card className="h-full hover-lift">
                    <CardContent className="p-6">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                        <StatIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-3xl font-bold tracking-tight text-primary mb-1">
                        {item.value}
                      </div>
                      <div className="text-base font-semibold text-foreground mb-2">
                        {item.title}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary-foreground)/0.1),transparent)]" />
              <div className="relative">
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  Bugun Uyum Analizine Baslayin
                </h2>
                <p className="text-primary-foreground/80 max-w-md mx-auto mb-8">
                  Ilk analiz 90 saniye icinde tamamlanir. Kredi karti gerekmez.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" variant="secondary" asChild className="gap-2 w-full sm:w-auto">
                    <Link href="/analysis">
                      <Zap className="h-4 w-4" />
                      Analizi Baslat
                    </Link>
                  </Button>
                  <Button size="lg" variant="ghost" asChild className="gap-2 w-full sm:w-auto text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10">
                    <Link href="/dashboard">
                      Paneli Incele
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Uyumlu Mevzuat: AB Yesil Iddia Direktifi 2024/825 · CSRD (2023/2849) · Paris Anlasmasi Madde 6.2 & 6.4 · SFDR · SPK Surdurulebilirlik Ilkeleri
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            © 2024 Lawathon · Bu platform hukuki tavsiye vermez; yalnizca uyum degerlendirmesi sunar.
          </p>
        </div>
      </footer>
    </div>
  );
}
