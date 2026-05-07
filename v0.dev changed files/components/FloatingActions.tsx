'use client';

import { Bell, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { CommandMenu } from '@/components/CommandMenu';

export default function FloatingActions() {
  return (
    <div className="no-print fixed top-4 right-6 z-50 flex items-center gap-2">
      {/* Command Menu Search */}
      <CommandMenu />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Notifications */}
      <Button
        variant="ghost"
        size="icon"
        className="relative h-8 w-8"
        aria-label="Bildirimler"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
      </Button>

      {/* Settings */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        aria-label="Ayarlar"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {/* User Avatar */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        aria-label="Kullanici profili"
      >
        <span className="text-sm font-semibold">A</span>
      </Button>
    </div>
  );
}
