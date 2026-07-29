function FeatureCard({ icon, title, description, noBadge = false }) {
  return (
    <div className="bg-[#F7F3E6] rounded-2xl shadow-sm border border-[#E7E1CF] p-6 w-full max-w-[320px] text-center transition hover:shadow-md card-shadow">

      {!noBadge ? (
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-[#C7D9B6]" style={{ background: 'rgba(84,107,65,0.9)' }}>
          <img src={icon} alt={title} className="w-8 h-8" />
        </div>
      ) : (
        <img src={icon} alt={title} className="w-12 h-12 mx-auto mb-4" />
      )}

      <h3
        className="text-[18px] font-semibold text-[#4E6F3B]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h3>

      <p className="mt-3 text-[14px] leading-7 text-[#5B5B53]" style={{ fontFamily: "var(--font-body)" }}>
        {description}
      </p>

    </div>
  );
}

export default FeatureCard;