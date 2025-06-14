export default function StatCard({ title, value, icon, color }) {
    return (
      <div className="bg-white rounded shadow p-4 flex flex-col">
        <div className="flex items-center space-x-2 mb-2">
          {icon && <span className={`text-2xl ${color}`}>{icon}</span>}
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <div className="text-3xl font-extrabold">{value}</div>
      </div>
    );
  }
  