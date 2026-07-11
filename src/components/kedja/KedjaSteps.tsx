import { cn } from "@/lib/utils";

interface KedjaStep {
  label: string;
  headline: string;
  support: string;
}

interface KedjaStepsProps {
  steps: KedjaStep[];
  tone: "paper" | "white";
}

const KedjaSteps = ({ steps, tone }: KedjaStepsProps) => {
  const cardBg = tone === "paper" ? "bg-white" : "bg-kedja-paper";

  return (
    <div className="flex flex-col items-center">
      {steps.map((step, index) => (
        <div key={step.label} className="flex w-full flex-col items-center">
          <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border-2 border-kedja-ink bg-kedja-lime text-[15px] font-black text-kedja-ink">
            {index + 1}
          </span>
          <div className={cn("-mt-5 w-full rounded-2xl border-[1.5px] border-kedja-border px-7 pb-6 pt-[34px] text-center", cardBg)}>
            <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.24em] text-kedja-green">{step.label}</div>
            <p className="text-lg font-bold tracking-[-0.01em] text-kedja-ink">{step.headline}</p>
            <p className="mt-2 text-[15px] leading-[1.55] text-kedja-deep">{step.support}</p>
          </div>
          {index < steps.length - 1 && <span className="block h-[34px] w-[2px] bg-kedja-green" aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
};

export default KedjaSteps;
