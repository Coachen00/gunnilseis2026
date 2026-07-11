interface KedjaClimaxProps {
  label: string;
  text: string;
  connector?: boolean;
}

const KedjaClimax = ({ label, text, connector = true }: KedjaClimaxProps) => {
  return (
    <div className="flex w-full flex-col items-center">
      {connector && <span className="block h-[34px] w-[2px] bg-kedja-green" aria-hidden="true" />}
      <div className="w-full rounded-2xl bg-kedja-ink px-7 py-[26px] text-center">
        <div className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.3em] text-kedja-mint/60">{label}</div>
        <div className="text-[clamp(1.5rem,3vw,2.2rem)] font-black tracking-[-0.01em] text-kedja-lime">{text}</div>
      </div>
    </div>
  );
};

export default KedjaClimax;
