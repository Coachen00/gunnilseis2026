import { useMatch } from "@/hooks/useMatch";
import EditableText from "./EditableText";
import MediaSlot from "./MediaSlot";
import SectionHeader from "@/components/SectionHeader";

interface Props {
  status: "upcoming" | "played";
  badge: string;
  title: string;
  subtitle?: string;
  sectionKey: string;
  fields?: { key: string; label: string; placeholder?: string }[];
  mediaSlots?: { key: string; title: string; description?: string }[];
}

export default function PhaseBlock({ status, badge, title, subtitle, sectionKey, fields = [], mediaSlots = [] }: Props) {
  const { match } = useMatch(status);

  return (
    <section id={sectionKey} className="scroll-mt-24">
      <SectionHeader badge={badge} title={title} subtitle={subtitle} />
      <div className="grid md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
              {f.label}
            </label>
            <EditableText
              matchId={match?.id}
              sectionKey={sectionKey}
              fieldKey={f.key}
              placeholder={f.placeholder}
            />
          </div>
        ))}
      </div>
      {mediaSlots.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {mediaSlots.map((m) => (
            <MediaSlot
              key={m.key}
              matchId={match?.id}
              slotKey={`${sectionKey}:${m.key}`}
              title={m.title}
              description={m.description}
            />
          ))}
        </div>
      )}
    </section>
  );
}