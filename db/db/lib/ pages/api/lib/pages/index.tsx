import { useState } from "react"; 
import { trpc } from "@/utils/trpc";

export default function Home() {
  const [playerId, setPlayerId] = useState("");
  const { data: packages } = trpc.packages.list.useQuery();
  const payMutation = trpc.payment.createSession.useMutation();

  const handlePay = async (pkgId: number) => {
    if (!playerId) return alert("أدخل ID اللاعب أولاً");
    const { url } = await payMutation.mutateAsync({ playerId, packageId: pkgId });
    window.location.href = url;
  };

  return (
    <div className="bg-black text-white p-10 text-center min-h-screen">
      <h1 className="text-cyan-400 text-3xl font-bold">متجر الشحن السريع 💎</h1>
      <input 
        className="mt-5 p-3 bg-gray-900 border border-cyan-500 rounded text-center" 
        placeholder="أدخل ID اللاعب" 
        onChange={(e) => setPlayerId(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
        {packages?.map((pkg) => (
          <div key={pkg.id} className="border border-cyan-900 p-5 rounded-lg hover:border-pink-500 transition cursor-pointer">
            <h2 className="text-2xl font-bold">{pkg.gems} جوهرة</h2>
            <p className="text-cyan-400 text-xl">${pkg.priceUSD / 100}</p>
            <button 
              onClick={() => handlePay(pkg.id)} 
              className="mt-3 bg-cyan-500 text-black px-6 py-2 rounded-full font-bold hover:bg-cyan-400"
            >
              شحن الآن
            </button>
          </div>
        ))}
      </div>
    </div>
  );
      }
