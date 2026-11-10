import { StitchGrid } from './StitchGrid';
import { Phrase } from './Phrase';

type CompositionProps = {
  h: string;
  v: string;
  onH?: (value: string) => void;
  onV?: (value: string) => void;
  fancy: boolean;
  /** `wrapper` fills the screen. `composition` sizes to its content, for the card. */
  variant: 'wrapper' | 'composition';
};

/** The word across, the word down, and the pattern between them. */
export const Composition = ({ h, v, onH, onV, fancy, variant }: CompositionProps) => (
  <div className={`${variant}${fancy ? ' fancy' : ''}`}>
    <Phrase axis="h" value={h} onChange={onH} />
    <Phrase axis="v" value={v} onChange={onV} />
    <div className="pattern">
      <StitchGrid horizontal={h} vertical={v} />
    </div>
  </div>
);
