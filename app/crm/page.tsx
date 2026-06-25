import { SiteShell } from "@/app/_components/site-shell";
import { createLeadActivity } from "@/app/dashboard/actions";
import { getCurrentProfile } from "@/lib/auth";
import { getLeadDetailData, type LeadActivityRow } from "@/lib/dashboard-data";

const stageLabels = {
  ativacao: "Ativação",
  investigacao: "Investigação",
  convite: "Convite",
  agendamento: "Agendamento",
  fechamento: "Fechamento",
  perdido: "Perdido",
};

const activityLabels = {
  note: "Nota",
  follow_up: "Follow-up",
  meeting: "Reunião",
  proposal: "Proposta",
  status_change: "Mudança",
};

export default async function CrmPage() {
  const profile = await getCurrentProfile();
  const { leads, activities } = await getLeadDetailData();

  const activitiesByLead = activities.reduce<Record<string, LeadActivityRow[]>>((acc, item) => {
    acc[item.lead_id] ??= [];
    acc[item.lead_id].push(item);
    return acc;
  }, {});

  const groupedLeads = {
    ativacao: leads.filter((lead) => lead.stage === "ativacao"),
    investigacao: leads.filter((lead) => lead.stage === "investigacao"),
    convite: leads.filter((lead) => lead.stage === "convite"),
    agendamento: leads.filter((lead) => lead.stage === "agendamento"),
    fechamento: leads.filter((lead) => lead.stage === "fechamento"),
    perdido: leads.filter((lead) => lead.stage === "perdido"),
  } as const;

  const leadMetrics = [
    { label: "Leads", value: leads.length },
    { label: "Em negociação", value: groupedLeads.agendamento.length + groupedLeads.fechamento.length },
    { label: "Perdidos", value: groupedLeads.perdido.length },
    { label: "Interações", value: activities.length },
  ];

  return (
    <SiteShell
      title="CRM"
      subtitle={`${profile.full_name} · pipeline e interações.`}
      accent="dark"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {leadMetrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] p-5"
          >
            <p className="text-sm text-white/60">{metric.label}</p>
            <p className="mt-4 font-display text-5xl text-[var(--color-gold)]">
              {String(metric.value).padStart(2, "0")}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-6">
        {(
          Object.entries(groupedLeads) as [keyof typeof groupedLeads, (typeof leads)[number][]][]
        ).map(([stage, items]) => (
          <article
            key={stage}
            className="rounded-[1.75rem] border border-white/10 bg-black/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">{stageLabels[stage]}</h2>
              <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/75">
                {items.length}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-white/55">Sem leads.</p>
              ) : (
                items.map((lead) => {
                  const recentActivities = (activitiesByLead[lead.id] ?? []).slice(0, 2);

                  return (
                    <article
                      key={lead.id}
                      className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-xs text-white/55">
                            {lead.whatsapp || "Sem WhatsApp"}
                          </p>
                        </div>
                        <span className="rounded-full bg-[var(--color-gold)]/15 px-2 py-1 text-[10px] text-[var(--color-gold)]">
                          {stageLabels[lead.stage]}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/60">
                        {lead.source ? (
                          <span className="rounded-full border border-white/10 px-2 py-1">
                            {lead.source}
                          </span>
                        ) : null}
                        {lead.instagram ? (
                          <span className="rounded-full border border-white/10 px-2 py-1">
                            Instagram
                          </span>
                        ) : null}
                        {lead.next_action_at ? (
                          <span className="rounded-full border border-white/10 px-2 py-1">
                            {lead.next_action_at.slice(0, 10)}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-3 text-sm text-white/70">
                        {lead.next_action || "Sem próxima ação"}
                      </p>

                      <div className="mt-4 space-y-2">
                        {recentActivities.length === 0 ? (
                          <p className="text-xs text-white/45">Sem histórico recente.</p>
                        ) : (
                          recentActivities.map((activity) => (
                            <div
                              key={activity.id}
                              className="rounded-2xl border border-white/10 bg-black/10 px-3 py-2"
                            >
                              <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                                {activityLabels[activity.activity_type]}
                              </p>
                              <p className="mt-1 text-sm text-white/75">{activity.content}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <details className="mt-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-3">
                        <summary className="cursor-pointer list-none text-sm text-white/75">
                          Registrar interação
                        </summary>

                        <form action={createLeadActivity} className="mt-3 grid gap-2">
                          <input type="hidden" name="leadId" value={lead.id} />
                          <select
                            name="activityType"
                            defaultValue="note"
                            className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
                          >
                            {Object.entries(activityLabels).map(([value, label]) => (
                              <option key={value} value={value} className="text-black">
                                {label}
                              </option>
                            ))}
                          </select>
                          <textarea
                            name="content"
                            placeholder="Resumo curto"
                            className="min-h-20 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                          />
                          <button
                            type="submit"
                            className="inline-flex h-10 items-center justify-center rounded-full bg-white/10 text-xs text-white"
                          >
                            Salvar
                          </button>
                        </form>
                      </details>
                    </article>
                  );
                })
              )}
            </div>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
