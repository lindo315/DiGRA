import "./Hero.css";

function Hero({
  title,
  subtitle,
  backgroundGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
}) {
  return (
    <div className="hero" style={{ background: backgroundGradient }}>
      <div className="hero-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}

export default Hero;
