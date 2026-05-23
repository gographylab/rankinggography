import { Sidebar } from './Sidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const metadata = {
  title: 'Admin Dashboard | GOGRAPHY',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-neutral-50 dark:bg-neutral-950">
      {/* Desktop Sidebar */}
      <div className="hidden sm:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col w-full sm:pl-72">
        <AdminHeader />
        
        <main className="flex-1 p-6 sm:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
