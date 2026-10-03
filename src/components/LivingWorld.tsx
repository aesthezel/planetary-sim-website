import { useState } from 'preact/hooks';
import { Reveal } from './Reveal';

export function LivingWorld() {
  const [seed, setSeed] = useState('Mundo');
  const [eones, setEones] = useState(14.8);
  const [pop, setPop] = useState(1280);

  const handleSpark = () => {
    setEones((e) => Math.round((e + 0.5) * 10) / 10);
    setPop((p) => p + 32);
  };

  return (
    <section id="mundo-vivo" class="section section--cream" style={{ background: 'var(--parchment)' }}>
      <div class="container container--narrow">
        <Reveal>
          <div class="section-header">
            <span class="section-header__label">Simulación Viva</span>
            <h2 class="section-header__title">Un mundo que late con semilla propia</h2>
            <p class="section-header__subtitle">
              Cada planeta se genera mediante una semilla alfanumérica única, calculando su geografía,
              aparición de islas y ciclo de estasis segura.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div
            style={{
              background: 'var(--cream-soft)',
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-soft)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: 'var(--space-sm)',
              }}
            >
              <div>
                <span class="text-xs text-muted" style={{ display: 'block', textTransform: 'uppercase' }}>
                  Semilla Activa
                </span>
                <input
                  type="text"
                  value={seed}
                  onInput={(e) => setSeed((e.target as HTMLInputElement).value)}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-lg)',
                    color: 'var(--text-heading)',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    borderBottom: '2px dashed var(--wood-light)',
                    padding: '2px 0',
                    width: '180px',
                  }}
                  title="Cambia la semilla"
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <div>
                  <span class="text-xs text-muted" style={{ display: 'block', textTransform: 'uppercase' }}>
                    Eones
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--wood)', fontSize: 'var(--text-lg)' }}>
                    {eones} ✧
                  </span>
                </div>
                <div>
                  <span class="text-xs text-muted" style={{ display: 'block', textTransform: 'uppercase' }}>
                    Población
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--patch-grass-dark)', fontSize: 'var(--text-lg)' }}>
                    {pop.toLocaleString()}
                  </span>
                </div>
              </div>

              <button class="btn btn--primary" onClick={handleSpark} type="button" style={{ fontSize: 'var(--text-xs)' }}>
                Recoger Mota Astral ✧
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-sm)' }}>
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-heading)', marginBottom: 'var(--space-3xs)' }}>
                  Estasis segura
                </h4>
                <p class="text-sm text-muted">
                  Puedes cerrar la ventana o alejarte días enteros: la simulación nunca penalizará tu tiempo fuera.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-heading)', marginBottom: 'var(--space-3xs)' }}>
                  El Almanaque
                </h4>
                <p class="text-sm text-muted">
                  Guarda la memoria histórica de cada especie, sus rasgos descubiertos y las ruinas de ciclos pasados.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
