import type { VercelRequest, VercelResponse } from '@vercel/node';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

// Story dimensions (9:16 ratio for Instagram/TikTok stories)
const WIDTH = 1080;
const HEIGHT = 1920;

const RATING_STYLES: Record<string, { text: string; bg: string; color: string }> = {
  hit: { text: 'HIT', bg: '#00FF87', color: '#000000' },
  mid: { text: 'MID', bg: '#FFD93D', color: '#000000' },
  miss: { text: 'MISS', bg: '#FF6B6B', color: '#FFFFFF' },
};

const RARITY_STYLES: Record<string, { bg: string; text: string; glow: string }> = {
  common: { bg: '#6B7280', text: '#FFFFFF', glow: 'rgba(107,114,128,0.3)' },
  uncommon: { bg: '#22C55E', text: '#FFFFFF', glow: 'rgba(34,197,94,0.3)' },
  rare: { bg: '#3B82F6', text: '#FFFFFF', glow: 'rgba(59,130,246,0.3)' },
  epic: { bg: '#A855F7', text: '#FFFFFF', glow: 'rgba(168,85,247,0.4)' },
  legendary: { bg: '#F59E0B', text: '#000000', glow: 'rgba(245,158,11,0.5)' },
};

const BRAND_ORANGE = '#FF6B35';

// Helper to create element objects for satori
const el = (type: string, props: any, ...children: any[]) => ({
  type,
  props: {
    ...props,
    children: children.length === 1 ? children[0] : children.length > 0 ? children : undefined,
  },
});

// ============================================================
// CHECK-IN CARD
// ============================================================
function buildCheckInCard(params: any) {
  const { placeName, rating, note, dishes = [], username, cuisine, neighborhood, auraEarned, isVerified, isFirstVisit } = params;
  const ratingStyle = RATING_STYLES[rating] || RATING_STYLES.hit;
  const locationLine = [cuisine, neighborhood].filter(Boolean).join(' / ');

  const mainContent: any[] = [];

  // Rating badge
  mainContent.push(
    el('div', {
      style: { backgroundColor: 'white', color: ratingStyle.color, fontSize: '140px', fontWeight: 700, padding: '30px 100px', borderRadius: '40px', marginBottom: '50px', letterSpacing: '12px', display: 'flex' }
    }, ratingStyle.text)
  );

  // Place name
  mainContent.push(
    el('div', {
      style: { fontSize: '72px', fontWeight: 700, color: 'white', textAlign: 'center', marginBottom: '16px', maxWidth: '900px', display: 'flex' }
    }, placeName)
  );

  // Location
  if (locationLine) {
    mainContent.push(
      el('div', {
        style: { fontSize: '32px', color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: '30px', letterSpacing: '2px', display: 'flex' }
      }, locationLine)
    );
  }

  // Note
  if (note) {
    mainContent.push(
      el('div', {
        style: { fontSize: '36px', color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontStyle: 'italic', marginBottom: '40px', maxWidth: '800px', lineHeight: 1.4, padding: '0 40px', display: 'flex' }
      }, `"${note}"`)
    );
  }

  // Dishes
  if (dishes.length > 0) {
    mainContent.push(
      el('div', {
        style: { display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginBottom: '40px' }
      }, ...dishes.slice(0, 4).map((dish: string) =>
        el('div', {
          style: { border: '3px solid rgba(255,255,255,0.5)', padding: '14px 32px', borderRadius: '40px', fontSize: '28px', color: 'white', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex' }
        }, dish)
      ))
    );
  }

  // Aura earned
  if (auraEarned && auraEarned > 0) {
    mainContent.push(
      el('div', {
        style: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,215,0,0.95)', color: '#000000', fontSize: '36px', fontWeight: 700, padding: '18px 48px', borderRadius: '50px', marginBottom: '30px' }
      }, `+${auraEarned} AURA`)
    );
  }

  return el('div', {
    style: {
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter', position: 'relative',
      background: `linear-gradient(160deg, ${ratingStyle.bg} 0%, ${ratingStyle.bg}CC 100%)`
    }
  },
    // Top label
    el('div', {
      style: { position: 'absolute', top: '80px', left: '60px', right: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
    },
      el('div', {
        style: { fontSize: '28px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '4px', display: 'flex' }
      }, isFirstVisit ? 'FIRST VISIT' : 'CHECK-IN'),
      ...(isVerified ? [el('div', {
        style: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(34,197,94,0.9)', padding: '12px 20px', borderRadius: '30px' }
      }, el('div', { style: { fontSize: '20px', fontWeight: 700, color: 'white', letterSpacing: '2px', display: 'flex' } }, 'VERIFIED'))] : [])
    ),
    // Main content
    el('div', {
      style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', padding: '0 60px' }
    }, ...mainContent),
    // Bottom
    el('div', {
      style: { position: 'absolute', bottom: '80px', left: '60px', right: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }
    },
      ...(username ? [el('div', { style: { fontSize: '36px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', display: 'flex' } }, `@${username}`)] : []),
      el('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' } },
        el('div', { style: { fontSize: '42px', fontWeight: 700, color: 'white', letterSpacing: '3px', display: 'flex' } }, 'DOWN TO EAT'),
        el('div', { style: { fontSize: '22px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', display: 'flex' } }, 'downtoeat.app')
      )
    )
  );
}

// ============================================================
// CHALLENGE CARD
// ============================================================
function buildChallengeCard(params: any) {
  const { title, progress, username, auraReward, badgeReward, participantCount, daysRemaining } = params;
  const isComplete = progress >= 100;
  const progressColor = isComplete ? '#00FF87' : '#FFFFFF';

  const mainContent: any[] = [];

  // Progress number
  mainContent.push(
    el('div', {
      style: { fontSize: '220px', fontWeight: 700, color: progressColor, lineHeight: 0.9, display: 'flex' }
    }, `${Math.min(100, progress)}%`)
  );

  // Title
  mainContent.push(
    el('div', {
      style: { fontSize: '52px', fontWeight: 700, color: 'white', textAlign: 'center', marginTop: '20px', marginBottom: '40px', maxWidth: '800px', display: 'flex' }
    }, title)
  );

  // Progress bar
  mainContent.push(
    el('div', {
      style: { width: '100%', maxWidth: '700px', height: '24px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', marginBottom: '50px', overflow: 'hidden', display: 'flex' }
    },
      el('div', { style: { width: `${Math.min(100, progress)}%`, height: '100%', backgroundColor: progressColor, borderRadius: '12px' } })
    )
  );

  // Rewards
  const rewards: any[] = [];
  if (auraReward) {
    rewards.push(
      el('div', {
        style: { backgroundColor: 'rgba(255,215,0,0.95)', color: '#000000', fontSize: '36px', fontWeight: 700, padding: '18px 48px', borderRadius: '50px', display: 'flex' }
      }, `+${auraReward} AURA`)
    );
  }
  if (badgeReward) {
    rewards.push(
      el('div', {
        style: { backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '36px', fontWeight: 700, padding: '18px 48px', borderRadius: '50px', display: 'flex' }
      }, '+ BADGE')
    );
  }
  if (rewards.length > 0) {
    mainContent.push(
      el('div', { style: { display: 'flex', gap: '20px', marginBottom: '30px' } }, ...rewards)
    );
  }

  // Participants
  if (participantCount && participantCount > 0) {
    mainContent.push(
      el('div', {
        style: { fontSize: '28px', color: 'rgba(255,255,255,0.7)', marginBottom: '10px', display: 'flex' }
      }, `${participantCount} people completed this week`)
    );
  }

  // Days remaining
  if (daysRemaining !== undefined && daysRemaining > 0 && !isComplete) {
    mainContent.push(
      el('div', {
        style: { fontSize: '24px', color: 'rgba(255,255,255,0.6)', display: 'flex' }
      }, `${daysRemaining} days left`)
    );
  }

  return el('div', {
    style: {
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter', position: 'relative',
      background: 'linear-gradient(160deg, #7C3AED 0%, #5B21B6 50%, #4C1D95 100%)'
    }
  },
    // Decorative
    el('div', { style: { position: 'absolute', top: '-200px', right: '-150px', width: '500px', height: '500px', borderRadius: '250px', background: 'rgba(255,255,255,0.08)' } }),
    // Top label
    el('div', {
      style: { position: 'absolute', top: '80px', left: '0', right: '0', display: 'flex', justifyContent: 'center' }
    },
      el('div', {
        style: { fontSize: '28px', fontWeight: 700, color: isComplete ? '#00FF87' : 'rgba(255,255,255,0.8)', letterSpacing: '4px', display: 'flex' }
      }, isComplete ? 'CHALLENGE COMPLETE' : 'CHALLENGE')
    ),
    // Main content
    el('div', {
      style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', padding: '0 60px', paddingTop: '150px' }
    }, ...mainContent),
    // Bottom
    el('div', {
      style: { position: 'absolute', bottom: '80px', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }
    },
      ...(username ? [el('div', { style: { fontSize: '36px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', display: 'flex' } }, `@${username}`)] : []),
      el('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' } },
        el('div', { style: { fontSize: '42px', fontWeight: 700, color: 'white', letterSpacing: '3px', display: 'flex' } }, 'DOWN TO EAT'),
        el('div', { style: { fontSize: '22px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', display: 'flex' } }, 'downtoeat.app')
      )
    )
  );
}

// ============================================================
// BADGE CARD
// ============================================================
function buildBadgeCard(params: any) {
  const { name, description, rarity, username, rarityPercentile, xpReward } = params;
  const rarityStyle = RARITY_STYLES[rarity] || RARITY_STYLES.common;
  const initials = name?.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase() || 'BD';

  const mainContent: any[] = [];

  // Badge icon
  mainContent.push(
    el('div', {
      style: { width: '260px', height: '260px', borderRadius: '130px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '50px' }
    },
      el('div', { style: { fontSize: '100px', fontWeight: 700, color: BRAND_ORANGE, display: 'flex' } }, initials)
    )
  );

  // Name
  mainContent.push(
    el('div', {
      style: { fontSize: '64px', fontWeight: 700, color: 'white', textAlign: 'center', marginBottom: '20px', display: 'flex' }
    }, name)
  );

  // Description
  if (description) {
    mainContent.push(
      el('div', {
        style: { fontSize: '32px', color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: '40px', maxWidth: '600px', lineHeight: 1.4, display: 'flex' }
      }, description)
    );
  }

  // Rarity
  mainContent.push(
    el('div', {
      style: { backgroundColor: rarityStyle.bg, color: rarityStyle.text, fontSize: '32px', fontWeight: 700, padding: '16px 56px', borderRadius: '50px', marginBottom: '24px', letterSpacing: '4px', display: 'flex' }
    }, rarity?.toUpperCase() || 'COMMON')
  );

  // Percentile
  if (rarityPercentile !== undefined) {
    mainContent.push(
      el('div', {
        style: { fontSize: '28px', color: 'rgba(255,255,255,0.8)', marginBottom: '24px', display: 'flex' }
      }, `Only ${rarityPercentile}% of users have this`)
    );
  }

  // XP reward
  if (xpReward) {
    mainContent.push(
      el('div', {
        style: { backgroundColor: 'rgba(255,215,0,0.95)', color: '#000000', fontSize: '36px', fontWeight: 700, padding: '18px 48px', borderRadius: '50px', display: 'flex' }
      }, `+${xpReward} AURA`)
    );
  }

  return el('div', {
    style: {
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter', position: 'relative',
      background: `linear-gradient(160deg, ${BRAND_ORANGE} 0%, #E85A2A 100%)`
    }
  },
    // Top label
    el('div', {
      style: { position: 'absolute', top: '80px', left: '0', right: '0', display: 'flex', justifyContent: 'center' }
    },
      el('div', {
        style: { fontSize: '28px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '4px', display: 'flex' }
      }, 'BADGE UNLOCKED')
    ),
    // Main content
    el('div', {
      style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', padding: '0 60px' }
    }, ...mainContent),
    // Bottom
    el('div', {
      style: { position: 'absolute', bottom: '80px', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }
    },
      ...(username ? [el('div', { style: { fontSize: '36px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', display: 'flex' } }, `@${username}`)] : []),
      el('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' } },
        el('div', { style: { fontSize: '42px', fontWeight: 700, color: 'white', letterSpacing: '3px', display: 'flex' } }, 'DOWN TO EAT'),
        el('div', { style: { fontSize: '22px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', display: 'flex' } }, 'downtoeat.app')
      )
    )
  );
}

// ============================================================
// MILESTONE CARD
// ============================================================
function buildMilestoneCard(params: any) {
  const { milestone, username, cuisinesTried, longestStreak, uniquePlaces, explorerPercentile } = params;

  const getMilestoneTitle = (m: number): string => {
    if (m >= 1000) return 'LEGENDARY FOODIE';
    if (m >= 500) return 'FOOD LEGEND';
    if (m >= 100) return 'CENTURION';
    if (m >= 50) return 'SEASONED EXPLORER';
    if (m >= 25) return 'RISING FOODIE';
    if (m >= 10) return 'GETTING STARTED';
    return 'FIRST STEPS';
  };

  const mainContent: any[] = [];

  // Big number
  mainContent.push(
    el('div', {
      style: { fontSize: '280px', fontWeight: 700, color: 'white', lineHeight: 0.85, display: 'flex' }
    }, String(milestone))
  );

  // Label
  mainContent.push(
    el('div', {
      style: { fontSize: '48px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '12px', marginTop: '10px', marginBottom: '20px', display: 'flex' }
    }, 'CHECK-INS')
  );

  // Title
  mainContent.push(
    el('div', {
      style: { fontSize: '52px', fontWeight: 700, color: '#00FF87', marginBottom: '50px', display: 'flex' }
    }, getMilestoneTitle(milestone))
  );

  // Stats
  const stats = [
    cuisinesTried !== undefined && { value: cuisinesTried, label: 'CUISINES' },
    longestStreak !== undefined && { value: longestStreak, label: 'DAY STREAK' },
    uniquePlaces !== undefined && { value: uniquePlaces, label: 'PLACES' },
  ].filter(Boolean);

  if (stats.length > 0) {
    mainContent.push(
      el('div', { style: { display: 'flex', gap: '24px', marginBottom: '40px' } },
        ...stats.map((stat: any) =>
          el('div', {
            style: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '28px', padding: '28px 44px', display: 'flex', flexDirection: 'column', alignItems: 'center' }
          },
            el('div', { style: { fontSize: '56px', fontWeight: 700, color: 'white', display: 'flex' } }, String(stat.value)),
            el('div', { style: { fontSize: '18px', color: 'rgba(255,255,255,0.7)', letterSpacing: '3px', marginTop: '8px', display: 'flex' } }, stat.label)
          )
        )
      )
    );
  }

  // Percentile
  if (explorerPercentile !== undefined) {
    mainContent.push(
      el('div', {
        style: { fontSize: '28px', color: 'rgba(255,255,255,0.8)', backgroundColor: 'rgba(255,255,255,0.1)', padding: '14px 36px', borderRadius: '30px', display: 'flex' }
      }, `Top ${explorerPercentile}% of explorers`)
    );
  }

  return el('div', {
    style: {
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter', position: 'relative',
      background: 'linear-gradient(160deg, #3B82F6 0%, #1D4ED8 50%, #1E3A8A 100%)'
    }
  },
    // Decorative
    el('div', { style: { position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', borderRadius: '300px', background: 'rgba(255,255,255,0.08)' } }),
    // Top label
    el('div', {
      style: { position: 'absolute', top: '80px', left: '0', right: '0', display: 'flex', justifyContent: 'center' }
    },
      el('div', {
        style: { fontSize: '28px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '4px', display: 'flex' }
      }, 'MILESTONE REACHED')
    ),
    // Main content
    el('div', {
      style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', padding: '0 60px' }
    }, ...mainContent),
    // Bottom
    el('div', {
      style: { position: 'absolute', bottom: '80px', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }
    },
      ...(username ? [el('div', { style: { fontSize: '36px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', display: 'flex' } }, `@${username}`)] : []),
      el('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' } },
        el('div', { style: { fontSize: '42px', fontWeight: 700, color: 'white', letterSpacing: '3px', display: 'flex' } }, 'DOWN TO EAT'),
        el('div', { style: { fontSize: '22px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', display: 'flex' } }, 'downtoeat.app')
      )
    )
  );
}

// ============================================================
// PLACE CARD (simplified)
// ============================================================
function buildPlaceCard(params: any) {
  const { placeName, cuisine, neighborhood, priceLevel, hitRate, checkInCount, friendCount, rating, username } = params;
  const priceString = priceLevel ? '$'.repeat(priceLevel) : '';
  const locationParts = [cuisine, neighborhood, priceString].filter(Boolean);
  const ratingStyle = rating ? RATING_STYLES[rating] : null;

  const mainContent: any[] = [];

  // Rating badge
  if (ratingStyle) {
    mainContent.push(
      el('div', {
        style: { backgroundColor: ratingStyle.bg, color: ratingStyle.color, fontSize: '48px', fontWeight: 700, padding: '16px 56px', borderRadius: '40px', marginBottom: '30px', letterSpacing: '6px', display: 'flex' }
      }, ratingStyle.text)
    );
  }

  // Place name
  mainContent.push(
    el('div', {
      style: { fontSize: '64px', fontWeight: 700, color: 'white', textAlign: 'center', marginBottom: '16px', display: 'flex' }
    }, placeName)
  );

  // Location
  if (locationParts.length > 0) {
    mainContent.push(
      el('div', {
        style: { fontSize: '32px', color: 'rgba(255,255,255,0.8)', marginBottom: '40px', display: 'flex' }
      }, locationParts.join(' / '))
    );
  }

  // Stats
  const stats: any[] = [];
  if (hitRate !== undefined) {
    stats.push(
      el('div', {
        style: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '24px', padding: '24px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }
      },
        el('div', { style: { fontSize: '48px', fontWeight: 700, color: '#00FF87', display: 'flex' } }, `${hitRate}%`),
        el('div', { style: { fontSize: '16px', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px', marginTop: '8px', display: 'flex' } }, 'HIT RATE')
      )
    );
  }
  if (checkInCount !== undefined) {
    stats.push(
      el('div', {
        style: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '24px', padding: '24px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }
      },
        el('div', { style: { fontSize: '48px', fontWeight: 700, color: 'white', display: 'flex' } }, String(checkInCount)),
        el('div', { style: { fontSize: '16px', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px', marginTop: '8px', display: 'flex' } }, 'CHECK-INS')
      )
    );
  }
  if (friendCount !== undefined && friendCount > 0) {
    stats.push(
      el('div', {
        style: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '24px', padding: '24px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }
      },
        el('div', { style: { fontSize: '48px', fontWeight: 700, color: '#3B82F6', display: 'flex' } }, String(friendCount)),
        el('div', { style: { fontSize: '16px', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px', marginTop: '8px', display: 'flex' } }, 'FRIENDS')
      )
    );
  }
  if (stats.length > 0) {
    mainContent.push(el('div', { style: { display: 'flex', gap: '20px' } }, ...stats));
  }

  return el('div', {
    style: {
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter', position: 'relative',
      background: `linear-gradient(160deg, ${BRAND_ORANGE} 0%, #E85A2A 100%)`
    }
  },
    // Top label
    el('div', {
      style: { position: 'absolute', top: '80px', left: '0', right: '0', display: 'flex', justifyContent: 'center' }
    },
      el('div', { style: { fontSize: '28px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '4px', display: 'flex' } }, 'PLACE')
    ),
    // Main content at bottom
    el('div', {
      style: { position: 'absolute', bottom: '250px', left: '60px', right: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }
    }, ...mainContent),
    // Bottom
    el('div', {
      style: { position: 'absolute', bottom: '80px', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }
    },
      ...(username ? [el('div', { style: { fontSize: '36px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', display: 'flex' } }, `@${username}`)] : []),
      el('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' } },
        el('div', { style: { fontSize: '42px', fontWeight: 700, color: 'white', letterSpacing: '3px', display: 'flex' } }, 'DOWN TO EAT'),
        el('div', { style: { fontSize: '22px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', display: 'flex' } }, 'downtoeat.app')
      )
    )
  );
}

// ============================================================
// LIST CARD (simplified)
// ============================================================
function buildListCard(params: any) {
  const { listName, username, itemCount, saveCount, topPlaces = [], isTrending } = params;

  const mainContent: any[] = [];

  // List name
  mainContent.push(
    el('div', {
      style: { fontSize: '64px', fontWeight: 700, color: 'white', textAlign: 'center', marginBottom: '16px', display: 'flex' }
    }, `"${listName}"`)
  );

  // Creator
  if (username) {
    mainContent.push(
      el('div', {
        style: { fontSize: '32px', color: 'rgba(255,255,255,0.8)', marginBottom: '50px', display: 'flex' }
      }, `by @${username}`)
    );
  }

  // Stats
  const stats: any[] = [];
  if (itemCount !== undefined) {
    stats.push(
      el('div', {
        style: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '28px', padding: '28px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }
      },
        el('div', { style: { fontSize: '56px', fontWeight: 700, color: 'white', display: 'flex' } }, String(itemCount)),
        el('div', { style: { fontSize: '18px', color: 'rgba(255,255,255,0.7)', letterSpacing: '3px', marginTop: '8px', display: 'flex' } }, 'PLACES')
      )
    );
  }
  if (saveCount !== undefined && saveCount > 0) {
    stats.push(
      el('div', {
        style: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '28px', padding: '28px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }
      },
        el('div', { style: { fontSize: '56px', fontWeight: 700, color: 'white', display: 'flex' } }, String(saveCount)),
        el('div', { style: { fontSize: '18px', color: 'rgba(255,255,255,0.7)', letterSpacing: '3px', marginTop: '8px', display: 'flex' } }, 'SAVES')
      )
    );
  }
  if (stats.length > 0) {
    mainContent.push(el('div', { style: { display: 'flex', gap: '24px', marginBottom: '50px' } }, ...stats));
  }

  // Top places
  if (topPlaces.length > 0) {
    mainContent.push(
      el('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '700px' } },
        ...topPlaces.slice(0, 3).map((place: string, index: number) =>
          el('div', {
            style: { display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', padding: '24px 36px', borderRadius: '24px' }
          },
            el('div', { style: { fontSize: '40px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginRight: '24px', width: '60px', display: 'flex' } }, `${index + 1}.`),
            el('div', { style: { fontSize: '32px', fontWeight: 600, color: 'white', display: 'flex' } }, place)
          )
        )
      )
    );
  }

  return el('div', {
    style: {
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter', position: 'relative',
      background: 'linear-gradient(160deg, #EC4899 0%, #BE185D 100%)'
    }
  },
    // Decorative
    el('div', { style: { position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '200px', background: 'rgba(255,255,255,0.1)' } }),
    // Top label
    el('div', {
      style: { position: 'absolute', top: '80px', left: '0', right: '0', display: 'flex', justifyContent: 'center' }
    },
      el('div', {
        style: { fontSize: '28px', fontWeight: 700, color: isTrending ? '#FFD93D' : 'rgba(255,255,255,0.9)', letterSpacing: '4px', display: 'flex' }
      }, isTrending ? 'TRENDING LIST' : 'LIST')
    ),
    // Main content
    el('div', {
      style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', padding: '0 60px' }
    }, ...mainContent),
    // Bottom branding
    el('div', {
      style: { position: 'absolute', bottom: '80px', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }
    },
      el('div', { style: { fontSize: '42px', fontWeight: 700, color: 'white', letterSpacing: '3px', display: 'flex' } }, 'DOWN TO EAT'),
      el('div', { style: { fontSize: '22px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', display: 'flex' } }, 'downtoeat.app')
    )
  );
}

// Font loading (cached)
let fontBold: ArrayBuffer | null = null;
let fontRegular: ArrayBuffer | null = null;

async function loadFonts() {
  if (!fontBold || !fontRegular) {
    const [boldRes, regularRes] = await Promise.all([
      fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff'),
      fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff'),
    ]);
    fontBold = await boldRes.arrayBuffer();
    fontRegular = await regularRes.arrayBuffer();
  }
  return { fontBold, fontRegular };
}

// ============================================================
// MAIN HANDLER
// ============================================================
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const { layout, type = 'checkin' } = body;
    const effectiveLayout = layout || type;

    console.log('Generating image:', { effectiveLayout, ...body });

    // Load fonts
    const { fontBold, fontRegular } = await loadFonts();

    // Build element based on layout
    let element;
    switch (effectiveLayout) {
      case 'checkin':
        element = buildCheckInCard(body);
        break;
      case 'challenge':
        element = buildChallengeCard(body);
        break;
      case 'badge':
        element = buildBadgeCard(body);
        break;
      case 'milestone':
        element = buildMilestoneCard(body);
        break;
      case 'place':
        element = buildPlaceCard(body);
        break;
      case 'list':
        element = buildListCard(body);
        break;
      default:
        element = buildCheckInCard(body);
    }

    // Generate SVG with satori
    const svg = await satori(element, {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: 'Inter', data: fontBold!, weight: 700, style: 'normal' },
        { name: 'Inter', data: fontRegular!, weight: 400, style: 'normal' },
      ],
    });

    // Convert to PNG
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: WIDTH },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    // Return PNG
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    return res.send(Buffer.from(pngBuffer));
  } catch (error: any) {
    console.error('Error generating image:', error);
    return res.status(500).json({ error: error.message });
  }
}
