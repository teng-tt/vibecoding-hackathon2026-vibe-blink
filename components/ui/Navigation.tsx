/**
 * 导航栏组件
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18nContext";
import { ROUTES } from "@/utils/constants";

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

interface NavigationProps {
  items?: NavItem[];
}

export function Navigation({ items }: NavigationProps) {
  const pathname = usePathname();
  const { t } = useI18n();

  const defaultItems: NavItem[] = [
    { name: t.nav.dashboard, path: ROUTES.HOME, icon: "⚡️" },
    { name: t.nav.factory, path: ROUTES.CREATE, icon: "🛠" },
    { name: t.nav.showcase, path: ROUTES.SHOWCASE, icon: "🌍" },
  ];

  const navItems = items || defaultItems;

  return (
    <nav className="flex-1 px-4 space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link key={item.path} href={item.path}>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: isActive ? 'rgba(107, 70, 193, 0.15)' : 'transparent',
                color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
                border: isActive ? '1px solid var(--primary-color)' : '1px solid transparent'
              }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
