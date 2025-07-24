import UserMenu from './UserMenu';

export default function Nav() {
  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <div className="font-semibold text-xl">yourapp</div>
      <UserMenu />
    </nav>
  );
}
