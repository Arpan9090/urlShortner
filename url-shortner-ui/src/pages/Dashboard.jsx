import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyUrls();
  }, []);

  const fetchMyUrls = async () => {
    try {
      const response = await api.get('/my-urls');
      setUrls(response.data);
    } catch (err) {
      setError('Failed to fetch user links.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          My Shortened Links
        </h2>

        {error && (
          <p className="mt-4 text-red-400 text-sm font-medium bg-red-950/40 border border-red-900/60 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        {urls.length === 0 ? (
          <div className="mt-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-10 text-center">
            <p className="text-slate-400">No links created yet.</p>
          </div>
        ) : (
          <>
            {/* Mobile: stacked cards */}
            <div className="mt-6 space-y-3 sm:hidden">
              {urls.map((url) => (
                <div
                  key={url.id}
                  className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-4"
                >
                  <a
                    href={`http://localhost:8080/${url.shortCode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 font-semibold hover:underline break-all"
                  >
                    http://localhost:8080/{url.shortCode}
                  </a>
                  <p className="mt-2 text-sm text-slate-400 break-all">{url.originalUrl}</p>
                  <p className="mt-2 text-sm">
                    <span className="text-slate-500">Clicks:</span>{' '}
                    <span className="text-emerald-400 font-semibold">{url.clickCount}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop/tablet: table */}
            <div className="hidden sm:block mt-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/60 text-slate-300 text-sm">
                      <th className="px-5 py-3 font-semibold">Short Link</th>
                      <th className="px-5 py-3 font-semibold">Original URL</th>
                      <th className="px-5 py-3 font-semibold text-right">Click Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urls.map((url) => (
                      <tr
                        key={url.id}
                        className="border-t border-slate-800 hover:bg-slate-800/30 transition"
                      >
                        <td className="px-5 py-3">
                          <a
                            href={`http://localhost:8080/${url.shortCode}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-400 font-semibold hover:underline"
                          >
                            http://localhost:8080/{url.shortCode}
                          </a>
                        </td>
                        <td className="px-5 py-3 text-slate-400 max-w-xs truncate">
                          {url.originalUrl}
                        </td>
                        <td className="px-5 py-3 text-right text-emerald-400 font-semibold">
                          {url.clickCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;