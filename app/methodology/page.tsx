import { mockCaseLaw, mockOffsetProjects, type OffsetProject } from '../../lib/caseData';
import LegalDisclaimer from '../../components/LegalDisclaimer';

const PROSE_MAX = '72ch';
const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' };
const SANS: React.CSSProperties = { fontFamily: 'var(--font-sans)' };
const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)' };

const SCORE_CARDS = [
  {
    title: 'Anahtar Kelime Analizi — %30',
    body:
      '13 yüksek riskli terim ile 25 sinonim, büyük/küçük harf duyarsız ' +
      'alt dize eşleşmesiyle taranır. Her eşleşen terim skora katkıda bulunur.',
  },
  {
    title: 'Emsal Karar Eşleşmesi — %40',
    body:
      'Tespit edilen terimler, 20 gerçek mahkeme kararının anahtar kelime ' +
      'veritabanıyla karşılaştırılır. Ağırlık, eşleşen davaların ortalama ' +
      'benzerlik eşiğinden elde edilir.',
  },
  {
    title: 'Offset Bütünlüğü — %30',
    body:
      'İddia, adlandırılmış bir offset projesine atıfta bulunuyorsa, söz ' +
      'konusu projenin ek tiklik, kalıcılık ve sızıntı puanları değerlendirmeye dahil edilir.',
  },
];

const RISK_ZONES = [
  { range: '0–29', label: 'Güvenli Beyan', desc: 'Somut ihlal paterni tespit edilmedi', color: 'var(--accent-green)', bg: 'var(--green-light)' },
  { range: '30–69', label: 'Gri Alan', desc: 'Yanıltıcı olabilir, hukuki inceleme önerilir', color: 'var(--amber)', bg: 'var(--amber-light)' },
  { range: '70–100', label: 'Dava Edilebilir', desc: 'Belgelenmiş mahkeme kararlarıyla yüksek uyum', color: 'var(--red)', bg: 'var(--red-light)' },
];

const LIMITATIONS = [
  {
    title: 'Resmi Doğrulama Eksikliği',
    body:
      "Platform, etiketlenmiş test vakalarıyla kesinlik/geri çağırma ölçümü " +
      "yapılmamıştır. Hackathon bağlamında geliştirilmiş olup bağımsız doğrulama sürecindedir.",
  },
  {
    title: 'Anlambilimsel Kör Nokta',
    body:
      "Anahtar kelime tespiti tam alt dize eşleşmesi kullanır. Sinonim veya deyimsel " +
      "ifadeler kullanan bir iddia, ön filtreyi atlayabilir; bu durum OpenAI'nin " +
      "anlambilimsel anlayışıyla kısmen telafi edilmektedir.",
  },
  {
    title: 'Coğrafi Kapsam',
    body:
      "Dava veritabanı AB ve Birleşik Krallık yargı bölgelerini kapsamaktadır. " +
      "Türkiye'ye özgü içtihat hâlâ entegre edilmektedir.",
  },
  {
    title: 'Yapay Zeka Tutarsızlığı',
    body:
      "GPT-4o-mini 0.2 sıcaklığında çalışmaktadır; ancak küçük giriş farklılıkları " +
      "puanlamayı değiştirebilir. Kesin tutarlılık için sonuçlar nitelikli hukuk " +
      "danışmanı tarafından incelenmelidir.",
  },
  {
    title: 'Yasal Tavsiye Değil',
    body:
      "Bu platformun çıktıları tarama amacıyla sunulmaktadır. Hukuki karar vermede kullanılmamalıdır.",
  },
];

const REFERENCES = [
  'Shell Netherlands v. Milieudefensie — District Court of The Hague, Judgment C/09/571932 / HA ZA 19-379 (26 May 2021)',
  'ClientEarth v. Shell — UK High Court, Case No. FL-2023-000011 (2023)',
  'Lufthansa Green Fares — Deutschen Umwelthilfe, German Consumer Authority ruling (2023)',
  'KLM "Fly Responsibly" — Reclame Code Commissie (RCC), Dossier 2022/00670 (2023)',
  'HSBC Holdings plc — UK ASA Ruling, Ref A22-1167573 (Oct 2022)',
  'BP Target Neutral — UK ASA Ruling, Ref A21-1147830 (Jan 2022)',
  'DWS Group — SEC Order, File No. 3-21376 (Sep 2023)',
  'Verra — Kariba REDD+ Project Suspension Statement (Jan 2023)',
  'Guardian/Zeit/SourceMaterial — "Revealed: more than 90% of rainforest carbon offsets by biggest certifier are worthless" (Jan 2023)',
  'Germanwatch — Carbon Offset Assessment Report (2016)',
  'EU Green Claims Directive — Directive 2024/825/EU of the European Parliament (Mar 2024)',
  'Paris Agreement Article 6 — UNFCCC, Decision 3/CMA.3 (Nov 2021)',
];

function statusBadgeStyles(status: OffsetProject['status']) {
  if (status === 'valid') return { bg: 'var(--green-light)', color: 'var(--green-text)', border: 'var(--border-strong)' };
  if (status === 'disputed') return { bg: 'var(--amber-light)', color: 'var(--amber)', border: 'rgba(176,125,42,0.3)' };
  return { bg: 'var(--red-light)', color: 'var(--red)', border: 'rgba(181,61,46,0.3)' };
}

function statusLabel(status: OffsetProject['status']) {
  if (status === 'valid') return 'Geçerli';
  if (status === 'disputed') return 'Tartışmalı';
  return 'Geçersiz';
}

function scoreColor(score: number) {
  if (score >= 70) return 'var(--green-text)';
  if (score >= 40) return 'var(--amber)';
  return 'var(--red)';
}

const sectionH2: React.CSSProperties = {
  ...SERIF,
  color: 'var(--text-primary)',
  fontSize: 'var(--font-size-headline-md)',
  lineHeight: 'var(--line-height-headline-md)',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  marginBottom: '12px',
};

const proseP: React.CSSProperties = {
  ...SANS,
  color: 'var(--text-secondary)',
  fontSize: 'var(--font-size-body-lg)',
  lineHeight: 'var(--line-height-body-lg)',
  maxWidth: PROSE_MAX,
};

const tableTh: React.CSSProperties = {
  ...SANS,
  textAlign: 'left',
  padding: '10px 12px',
  color: 'var(--text-secondary)',
  fontSize: 'var(--font-size-label-lg)',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  borderBottom: '1px solid var(--border)',
  background: 'var(--bg-surface-2)',
};

const tableTd: React.CSSProperties = {
  ...SANS,
  padding: '10px 12px',
  color: 'var(--text-primary)',
  fontSize: 'var(--font-size-body-sm)',
  lineHeight: 'var(--line-height-body-sm)',
  borderBottom: '1px solid var(--border)',
  verticalAlign: 'top',
};

export default function MethodologyPage() {
  return (
    <div style={{ padding: '32px 40px 64px', maxWidth: '1100px', margin: '0 auto' }}>

      {/* Section 1 — Platform Hakkında */}
      <section style={{ marginBottom: '48px' }}>
        <h1
          style={{
            ...SERIF,
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-headline-lg)',
            lineHeight: 'var(--line-height-headline-lg)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: '8px',
          }}
        >
          Metodoloji ve Veri Kaynakları
        </h1>
        <p
          style={{
            ...SANS,
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-size-body-lg)',
            lineHeight: 'var(--line-height-body-lg)',
            marginBottom: '24px',
          }}
        >
          ESG Lens Hukuki Doğrulama Platformu — Sürüm 2.0 · Nisan 2026
        </p>
        <p style={proseP}>
          ESG Lens, çevresel pazarlama iddialarındaki belgelenmiş Avrupa yeşil yıkama
          kararlarına benzer örüntüleri otomatik olarak tespit eden bir hukuki risk
          tarama aracıdır; bir hukuki danışmanlık hizmeti değildir. İddialarda Avrupa
          yargısı tarafından kayıt altına alınmış ihlal paterni varsa bunları işaretler;
          ancak tüm çıktılar herhangi bir uyum kararı verilmeden önce nitelikli hukuk
          müşaviri tarafından incelenmelidir.
        </p>
      </section>

      {/* Section 2 — Risk Skoru Nasıl Hesaplanır */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={sectionH2}>Risk Skoru Hesaplama Yöntemi</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginBottom: '24px' }}>
          {SCORE_CARDS.map((c) => (
            <div
              key={c.title}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3
                style={{
                  ...SANS,
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-size-body-md)',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  marginBottom: '8px',
                }}
              >
                {c.title}
              </h3>
              <p
                style={{
                  ...SANS,
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--font-size-body-sm)',
                  lineHeight: 'var(--line-height-body-sm)',
                }}
              >
                {c.body}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...tableTh, width: '15%' }}>Aralık</th>
                <th style={{ ...tableTh, width: '25%' }}>Etiket</th>
                <th style={tableTh}>Açıklama</th>
              </tr>
            </thead>
            <tbody>
              {RISK_ZONES.map((z) => (
                <tr key={z.range}>
                  <td style={{ ...tableTd, ...MONO, color: z.color, fontWeight: 700 }}>{z.range}</td>
                  <td style={tableTd}>
                    <span
                      style={{
                        ...SANS,
                        background: z.bg,
                        color: z.color,
                        border: `1px solid ${z.color}33`,
                        padding: '3px 10px',
                        borderRadius: '4px',
                        fontSize: 'var(--font-size-label-lg)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {z.label}
                    </span>
                  </td>
                  <td style={{ ...tableTd, color: 'var(--text-secondary)' }}>{z.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3 — Emsal Karar Veritabanı */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={sectionH2}>Emsal Karar Veritabanı ({mockCaseLaw.length} Dava)</h2>
        <p style={{ ...proseP, marginBottom: '20px' }}>
          Tüm davalar birincil hukuki kaynaklardan ve düzenleyici otoritelerin resmi
          kararlarından derlenerek yapılandırılmıştır.
        </p>

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            overflow: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '780px' }}>
            <thead>
              <tr>
                <th style={tableTh}>Dava Kimliği</th>
                <th style={tableTh}>Taraf</th>
                <th style={tableTh}>Yıl</th>
                <th style={tableTh}>Yetki Alanı</th>
                <th style={tableTh}>Sonuç</th>
              </tr>
            </thead>
            <tbody>
              {mockCaseLaw.map((c) => (
                <tr key={c.id}>
                  <td style={{ ...tableTd, ...MONO, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{c.id}</td>
                  <td style={{ ...tableTd, fontWeight: 600 }}>{c.defendant}</td>
                  <td style={{ ...tableTd, ...MONO, color: 'var(--text-secondary)' }}>{c.year}</td>
                  <td style={{ ...tableTd, color: 'var(--text-secondary)' }}>{c.jurisdiction}</td>
                  <td style={{ ...tableTd, color: 'var(--text-secondary)' }}>
                    {c.outcome.length > 80 ? c.outcome.slice(0, 80) + '...' : c.outcome}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4 — Offset Proje Veritabanı */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={sectionH2}>Offset Proje Bütünlük Veritabanı</h2>
        <p style={{ ...proseP, marginBottom: '20px' }}>
          Puanlar akademik literatür, kurumsal denetim raporları ve bağımsız araştırmacı
          bulgularından türetilmiştir.
        </p>

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            overflow: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '780px' }}>
            <thead>
              <tr>
                <th style={tableTh}>Proje</th>
                <th style={tableTh}>Tür</th>
                <th style={tableTh}>Sertifika</th>
                <th style={tableTh}>Genel Puan</th>
                <th style={tableTh}>Durum</th>
              </tr>
            </thead>
            <tbody>
              {mockOffsetProjects.map((p) => {
                const badge = statusBadgeStyles(p.status);
                return (
                  <tr key={p.projectName}>
                    <td style={{ ...tableTd, fontWeight: 600 }}>{p.projectName}</td>
                    <td style={{ ...tableTd, color: 'var(--text-secondary)' }}>{p.projectType}</td>
                    <td style={{ ...tableTd, color: 'var(--text-secondary)' }}>{p.certificationBody}</td>
                    <td style={{ ...tableTd, ...MONO, color: scoreColor(p.overallIntegrityScore), fontWeight: 700 }}>
                      {p.overallIntegrityScore}/100
                    </td>
                    <td style={tableTd}>
                      <span
                        style={{
                          ...SANS,
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                          padding: '3px 10px',
                          borderRadius: '4px',
                          fontSize: 'var(--font-size-label-lg)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {statusLabel(p.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5 — Bilinen Sınırlamalar */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={sectionH2}>Bilinen Sınırlamalar</h2>
        <ol
          style={{
            listStyle: 'decimal',
            paddingLeft: '24px',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {LIMITATIONS.map((l, i) => (
            <li
              key={i}
              style={{
                ...SANS,
                color: 'var(--text-secondary)',
                fontSize: 'var(--font-size-body-lg)',
                lineHeight: 'var(--line-height-body-lg)',
                maxWidth: PROSE_MAX,
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{l.title}</span>
              <br />
              {l.body}
            </li>
          ))}
        </ol>
      </section>

      {/* Section 6 — Veri Kaynakları */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={sectionH2}>Veri Kaynakları ve Referanslar</h2>
        <ul
          style={{
            listStyle: 'disc',
            paddingLeft: '24px',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {REFERENCES.map((r, i) => (
            <li
              key={i}
              style={{
                ...SANS,
                color: 'var(--text-secondary)',
                fontSize: 'var(--font-size-body-md)',
                lineHeight: 'var(--line-height-body-md)',
                maxWidth: PROSE_MAX,
              }}
            >
              {r}
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <LegalDisclaimer variant="inline" />
      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />
      <p
        style={{
          ...SANS,
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: 'var(--font-size-label-lg)',
          lineHeight: 1.6,
        }}
      >
        ESG Lens — Sürdüremeyenler Ekibi · Sabancı Üniversitesi Law-a-thon 2026 · Son güncelleme: Nisan 2026
      </p>
    </div>
  );
}
