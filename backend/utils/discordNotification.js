// notifyBlockedIP.js
import { DISCORD_WEBHOOK_URL } from "../config.js"

/**
 * notifikace na discord
 * vsechna pole jsou volitelna krome IP a REASON.
 */
export async function notifyBlockedIP({
  ip,
  reason,                     // např. "rateLimitExceeded (30/min)" | "invalidApiKey" | "geoBlocked (US)"
  // Kontext IP
  country,                    // např. "NG" nebo "Nigeria"
  city,
  asn,                        // např. "AS37282"
  isp,                        // např. "MainOne Cable Company"
  reverseDns,                 // např. "ec2-3-91-..." nebo "197-220-93-100.mainone.net"
  // Kontext útoku
  endpoint,                   // např. "/api/story"
  method,                     // "GET" | "POST"...
  requestsCount,              // číslo (kolik požadavků)
  requestsWindow,             // např. "60s" | "1m" | "5m"
  samplePayload,              // string (max ~200 znaků) zatim na vyzkouseni - pozdeji na honeypoint 
  // Kontext aplikace/serveru
  layer,                      // "openresty" | "nginx" | "express" | "waf"...
  statusCode,                 // co jsi vrátila (403, 429...)
  // Technické drobnosti
  userAgent,                  // může být fake, ale hodí se
  occurredAt = new Date(),    // Date instance
  dashboardUrl                // volitelný odkaz na vlastní logy/dash
} = {}) {
  // --- Validace minimálního vstupu ---
  if (!ip || !reason) {
    console.error("notifyBlockedIP: chybí povinné pole 'ip' nebo 'reason'.")
    return
  }

  const webhookUrl = DISCORD_WEBHOOK_URL
  if (!webhookUrl) {
    console.error("notifyBlockedIP: chybí DISCORD_WEBHOOK_URL v configu.")
    return
  }

  // --- urci barvu podle zavaznosti ---
  const severities = [
    { pattern: /honeypoint|sql|sqli|rce|xss|path|traversal|injection|credential|admin/i, color: 0xE74C3C }, // červená
    { pattern: /rate|limit|flood|dos|brute/i,                                    color: 0xF39C12 }, // oranžová
    { pattern: /geo|country|blocked|forbidden|invalidApiKey|unauthorized/i,      color: 0x3498DB }, // modrá
  ]
  const color = pickColor(reason, severities) || 0x95A5A6 // default šedá

  function pickColor(txt, rules) {
    for (const r of rules) if (r.pattern.test(txt)) return r.color
    return null
  }

  function safeVal(v, { fallback = "Neznámé", max = 300 } = {}) {
    if (v == null) return fallback
    const s = String(v).replace(/```/g, "ˋˋˋ").trim()
    return s.length > max ? s.slice(0, max) + "…" : s
  }

  function field(name, value, inline = true) {
    const v = value?.toString().trim()
    if (!v) return null
    return { name, value: v, inline }
  }

  // --- Sestavení embed fields (jen to, co existuje) ---
  const fields = [
    field("📄 Důvod", safeVal(reason, { max: 180 }), false),
    field("🕒 Čas", occurredAt.toLocaleString("cs-CZ"), true),
    field("🌍 Geo", [country, city].filter(Boolean).join(" • ")),
    field("🏢 ASN / ISP", [asn, isp].filter(Boolean).join(" • ")),
    field("🔁 rDNS", safeVal(reverseDns, { max: 120 })),
    field("🔗 Endpoint", [method, endpoint].filter(Boolean).join(" "), true),
    field("📊 Požadavky", [
      (requestsCount != null ? `${requestsCount}` : null),
      (requestsWindow ? `/${requestsWindow}` : null)
    ].filter(Boolean).join(" "), true),
    field("📥 Status", statusCode != null ? String(statusCode) : null, true),
    field("🧱 Vrstva", safeVal(layer, { max: 40 }), true),
    field("💻 User-Agent", safeVal(userAgent, { max: 200 }), false),
    field("🧪 Ukázka payloadu", safeVal(samplePayload, { max: 200 }), false),
  ].filter(Boolean)

  // --- vlozit ---
  const embed = {
    title: `🚫 IP ${ip} zablokována`,
    description: dashboardUrl ? `[Detailní log](${dashboardUrl})` : undefined,
    color,
    fields,
    footer: { text: "Firewall notification" },
    timestamp: occurredAt.toISOString() 
  }

  const body = {
    // content můžeš použít pro @here/@role, jinak nechej prázdné
    // content: "@here",
    embeds: [embed]
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
    if (!res.ok) {
      const txt = await res.text().catch(() => "")
      throw new Error(`Discord HTTP ${res.status}: ${txt}`)
    }
    console.log(`✅ Notifikace o blokaci IP ${ip} odeslána na Discord.`)
  } catch (err) {
    console.error("❌ Chyba při odesílání na Discord:", err?.message || err)
  }
}
