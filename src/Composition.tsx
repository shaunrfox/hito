import { Phrase } from './Phrase';
import { StitchGrid } from './StitchGrid';

type CompositionProps = {
  h: string;
  v: string;
  onH?: (value: string) => void;
  onV?: (value: string) => void;
  /** Letter limits, used on the card. */
  maxAcross?: number;
  maxDown?: number;
  fancy: boolean;
  /** `wrapper` fills the screen. `composition` sizes to its content, for the card. */
  variant: 'wrapper' | 'composition';
};

/** The word across, the word down, and the pattern between them. */
export const Composition = ({
  h,
  v,
  onH,
  onV,
  maxAcross,
  maxDown,
  fancy,
  variant,
}: CompositionProps) => (
  <div className={`${variant}${fancy ? ' fancy' : ''}`}>
    <Phrase axis="h" value={h} onChange={onH} maxLength={maxAcross} />
    <Phrase axis="v" value={v} onChange={onV} maxLength={maxDown} />
    <div className="pattern">
      <StitchGrid horizontal={h} vertical={v} />
    </div>
  </div>
);
