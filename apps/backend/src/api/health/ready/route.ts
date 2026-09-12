import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError, Modules } from "@medusajs/framework/utils"
import type { IPaymentModuleService } from "@medusajs/framework/types"
import { getRedisConnection } from "../../../lib/redis"

type DatabaseConnection = {
  raw: (query: string, bindings?: unknown[]) => Promise<unknown>
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const database = req.scope.resolve<DatabaseConnection>(
      ContainerRegistrationKeys.PG_CONNECTION
    )
    const redis = getRedisConnection()
    const payment = req.scope.resolve<IPaymentModuleService>(Modules.PAYMENT)
    const providerId = process.env.PAYMENT_PROVIDER_ID || "pp_system_default"
    const [, pong, providers] = await Promise.all([
      database.raw("select 1"),
      redis.ping(),
      payment.listPaymentProviders({}),
    ])
    if (pong !== "PONG") {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Redis did not respond"
      )
    }
    if (!providers.some((provider) => provider.id === providerId)) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Configured payment provider is unavailable"
      )
    }
    res.status(200).json({ status: "ready" })
  } catch (error) {
    console.error(
      "Readiness check failed:",
      error instanceof Error ? error.message : "Unknown readiness error"
    )
    res.status(503).json({ status: "not_ready" })
  }
}
