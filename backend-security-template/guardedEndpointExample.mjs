import { verifyFirebaseRequest } from './verifyRequest.mjs';
import { consumeRateLimit } from './rateLimit.mjs';

export async function guardedAiHandler(req, res){
  try {
    const { uid } = await verifyFirebaseRequest(req);

    await consumeRateLimit({
      uid,
      scope: 'assistant',
      perMinute: 5,
      perDay: 30,
    });

    const question = String(req.body?.question || '').trim();
    if (!question || question.length > 2000) {
      return res.status(400).json({ ok: false, error: 'Pregunta inválida' });
    }

    // Aquí se llama al caso de uso real, no directamente al proveedor desde el handler.
    // const result = await askAssistantUseCase({ uid, question });

    return res.status(501).json({
      ok: false,
      error: 'Conecta aquí el caso de uso real del backend IA.',
    });
  } catch (err) {
    const status = Number(err?.status || 500);
    return res.status(status).json({
      ok: false,
      error: status >= 500 ? 'Error interno' : err.message,
    });
  }
}
