export type NavItem = {
  label: string;
  route: string;
  icon: string;
  sublabel: string;
  enabled: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    route: '/',
    icon: 'LayoutDashboard',
    sublabel: 'Overview & KPIs',
    enabled: true,
  },
  {
    label: 'Document Analysis',
    route: '/analysis',
    icon: 'FileSearch',
    sublabel: 'Upload & Parse',
    enabled: true,
  },
  {
    label: 'Greenlighting Risk',
    route: '/greenlighting',
    icon: 'BarChart2',
    sublabel: 'Selective Disclosure',
    enabled: true,
  },
  {
    label: 'Greenrinsing Risk',
    route: '/greenrinsing',
    icon: 'TrendingDown',
    sublabel: 'Unsubstantiated Pledges',
    enabled: true,
  },
  {
    label: 'Compliance Checker',
    route: '/compliance',
    icon: 'ClipboardCheck',
    sublabel: 'Reporting Obligations',
    enabled: true,
  },
  {
    label: 'Offset Integrity',
    route: '/offset',
    icon: 'Target',
    sublabel: 'Project Validity Analysis',
    enabled: true,
  },
  {
    label: 'Legal Export',
    route: '/export',
    icon: 'Download',
    sublabel: 'Audit Report & CSV',
    enabled: true,
  },
];
