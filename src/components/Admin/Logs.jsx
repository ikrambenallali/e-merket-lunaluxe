import { useEffect, useState } from "react";
import {api} from "../../config/api";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/admin/logs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLogs(response.data.logs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-brandRed animate-pulse">
          Chargement des logs...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF4FA] via-white to-[#FDECEF] px-6 py-10">
      <h1 className="text-3xl font-playfair text-center text-[#C447AF] uppercase mb-10 tracking-wide">
        Journaux Système
      </h1>

      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#E192D4]/40 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#C447AF]">
            Activité récente
          </h2>
          <span className="text-sm text-gray-500">
            Total : {logs.length} entrées
          </span>
        </div>

        <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#DD6ECA] scrollbar-track-[#FBF4FA] p-6 space-y-3">
          {logs.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              Aucun log trouvé 💤
            </p>
          ) : (
            logs.map((line, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  line.toLowerCase().includes("error")
                    ? "bg-red-50 border-l-4 border-red-500 text-red-700"
                    : line.toLowerCase().includes("warn")
                    ? "bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700"
                    : "bg-gray-50 border-l-4 border-[#E192D4] text-gray-700"
                } hover:shadow-md hover:scale-[1.01]`}
              >
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {line}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
