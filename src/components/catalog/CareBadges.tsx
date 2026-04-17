import IconSunLow from '../ui/icons/IconSunLow';
import IconSunMedium from '../ui/icons/IconSunMedium';
import IconSunHigh from '../ui/icons/IconSunHigh';
import IconWaterLow from '../ui/icons/IconWaterLow';
import IconWaterMedium from '../ui/icons/IconWaterMedium';
import IconWaterHigh from '../ui/icons/IconWaterHigh';
import { LIGHT_NEEDS, WATER_NEEDS } from '../../lib/constants';
import '../../styles/components/care-badges.css';

type Level = 'low' | 'medium' | 'high';

interface CareBadgesProps {
  light_needs: Level | null;
  water_needs: Level | null;
  /** 'compact' = icon only (cards), 'labeled' = icon + text (modal) */
  variant?: 'compact' | 'labeled';
}

const SunIcon = {
  low: IconSunLow,
  medium: IconSunMedium,
  high: IconSunHigh,
} as const;

const WaterIcon = {
  low: IconWaterLow,
  medium: IconWaterMedium,
  high: IconWaterHigh,
} as const;

export default function CareBadges({
  light_needs,
  water_needs,
  variant = 'compact',
}: CareBadgesProps) {
  const labeled = variant === 'labeled';

  return (
    <div className={`care-badges care-badges--${variant}`}>
      {light_needs && (
        <span className="care-badges__badge care-badges__badge--sun" title={LIGHT_NEEDS[light_needs]}>
          {(() => { const Icon = SunIcon[light_needs]; return <Icon width={labeled ? 18 : 16} height={labeled ? 18 : 16} />; })()}
          {labeled && <span className="care-badges__label">{LIGHT_NEEDS[light_needs]}</span>}
        </span>
      )}
      {water_needs && (
        <span className="care-badges__badge care-badges__badge--water" title={WATER_NEEDS[water_needs]}>
          {(() => { const Icon = WaterIcon[water_needs]; return <Icon width={labeled ? 18 : 16} height={labeled ? 18 : 16} />; })()}
          {labeled && <span className="care-badges__label">{WATER_NEEDS[water_needs]}</span>}
        </span>
      )}
    </div>
  );
}
