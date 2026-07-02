'use client';

import Link from 'next/link';
import { Building2, Inbox, LayoutDashboard, LogOut, Plus, UserRound } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function Header() {
  // Header reads auth state to show login/admin/inquiry actions.
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);
  const hydrated = useSelector((state) => state.auth.hydrated);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-3 sm:px-4">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 text-lg font-bold">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-leaf text-white"><Building2 size={20} /></span>
          <span className="hidden sm:inline">EstateFlow</span>
        </Link>
        <nav className="ml-auto flex min-w-0 items-center gap-2 overflow-x-auto py-2">
          <Link href="/properties/new" className="btn-primary shrink-0 px-3 sm:px-4"><Plus size={16} /> <span>List</span></Link>
          {hydrated && token ? (
            <>
              {/* Logged-in user links. */}
              <Link href="/inquiries" className="btn-ghost shrink-0 px-3 sm:px-4"><Inbox size={16} /> <span className="hidden sm:inline">Inquiries</span></Link>
              {isAdmin && <Link href="/admin/properties" className="btn-ghost shrink-0 px-3 sm:px-4"><LayoutDashboard size={16} /> <span className="hidden sm:inline">Admin</span></Link>}
              <button className="btn-ghost shrink-0 px-3 sm:px-4" onClick={() => dispatch(logout())} title="Logout" aria-label="Logout"><LogOut size={16} /></button>
            </>
          ) : (
            <Link href="/login" className="btn-ghost shrink-0 px-3 sm:px-4"><UserRound size={16} /> <span className="hidden sm:inline">Login</span></Link>
          )}
        </nav>
      </div>
    </header>
  );
}
