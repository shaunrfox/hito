import { HitoPattern } from './HitoPattern';

type CardFaceProps = {
  horizontal: string;
  vertical: string;
};

/**
 * What prints on the card: the pattern, with the two words in small type
 * below it. It fills its parent. The parent sets the white border.
 */
export const CardFace = ({ horizontal, vertical }: CardFaceProps) => (
  <div className="card-face">
    <div className="card-pattern">
      <HitoPattern horizontal={horizontal} vertical={vertical} />
    </div>
    <p className="card-caption">
      {horizontal.trim().toUpperCase()} <span aria-hidden>×</span>{' '}
      {vertical.trim().toUpperCase()}
    </p>
  </div>
);
