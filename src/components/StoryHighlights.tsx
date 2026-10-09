import { copy } from '../content/copy';
import { storyStep } from '../state/store';

interface StoryHighlightsProps {
  onJump: (step: number) => void;
}

export function StoryHighlights({ onJump }: StoryHighlightsProps) {
  const activeStep = storyStep.value;
  const beat = activeStep > 0 ? copy.storyBeats[activeStep - 1] : null;

  return (
    <div class="story-guide">
      <div class={`story-window ${beat ? 'story-window--active' : ''}`} aria-live="polite" aria-atomic="true">
        {beat ? (
          <>
            <div class="story-window__topline">
              <span class="story-window__glyph" aria-hidden="true">{beat.glyph}</span>
              <span class="story-window__eyebrow">{beat.eyebrow}</span>
            </div>
            <h2>{beat.title}</h2>
            <p>{beat.text}</p>
            <span class="story-window__fact">{beat.fact}</span>
          </>
        ) : (
          <>
            <span class="story-window__eyebrow">{copy.storyDemoTitle}</span>
            <p>{copy.storyIntro}</p>
            <span class="story-window__fact">{copy.storyDemoHint}</span>
          </>
        )}
      </div>

      <nav class="story-nav" aria-label={copy.storyNavAria}>
        <div class="story-nav__track" aria-hidden="true">
          <span style={{ transform: `scaleX(${activeStep / copy.storyBeats.length})` }} />
        </div>
        {copy.storyBeats.map((step, index) => {
          const number = index + 1;
          const eyebrowPart = step.eyebrow.includes('·') ? step.eyebrow.split('·')[1].trim() : step.eyebrow;
          return (
            <button
              key={step.eyebrow}
              type="button"
              class={`story-nav__step ${activeStep === number ? 'is-active' : ''} ${activeStep > number ? 'is-complete' : ''}`}
              aria-label={`${copy.storyJumpAria} ${number}: ${step.title}`}
              aria-current={activeStep === number ? 'step' : undefined}
              onClick={() => onJump(number)}
            >
              <span>{String(number).padStart(2, '0')}</span>
              <small>{eyebrowPart}</small>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
