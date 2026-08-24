export default function handler(req: any, res: any) {
  const payload = {
    status: 'ok',
    service: 'OpsFlow AI Backend',
    model: 'gemini-3.7-flash',
    platform: 'Vercel Serverless',
  };

  if (!res) {
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  if (typeof res.status === 'function') {
    if (typeof res.json === 'function') {
      return res.status(200).json(payload);
    }
    res.status(200);
    return res.end(JSON.stringify(payload));
  }

  return res.end(JSON.stringify(payload));
}
