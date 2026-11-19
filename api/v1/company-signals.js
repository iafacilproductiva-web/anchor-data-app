export default function handler(req, res) {
  const { key } = req.query;

  if (!key) {
    return res.status(401).json({
      error: "No autorizado",
      message: "Se requiere una API Key válida para consultar señales de empresas."
    });
  }

  const datasetSignals = {
    provider: "Anchor Data B2B Infrastructure",
    timestamp: new Date().toISOString(),
    query_status: "SUCCESS",
    data: {
      companies_tracked: 1420,
      high_intent_leads: [
        {
          company_domain: "acme-analytics.io",
          buying_intent_score: 96,
          hiring_signals: ["Head of AI Infrastructure", "Senior DevOps Rust"],
          tech_changes_30d: ["Added Cloudflare Workers", "Added Supabase"],
          estimated_arr: "$2M - $5M"
        },
        {
          company_domain: "finflow-pay.com",
          buying_intent_score: 91,
          hiring_signals: ["Web3 Payment Engineer"],
          tech_changes_30d: ["Integrated Polygon Web3 SDK"],
          estimated_arr: "$5M - $10M"
        }
      ]
    }
  };

  return res.status(200).json(datasetSignals);
}