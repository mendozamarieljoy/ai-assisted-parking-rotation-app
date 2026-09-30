import Link from "next/link";

export default function AdminPage() {
  const statistics = {
    users: 120,
    parkingSpaces: 45,
    schedules: 30,
  };

  const widgets = [
    {
      title: "Total Users",
      value: statistics.users,
      href: "/admin/users",
    },
    {
      title: "Parking Spaces",
      value: statistics.parkingSpaces,
      href: "/admin/parking-spaces",
    },
    {
      title: "Schedules",
      value: statistics.schedules,
      href: "/admin/schedules",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome to the admin dashboard. Use the sidebar to navigate.</p>

      <h2 className="text-2xl font-mono uppercase font-bold mt-4">
        Statistics
      </h2>
      <div className="mt-4 flex gap-4">
        {widgets.map((widget, index) => (
          <Link
            key={index}
            href={widget.href}
            className="w-full p-4 mb-4 rounded-lg bg-white shadow cursor-pointer hover:bg-slate-200 transition-colors"
          >
            <p className="text-2xl font-black font-mono">{widget.value}</p>
            <p className="text-lg font-semibold font-mono uppercase">
              {widget.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
