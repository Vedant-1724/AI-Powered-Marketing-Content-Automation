import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState } from 'react';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-navy-900">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className="transition-all duration-300 min-h-screen"
        style={{ marginLeft: collapsed ? '80px' : '260px' }}
      >
        <div className="px-12 py-12 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
