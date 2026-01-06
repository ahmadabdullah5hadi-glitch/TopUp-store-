import { trpc } from "@/utils/trpc"; 

export default function Admin() {
  const { data: orders } = trpc.orders.list.useQuery();

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-5">لوحة التحكم - مراقبة الطلبات</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">ID الطلب</th>
              <th className="p-3">لاعب</th>
              <th className="p-3">الجواهر</th>
              <th className="p-3">الحالة</th>
              <th className="p-3">المبلغ</th>
              <th className="p-3">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((o) => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{o.id}</td>
                <td className="p-3 font-mono">{o.playerId}</td>
                <td className="p-3">{o.gems}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${o.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-3 font-bold">${(o.priceUSD / 100).toFixed(2)}</td>
                <td className="p-3 text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
          }
