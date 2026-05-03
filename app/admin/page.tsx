import Link from "next/link";

export default function AdminDashboard() {
  const cards = [
    {
      href: "/admin/hero",
      title: "Hero Content",
      description: "Edit the hero section headline, subtext, location badge, and schedule card",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "from-blue-500/20 to-blue-600/10",
      border: "border-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      href: "/admin/events",
      title: "Events Manager",
      description: "Create, edit, and delete golf events with images, dates, and details",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "from-purple-500/20 to-purple-600/10",
      border: "border-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      href: "/admin/stats",
      title: "Stats Manager",
      description: "Update membership numbers, growth percentages, and hashtags",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "from-[#8DC63F]/20 to-[#8DC63F]/10",
      border: "border-[#8DC63F]/20",
      iconColor: "text-[#8DC63F]",
    },
    {
      href: "/admin/settings",
      title: "Site Settings",
      description: "Manage social media links, footer navigation, and copyright text",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "from-orange-500/20 to-orange-600/10",
      border: "border-orange-500/20",
      iconColor: "text-orange-400",
    },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Manage your GOLFIN website content from here.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Sections", value: "5" },
          { label: "Events", value: "2" },
          { label: "Pages", value: "1" },
          { label: "API Routes", value: "6" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#111111] border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#8DC63F]">{value}</div>
            <div className="text-gray-500 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Admin Cards */}
      <div className="grid sm:grid-cols-2 gap-5">
        {cards.map(({ href, title, description, icon, color, border, iconColor }) => (
          <Link
            key={href}
            href={href}
            className={`bg-gradient-to-br ${color} border ${border} rounded-2xl p-6 hover:scale-[1.02] transition-all group`}
          >
            <div className={`${iconColor} mb-4 group-hover:scale-110 transition-transform inline-block`}>
              {icon}
            </div>
            <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            <div className={`flex items-center gap-1 mt-4 ${iconColor} text-sm font-medium`}>
              Manage
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-8 bg-[#111111] border border-gray-800 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-xl transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Preview Website
          </Link>
          <Link
            href="/admin/events"
            className="flex items-center gap-2 text-sm text-[#8DC63F] border border-[#8DC63F]/30 hover:border-[#8DC63F] px-4 py-2 rounded-xl transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Event
          </Link>
        </div>
      </div>
    </div>
  );
}
