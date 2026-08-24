export default function handler(req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    service: 'OpsFlow AI Backend',
    model: 'gemini-3.7-flash',
    platform: 'Vercel Serverless',
  });
}
