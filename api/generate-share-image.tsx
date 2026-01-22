import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

// Story dimensions (9:16 ratio for Instagram/TikTok stories)
const WIDTH = 1080;
const HEIGHT = 1920;

const RATING_STYLES = {
  hit: { text: 'HIT', bg: '#00FF87', color: '#000000' },
  mid: { text: 'MID', bg: '#FFD93D', color: '#000000' },
  miss: { text: 'MISS', bg: '#FF6B6B', color: '#FFFFFF' },
};

const RARITY_STYLES = {
  common: { bg: '#6B7280', text: '#FFFFFF', glow: 'rgba(107,114,128,0.3)' },
  uncommon: { bg: '#22C55E', text: '#FFFFFF', glow: 'rgba(34,197,94,0.3)' },
  rare: { bg: '#3B82F6', text: '#FFFFFF', glow: 'rgba(59,130,246,0.3)' },
  epic: { bg: '#A855F7', text: '#FFFFFF', glow: 'rgba(168,85,247,0.4)' },
  legendary: { bg: '#F59E0B', text: '#000000', glow: 'rgba(245,158,11,0.5)' },
};

const BRAND_ORANGE = '#FF6B35';

// ============================================================
// CHECK-IN CARD
// ============================================================
function CheckInCard({ placeName, rating, note, dishes = [], username, cuisine, neighborhood, auraEarned, isVerified, isFirstVisit, checkInNumber }: any) {
  const ratingStyle = RATING_STYLES[rating as keyof typeof RATING_STYLES] || RATING_STYLES.hit;
  const locationLine = [cuisine, neighborhood].filter(Boolean).join(' / ');

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter', position: 'relative', background: `linear-gradient(160deg, ${ratingStyle.bg} 0%, ${ratingStyle.bg}CC 100%)` }}>
      {/* Top label */}
      <div style={{ position: 'absolute', top: '80px', left: '60px', right: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '28px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '4px', textTransform: 'uppercase' }}>
          {isFirstVisit ? 'FIRST VISIT' : 'CHECK-IN'}
        </div>
        {isVerified && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(34,197,94,0.9)', padding: '12px 20px', borderRadius: '30px' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'white', letterSpacing: '2px' }}>VERIFIED</div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', padding: '0 60px' }}>
        {/* Rating badge */}
        <div style={{ backgroundColor: 'white', color: ratingStyle.color, fontSize: '140px', fontWeight: 700, padding: '30px 100px', borderRadius: '40px', marginBottom: '50px', letterSpacing: '12px' }}>
          {ratingStyle.text}
        </div>

        {/* Place name */}
        <div style={{ fontSize: '72px', fontWeight: 700, color: 'white', textAlign: 'center', marginBottom: '16px', maxWidth: '900px' }}>
          {placeName}
        </div>

        {/* Location */}
        {locationLine && (
          <div style={{ fontSize: '32px', color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: '30px', letterSpacing: '2px' }}>
            {locationLine}
          </div>
        )}

        {/* Note */}
        {note && (
          <div style={{ fontSize: '36px', color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontStyle: 'italic', marginBottom: '40px', maxWidth: '800px', lineHeight: 1.4, padding: '0 40px' }}>
            "{note}"
          </div>
        )}

        {/* Dishes */}
        {dishes.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginBottom: '40px' }}>
            {dishes.slice(0, 4).map((dish: string, i: number) => (
              <div key={i} style={{ border: '3px solid rgba(255,255,255,0.5)', padding: '14px 32px', borderRadius: '40px', fontSize: '28px', color: 'white', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.1)' }}>
                {dish}
              </div>
            ))}
          </div>
        )}

        {/* Aura earned */}
        {auraEarned && auraEarned > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,215,0,0.95)', color: '#000000', fontSize: '36px', fontWeight: 700, padding: '18px 48px', borderRadius: '50px', marginBottom: '30px' }}>
            +{auraEarned} AURA
          </div>
        )}
      </div>

      {/* Bottom - username + branding */}
      <div style={{ position: 'absolute', bottom: '80px', left: '60px', right: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        {username && (
          <div style={{ fontSize: '36px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>@{username}</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '42px', fontWeight: 700, color: 'white', letterSpacing: '3px' }}>DOWN TO EAT</div>
          <div style={{ fontSize: '22px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>downtoeat.app</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CHALLENGE CARD
// ============================================================
function ChallengeCard({ title, progress, username, auraReward, badgeReward, participantCount, daysRemaining }: any) {
  const isComplete = progress >= 100;
  const progressColor = isComplete ? '#00FF87' : '#FFFFFF';

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter', position: 'relative', background: 'linear-gradient(160deg, #7C3AED 0%, #5B21B6 50%, #4C1D95 100%)' }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: '-200px', right: '-150px', width: '500px', height: '500px', borderRadius: '250px', background: 'rgba(255,255,255,0.08)' }} />

      {/* Top label */}
      <div style={{ position: 'absolute', top: '80px', left: '0', right: '0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ fontSize: '28px', fontWeight: 700, color: isComplete ? '#00FF87' : 'rgba(255,255,255,0.8)', letterSpacing: '4px' }}>
          {isComplete ? 'CHALLENGE COMPLETE' : 'CHALLENGE'}
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', padding: '0 60px', paddingTop: '150px' }}>
        {/* Progress number */}
        <div style={{ fontSize: '220px', fontWeight: 700, color: progressColor, lineHeight: 0.9 }}>
          {Math.min(100, progress)}%
        </div>

        {/* Title */}
        <div style={{ fontSize: '52px', fontWeight: 700, color: 'white', textAlign: 'center', marginTop: '20px', marginBottom: '40px', maxWidth: '800px' }}>
          {title}
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', maxWidth: '700px', height: '24px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', marginBottom: '50px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${Math.min(100, progress)}%`, height: '100%', backgroundColor: progressColor, borderRadius: '12px' }} />
        </div>

        {/* Rewards */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          {auraReward && (
            <div style={{ backgroundColor: 'rgba(255,215,0,0.95)', color: '#000000', fontSize: '36px', fontWeight: 700, padding: '18px 48px', borderRadius: '50px' }}>
              +{auraReward} AURA
            </div>
          )}
          {badgeReward && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '36px', fontWeight: 700, padding: '18px 48px', borderRadius: '50px' }}>
              + BADGE
            </div>
          )}
        </div>

        {/* Participants */}
        {participantCount && participantCount > 0 && (
          <div style={{ fontSize: '28px', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>
            {participantCount} people completed this week
          </div>
        )}

        {/* Days remaining */}
        {daysRemaining !== undefined && daysRemaining > 0 && !isComplete && (
          <div style={{ fontSize: '24px', color: 'rgba(255,255,255,0.6)' }}>
            {daysRemaining} days left
          </div>
        )}
      </div>

      {/* Bottom */}
      <div style={{ position: 'absolute', bottom: '80px', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        {username && (
          <div style={{ fontSize: '36px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>@{username}</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '42px', fontWeight: 700, color: 'white', letterSpacing: '3px' }}>DOWN TO EAT</div>
          <div style={{ fontSize: '22px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>downtoeat.app</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// BADGE CARD
// ============================================================
function BadgeCard({ name, description, rarity, username, rarityPercentile, xpReward }: any) {
  const rarityStyle = RARITY_STYLES[rarity as keyof typeof RARITY_STYLES] || RARITY_STYLES.common;
  const initials = name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter', position: 'relative', background: `linear-gradient(160deg, ${BRAND_ORANGE} 0%, #E85A2A 100%)` }}>
      {/* Top label */}
      <div style={{ position: 'absolute', top: '80px', left: '0', right: '0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ fontSize: '28px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '4px' }}>
          BADGE UNLOCKED
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', padding: '0 60px' }}>
        {/* Badge icon */}
        <div style={{ width: '260px', height: '260px', borderRadius: '130px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '50px' }}>
          <div style={{ fontSize: '100px', fontWeight: 700, color: BRAND_ORANGE }}>{initials}</div>
        </div>

        {/* Name */}
        <div style={{ fontSize: '64px', fontWeight: 700, color: 'white', textAlign: 'center', marginBottom: '20px' }}>
          {name}
        </div>

        {/* Description */}
        <div style={{ fontSize: '32px', color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: '40px', maxWidth: '600px', lineHeight: 1.4 }}>
          {description}
        </div>

        {/* Rarity */}
        <div style={{ backgroundColor: rarityStyle.bg, color: rarityStyle.text, fontSize: '32px', fontWeight: 700, padding: '16px 56px', borderRadius: '50px', marginBottom: '24px', letterSpacing: '4px' }}>
          {rarity?.toUpperCase()}
        </div>

        {/* Percentile */}
        {rarityPercentile !== undefined && (
          <div style={{ fontSize: '28px', color: 'rgba(255,255,255,0.8)', marginBottom: '24px' }}>
            Only {rarityPercentile}% of users have this
          </div>
        )}

        {/* XP reward */}
        {xpReward && (
          <div style={{ backgroundColor: 'rgba(255,215,0,0.95)', color: '#000000', fontSize: '36px', fontWeight: 700, padding: '18px 48px', borderRadius: '50px' }}>
            +{xpReward} AURA
          </div>
        )}
      </div>

      {/* Bottom */}
      <div style={{ position: 'absolute', bottom: '80px', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        {username && (
          <div style={{ fontSize: '36px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>@{username}</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '42px', fontWeight: 700, color: 'white', letterSpacing: '3px' }}>DOWN TO EAT</div>
          <div style={{ fontSize: '22px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>downtoeat.app</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MILESTONE CARD
// ============================================================
function MilestoneCard({ milestone, username, cuisinesTried, longestStreak, uniquePlaces, explorerPercentile }: any) {
  const getMilestoneTitle = (m: number): string => {
    if (m >= 1000) return 'LEGENDARY FOODIE';
    if (m >= 500) return 'FOOD LEGEND';
    if (m >= 100) return 'CENTURION';
    if (m >= 50) return 'SEASONED EXPLORER';
    if (m >= 25) return 'RISING FOODIE';
    if (m >= 10) return 'GETTING STARTED';
    return 'FIRST STEPS';
  };

  const stats = [
    cuisinesTried !== undefined && { value: cuisinesTried, label: 'CUISINES' },
    longestStreak !== undefined && { value: longestStreak, label: 'DAY STREAK' },
    uniquePlaces !== undefined && { value: uniquePlaces, label: 'PLACES' },
  ].filter(Boolean);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter', position: 'relative', background: 'linear-gradient(160deg, #3B82F6 0%, #1D4ED8 50%, #1E3A8A 100%)' }}>
      {/* Decorative */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', borderRadius: '300px', background: 'rgba(255,255,255,0.08)' }} />

      {/* Top label */}
      <div style={{ position: 'absolute', top: '80px', left: '0', right: '0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ fontSize: '28px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '4px' }}>
          MILESTONE REACHED
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', padding: '0 60px' }}>
        {/* Big number */}
        <div style={{ fontSize: '280px', fontWeight: 700, color: 'white', lineHeight: 0.85 }}>
          {milestone}
        </div>

        {/* Label */}
        <div style={{ fontSize: '48px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '12px', marginTop: '10px', marginBottom: '20px' }}>
          CHECK-INS
        </div>

        {/* Title */}
        <div style={{ fontSize: '52px', fontWeight: 700, color: '#00FF87', marginBottom: '50px' }}>
          {getMilestoneTitle(milestone)}
        </div>

        {/* Stats */}
        {stats.length > 0 && (
          <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
            {stats.map((stat: any, i: number) => (
              <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '28px', padding: '28px 44px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '56px', fontWeight: 700, color: 'white' }}>{stat.value}</div>
                <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', letterSpacing: '3px', marginTop: '8px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Percentile */}
        {explorerPercentile !== undefined && (
          <div style={{ fontSize: '28px', color: 'rgba(255,255,255,0.8)', backgroundColor: 'rgba(255,255,255,0.1)', padding: '14px 36px', borderRadius: '30px' }}>
            Top {explorerPercentile}% of explorers
          </div>
        )}
      </div>

      {/* Bottom */}
      <div style={{ position: 'absolute', bottom: '80px', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        {username && (
          <div style={{ fontSize: '36px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>@{username}</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '42px', fontWeight: 700, color: 'white', letterSpacing: '3px' }}>DOWN TO EAT</div>
          <div style={{ fontSize: '22px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>downtoeat.app</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PLACE CARD
// ============================================================
function PlaceCard({ placeName, cuisine, neighborhood, priceLevel, hitRate, checkInCount, friendCount, rating, username }: any) {
  const priceString = priceLevel ? '$'.repeat(priceLevel) : '';
  const locationParts = [cuisine, neighborhood, priceString].filter(Boolean);
  const ratingStyle = rating ? RATING_STYLES[rating as keyof typeof RATING_STYLES] : null;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter', position: 'relative', background: `linear-gradient(160deg, ${BRAND_ORANGE} 0%, #E85A2A 100%)` }}>
      {/* Top label */}
      <div style={{ position: 'absolute', top: '80px', left: '0', right: '0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ fontSize: '28px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '4px' }}>PLACE</div>
      </div>

      {/* Main content */}
      <div style={{ position: 'absolute', bottom: '250px', left: '60px', right: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Rating badge */}
        {ratingStyle && (
          <div style={{ backgroundColor: ratingStyle.bg, color: ratingStyle.color, fontSize: '48px', fontWeight: 700, padding: '16px 56px', borderRadius: '40px', marginBottom: '30px', letterSpacing: '6px' }}>
            {ratingStyle.text}
          </div>
        )}

        {/* Place name */}
        <div style={{ fontSize: '64px', fontWeight: 700, color: 'white', textAlign: 'center', marginBottom: '16px' }}>
          {placeName}
        </div>

        {/* Location */}
        {locationParts.length > 0 && (
          <div style={{ fontSize: '32px', color: 'rgba(255,255,255,0.8)', marginBottom: '40px' }}>
            {locationParts.join(' / ')}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {hitRate !== undefined && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '24px', padding: '24px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 700, color: '#00FF87' }}>{hitRate}%</div>
              <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px', marginTop: '8px' }}>HIT RATE</div>
            </div>
          )}
          {checkInCount !== undefined && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '24px', padding: '24px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 700, color: 'white' }}>{checkInCount}</div>
              <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px', marginTop: '8px' }}>CHECK-INS</div>
            </div>
          )}
          {friendCount !== undefined && friendCount > 0 && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '24px', padding: '24px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 700, color: '#3B82F6' }}>{friendCount}</div>
              <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px', marginTop: '8px' }}>FRIENDS</div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ position: 'absolute', bottom: '80px', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        {username && (
          <div style={{ fontSize: '36px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>@{username}</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '42px', fontWeight: 700, color: 'white', letterSpacing: '3px' }}>DOWN TO EAT</div>
          <div style={{ fontSize: '22px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>downtoeat.app</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LIST CARD
// ============================================================
function ListCard({ listName, username, itemCount, saveCount, topPlaces = [], isTrending }: any) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter', position: 'relative', background: 'linear-gradient(160deg, #EC4899 0%, #BE185D 100%)' }}>
      {/* Decorative */}
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '200px', background: 'rgba(255,255,255,0.1)' }} />

      {/* Top label */}
      <div style={{ position: 'absolute', top: '80px', left: '0', right: '0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ fontSize: '28px', fontWeight: 700, color: isTrending ? '#FFD93D' : 'rgba(255,255,255,0.9)', letterSpacing: '4px' }}>
          {isTrending ? 'TRENDING LIST' : 'LIST'}
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', padding: '0 60px' }}>
        {/* List name */}
        <div style={{ fontSize: '64px', fontWeight: 700, color: 'white', textAlign: 'center', marginBottom: '16px' }}>
          "{listName}"
        </div>

        {/* Creator */}
        {username && (
          <div style={{ fontSize: '32px', color: 'rgba(255,255,255,0.8)', marginBottom: '50px' }}>
            by @{username}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '50px' }}>
          {itemCount !== undefined && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '28px', padding: '28px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '56px', fontWeight: 700, color: 'white' }}>{itemCount}</div>
              <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', letterSpacing: '3px', marginTop: '8px' }}>PLACES</div>
            </div>
          )}
          {saveCount !== undefined && saveCount > 0 && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '28px', padding: '28px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '56px', fontWeight: 700, color: 'white' }}>{saveCount}</div>
              <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', letterSpacing: '3px', marginTop: '8px' }}>SAVES</div>
            </div>
          )}
        </div>

        {/* Top places */}
        {topPlaces.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '700px' }}>
            {topPlaces.slice(0, 3).map((place: string, index: number) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', padding: '24px 36px', borderRadius: '24px' }}>
                <div style={{ fontSize: '40px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginRight: '24px', width: '60px' }}>{index + 1}.</div>
                <div style={{ fontSize: '32px', fontWeight: 600, color: 'white' }}>{place}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div style={{ position: 'absolute', bottom: '80px', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ fontSize: '42px', fontWeight: 700, color: 'white', letterSpacing: '3px' }}>DOWN TO EAT</div>
        <div style={{ fontSize: '22px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>downtoeat.app</div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN HANDLER
// ============================================================
export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    const body = await req.json();
    const { layout, type = 'checkin' } = body;
    const effectiveLayout = layout || type;

    let element;

    switch (effectiveLayout) {
      case 'checkin':
        element = <CheckInCard {...body} />;
        break;
      case 'challenge':
        element = <ChallengeCard {...body} />;
        break;
      case 'badge':
        element = <BadgeCard {...body} />;
        break;
      case 'milestone':
        element = <MilestoneCard {...body} />;
        break;
      case 'place':
        element = <PlaceCard {...body} />;
        break;
      case 'list':
        element = <ListCard {...body} />;
        break;
      default:
        element = <CheckInCard {...body} />;
    }

    return new ImageResponse(element, {
      width: WIDTH,
      height: HEIGHT,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
