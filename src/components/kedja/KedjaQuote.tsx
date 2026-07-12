interface KedjaQuoteProps {
  text: string;
  highlight: string;
}

const KedjaQuote = ({ text, highlight }: KedjaQuoteProps) => {
  const parts = text.split(highlight);

  return (
    <section className="bg-kedja-ink">
      <div className="mx-auto max-w-[1200px] px-6 py-20 text-center">
        <p className="mx-auto max-w-[760px] text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold leading-[1.3] tracking-[-0.02em] text-kedja-mint">
          {parts.length === 2 ? (
            <>
              &quot;{parts[0]}
              <span className="text-kedja-lime">{highlight}</span>
              {parts[1]}&quot;
            </>
          ) : (
            `"${text}"`
          )}
        </p>
      </div>
    </section>
  );
};

export default KedjaQuote;
