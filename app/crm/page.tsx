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

  return (
    <SiteShell
      title="CRM"
      subtitle={`${profile.full_name} · pipeline, anotações e follow-up.`}
      accent="dark"
    >
      <section className="grid gap-4 xl:grid-cols-3">
        {(
          Object.entries(groupedLeads) as [keyof typeof groupedLeads, (typeof leads)[number][]][]
        ).map(([stage, items]) => (
          <article key={stage} className="rounded-[1.75rem] border border-white/10 bg-black/10 p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{stageLabels[stage]}</h2>
              <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/75">{items.length}</span>
            </div>

            <div className="mt-4 space-y-4">
              {items.length === 0 ? (
                <p className="text-sm text-white/55">Sem leads.</p>
              ) : (
                items.map((lead) => {
                  const recentActivities = (activitiesByLead[lead.id] ?? []).slice(0, 3);

                  return (
                    <article key={lead.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-xs text-white/55">{lead.whatsapp || "Sem WhatsApp"}</p>
                        </div>
                        <span className="rounded-full bg-[var(--color-gold)]/15 px-2 py-1 text-[10px] text-[var(--color-gold)]">
                          {stageLabels[lead.stage]}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-white/65">{lead.next_action || "Sem próxima ação"}</p>

                      <div className="mt-4 space-y-2">
                        {recentActivities.length === 0 ? (
                          <p className="text-xs text-white/45">Sem histórico.</p>
                        ) : (
                          recentActivities.map((activity) => (
                            <div key={activity.id} className="rounded-2xl border border-white/10 bg-black/10 px-3 py-2">
                              <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                                {activityLabels[activity.activity_type]}
                              </p>
                              <p className="mt-1 text-sm text-white/75">{activity.content}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <form action={createLeadActivity} className="mt-4 grid gap-2">
                        <input type="hidden" name="leadId" value={lead.id} />
                        <select name="activityType" defaultValue="note" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white">
                          {Object.entries(activityLabels).map(([value, label]) => (
                            <option key={value} value={value} className="text-black">
                              {label}
                            </option>
                          ))}
                        </select>
                        <textarea
                          name="content"
                          placeholder="Nova interação"
                          className="min-h-20 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                        />
                        <button type="submit" className="inline-flex h-10 items-center justify-center rounded-full bg-white/10 text-xs text-white">
                          Registrar
                        </button>
                      </form>
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
