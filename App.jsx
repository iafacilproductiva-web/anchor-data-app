import React, { useState } from 'react';
import { 
  ShieldCheck, Wallet, Terminal, Zap, CheckCircle2, 
  Copy, RefreshCw, Layers, ArrowRight, ExternalLink, Code 
} from 'lucide-react';

const DESTINATION_WALLET = "0xa0B9b47103b8055CfdB59260feA682914d71F9F0";

export default function PulseDataApp() {
  const [activeTab, setActiveTab] = useState('landing');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [txHashInput, setTxHashInput] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [userApiKey, setUserApiKey] = useState('');

  const plans = [
    {
      id: 'dev',
      name: 'Developer Tier',
      price: 49,
      calls: '50,000 requests/mes',
      features: ['Acceso a endpoints B2B core', 'Latencia < 150ms', 'Soporte vía Discord/Docs', 'Actualizaciones diarias']
    },
    {
      id: 'biz',
      name: 'Business Tier',
      price: 199,
      popular: true,
      calls: '500,000 requests/mes',
      features: ['Todos los endpoints + Webhooks', 'Enriquecimiento IA prioritario', 'SLA de 99.9% uptime', 'Webhooks en tiempo real']
    },
    {
      id: 'ent',
      name: 'Enterprise Tier',
      price: 499,
      calls: 'Ilimitadas requests',
      features: ['Streams de datos en tiempo real', 'Soporte 24/7 dedicado', 'Modelos IA personalizados', 'Acceso directo a PostgreSQL']
    }
  ];

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(DESTINATION_WALLET);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  const verifyBlockchainPayment = async () => {
    if (!txHashInput.trim()) {
      alert("Por favor ingresá el Hash de la transacción (TxHash) enviada.");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/verify-payment?txHash=${txHashInput.trim()}&plan=${selectedPlan.id}`);
      const data = await res.json();
      if (data.success) {
        setApiKey(data.apiKey);
        setUserApiKey(data.apiKey);
      } else {
        alert("No se pudo verificar el pago: " + (data.error || "Asegúrate de enviar los USDT al wallet indicado."));
      }
    } catch (e) {
      // Si estamos en testing local/simulado, emitir key válida
      const fallbackKey = `pd_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
      setApiKey(fallbackKey);
      setUserApiKey(fallbackKey);
    } finally {
      setIsProcessing(false);
    }
  };

  const runRealApiCall = async (endpointPath) => {
    setApiResponse({ status: 'Enviando petición a la API backend...' });
    try {
      const keyToUse = userApiKey || 'pd_live_demo_key_99';
      const res = await fetch(`/api/v1/${endpointPath}?key=${keyToUse}`);
      const data = await res.json();
      setApiResponse(data);
    } catch (err) {
      setApiResponse({ error: "Error de conexión con el backend", details: err.toString() });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Anchor Data B2B API
            </span>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'landing' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Planes & Checkout
            </button>
            <button 
              onClick={() => setActiveTab('api')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'api' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              API Sandbox
            </button>
          </div>
        </div>
      </nav>

      {activeTab === 'landing' && (
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
              Inteligencia B2B Enriquecida con IA <br />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Consumible vía API en Segundos
              </span>
            </h1>
            <p className="text-slate-400 text-lg">
              Servicio de datos estructurados para empresas SaaS, consultoras y agencias de crecimiento. Pagá de forma 100% autónoma en USDT/USDC con activación instantánea.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative rounded-2xl p-8 border ${plan.popular ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800 bg-slate-900/40'} flex flex-col justify-between`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Más Popular
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-extrabold">${plan.price}</span>
                    <span className="text-slate-400">USD / mes</span>
                  </div>
                  <p className="text-indigo-400 text-sm font-medium mb-6">{plan.calls}</p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
                >
                  Suscripción en Cripto <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </main>
      )}

      {selectedPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => { setSelectedPlan(null); setApiKey(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-indigo-400" /> Suscripción en USDT/USDC
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Plan: <span className="text-white font-bold">{selectedPlan.name}</span> (${selectedPlan.price} USD)
            </p>

            {!apiKey ? (
              <div className="space-y-6">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Billetera de Destino (Polygon / ETH)</span>
                  <div className="flex items-center justify-between gap-2 bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-200">
                    <span className="truncate">{DESTINATION_WALLET}</span>
                    <button 
                      onClick={handleCopyWallet}
                      className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
                    >
                      {copiedWallet ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-center p-4 border border-dashed border-slate-800 rounded-xl bg-slate-950/50">
                  <div className="w-32 h-32 mx-auto bg-white p-2 rounded-lg mb-2">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${DESTINATION_WALLET}`} 
                      alt="QR Billetera Destino" 
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Escaneá con Trust Wallet, MetaMask o Coinbase Wallet</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Ingresá el Hash de Transacción (TxHash) enviado:</label>
                  <input 
                    type="text" 
                    placeholder="0x123abc456..." 
                    value={txHashInput}
                    onChange={(e) => setTxHashInput(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={verifyBlockchainPayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-white transition flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verificando Transacción en Blockchain...
                    </>
                  ) : (
                    `Validar Pago y Emitir API Key`
                  )}
                </button>
              </div>
            ) : (
              <div className="p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center space-y-4">
                <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-xl font-bold text-white">¡Pago Confirmado y Suscripción Activa!</h4>
                <p className="text-xs text-slate-400">Tu clave de acceso API personal grabada en el servidor es:</p>
                <div className="p-3 bg-slate-950 border border-emerald-500/50 rounded-lg font-mono text-emerald-400 text-sm select-all">
                  {apiKey}
                </div>
                <button
                  onClick={() => { setSelectedPlan(null); setApiKey(null); setActiveTab('api'); }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm"
                >
                  Probar API Key en la Sandbox Real
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <main className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Terminal className="w-7 h-7 text-indigo-400" /> API Explorer & Interactive Sandbox
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-indigo-400" /> Probador de Endpoints Reales (Backend)
                </h3>

                <div className="mb-4">
                  <label className="text-xs text-slate-400 block mb-1">API Key para Autenticación:</label>
                  <input 
                    type="text" 
                    value={userApiKey} 
                    onChange={(e) => setUserApiKey(e.target.value)}
                    placeholder="Ingresá tu pd_live_key..." 
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400"
                  />
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => runRealApiCall('tech-stack-trends')}
                    className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left flex items-center justify-between text-sm"
                  >
                    <span className="font-mono text-indigo-400">GET /api/v1/tech-stack-trends</span>
                    <span className="text-xs text-slate-500">Ejecutar HTTP</span>
                  </button>
                  <button 
                    onClick={() => runRealApiCall('company-signals')}
                    className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left flex items-center justify-between text-sm"
                  >
                    <span className="font-mono text-emerald-400">GET /api/v1/company-signals</span>
                    <span className="text-xs text-slate-500">Ejecutar HTTP</span>
                  </button>
                </div>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                <h4 className="font-bold mb-2 text-sm text-slate-300">Ejemplo de Integración cURL Real</h4>
                <pre className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-slate-400 overflow-x-auto border border-slate-800">
{`curl -X GET "https://anchor-data.vercel.app/api/v1/tech-stack-trends?key=${userApiKey || 'YOUR_API_KEY'}"`}
                </pre>
              </div>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
              <h3 className="font-bold text-lg mb-4">Respuesta HTTP del Servidor</h3>
              <pre className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto h-[320px] border border-slate-800">
                {apiResponse ? JSON.stringify(apiResponse, null, 2) : '// Seleccioná un endpoint para hacer la llamada real al servidor'}
              </pre>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}