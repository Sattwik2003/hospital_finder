import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { predictSpecialty, checkBackend } from "../services/aiService";
import { useNotification } from "../components/NotificationProvider";
import Sidebar from "../components/Sidebar";

function AISearch() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiAssist, setAiAssist] = useState(true);

  const navigate = useNavigate();

  const notify = useNotification();
  const [backendAlive, setBackendAlive] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    console.log("AISearch: submitting symptoms", symptoms);

    try {
      // double-check backend health before making the prediction
      const ok = await checkBackend();
      console.log("AISearch: backendAlive=", ok);

      if (!ok) {
        setBackendAlive(false);
        notify?.error?.("Backend server is not running. Start the API at http://127.0.0.1:8000");
        setLoading(false);
        return;
      }

      const result = await predictSpecialty(symptoms);
      console.log("AISearch: prediction result", result);

      navigate("/results", {
        state: {
          specialty: result.specialty,
        },
      });
    } catch (error) {
      console.error(error);
      notify?.error?.(`Prediction failed: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // Poll backend health while component is mounted and update UI
  const prevAlive = useRef(null);

  useEffect(() => {
    let mounted = true;

    const probe = async () => {
      try {
        const ok = await checkBackend();
        if (!mounted) return;

        // notify only when status changes
        if (prevAlive.current !== ok) {
          if (ok) notify?.success?.("Backend is up — AI search enabled.");
          else notify?.error?.("Backend is not running!!");
        }

        prevAlive.current = ok;
        setBackendAlive(!!ok);
      } catch (err) {
        if (mounted) {
          if (prevAlive.current !== false) {
            notify?.error?.("Backend is not running!!");
          }
          prevAlive.current = false;
          setBackendAlive(false);
        }
      }
    };

    probe();
    const id = setInterval(probe, 3000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [notify]);

  const handleRetry = async () => {
    const ok = await checkBackend();
    setBackendAlive(!!ok);
    if (!ok) notify?.error?.("Backend still not reachable");
    else notify?.success?.("Backend is up — you can use the AI search now.");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-12 gap-8">

        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <div className="sticky top-8">
            <Sidebar />
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9 lg:col-span-10 flex items-start justify-center">
          <div className="w-full max-w-3xl">
            <div className="text-center mb-8">
              <div className={`inline-block px-3 py-1 rounded-full text-xs ${backendAlive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {backendAlive ? 'AI BACKEND ONLINE' : 'AI BACKEND OFFLINE'}
              </div>
              <h1 className="mt-6 text-3xl font-extrabold">Describe Symptoms</h1>
              <p className="text-slate-500 mt-2">Provide a detailed description of your current symptoms to receive a preliminary specialty prediction.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-slate-500">Clinical Context</div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-500">AI Assist</label>
                  <button type="button" onClick={() => setAiAssist(!aiAssist)} className={`w-12 h-6 rounded-full p-0.5 ${aiAssist ? 'bg-blue-600' : 'bg-slate-300'}`}>
                    <div className={`${aiAssist ? 'translate-x-6' : 'translate-x-0'} bg-white w-5 h-5 rounded-full transform transition`} />
                  </button>
                </div>
              </div>

              <textarea rows={6} value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="e.g., I've been experiencing a persistent dull ache in my lower back for the past 3 days, accompanied by mild nausea in the mornings. No fever." className="w-full border rounded-lg p-4 min-h-[140px]" disabled={backendAlive === false} />

              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-slate-400">For informational purposes only.</div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={handleRetry} className="px-3 py-2 border rounded text-sm">Retry</button>
                  <button type="submit" disabled={loading || backendAlive === false || !aiAssist} className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold">
                    {loading ? 'Analyzing...' : 'Predict Specialty'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AISearch;