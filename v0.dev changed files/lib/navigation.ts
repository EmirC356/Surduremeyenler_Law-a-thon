export type NavItem = {
  label: string;
  route: string;
  icon: string;
  sublabel: string;
  enabled: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Panel',
    route: '/dashboard',
    icon: 'LayoutDashboard',
    sublabel: 'Genel Bakış',
    enabled: true,
  },
  {
    label: 'Belge Analizi',
    route: '/analysis',
    icon: 'FileSearch',
    sublabel: 'PDF Yükle & Analiz Et',
    enabled: true,
  },
  {
    label: 'Offset Bütünlüğü',
    route: '/offset',
    icon: 'Target',
    sublabel: 'Proje Geçerlilik Analizi',
    enabled: true,
  },
  {
    label: 'Fiyatlandırma',
    route: '/pricing',
    icon: 'CreditCard',
    sublabel: 'Plan & Erişim',
    enabled: true,
  },
];
