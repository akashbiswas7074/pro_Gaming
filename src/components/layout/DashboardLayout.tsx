'use client';

import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useUserStore } from '@/store/userStore';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user } = useUserStore();
    const pathname = usePathname();

    // Pages that don't need sidebar
    const noSidebarPages = ['/', '/register', '/login'];
    const showSidebar = user && !noSidebarPages.includes(pathname);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="flex-1 flex pt-16">
                {showSidebar && <Sidebar />}

                <main className={`flex-1 ${showSidebar ? 'lg:ml-64' : ''}`}>
                    <div className="min-h-full">
                        {children}
                    </div>
                </main>
            </div>

            <div className={showSidebar ? 'lg:ml-64' : ''}>
                <Footer />
            </div>
        </div>
    );
}
