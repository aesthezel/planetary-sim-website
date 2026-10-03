import { copy } from '../content/copy';
import { Reveal } from './Reveal';

export function Status() {
  return (
    <section id="estado" class="section section--cream">
      <div class="container container--narrow">
        <Reveal>
          <div class="section-header">
            <span class="section-header__label">Ficha Técnica</span>
            <h2 class="section-header__title">{copy.statusTitle}</h2>
            <p class="section-header__subtitle">{copy.statusDescription}</p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div
            style={{
              background: 'var(--cream-soft)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <table class="data-table">
              <tbody>
                {copy.statusTable.map((row) => (
                  <tr key={row.campo}>
                    <th style={{ width: '38%', paddingLeft: 'var(--space-md)' }}>{row.campo}</th>
                    <td style={{ paddingRight: 'var(--space-md)' }}>{row.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
