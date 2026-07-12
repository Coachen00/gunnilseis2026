import MediaSlot from "@/components/match/MediaSlot";

interface KedjaMediaProps {
  label: string;
  matchId?: string;
  slotKey: string;
  title: string;
  description?: string;
  captionPlaceholder?: string;
}

const KedjaMedia = ({ label, matchId, slotKey, title, description, captionPlaceholder }: KedjaMediaProps) => {
  return (
    <div className="mt-10">
      <div className="mb-2.5 text-center text-[11px] font-bold uppercase tracking-[0.24em] text-kedja-green">{label}</div>
      <MediaSlot matchId={matchId} slotKey={slotKey} title={title} description={description} captionPlaceholder={captionPlaceholder} />
    </div>
  );
};

export default KedjaMedia;
