# FM26 vocabulary — roles & instructions

Data source for `lib/roles.ts` and `lib/instructions.ts`. The behaviour descriptions are
short summaries of behaviour (not FM's own text); the role and instruction **names** are the
factual FM26 taxonomy.

> **Important:** This is *vocabulary and behaviour* — not positions. The x/y coordinates each
> role occupies per phase per third must still be read from FM26's Visualizer. This file tells
> the system **what** exists and **what it does**; the Visualizer tells **where**.

---

## How the FM26 model works

- **Duties are gone** (defend/support/attack). Each outfield player has one **IP role** (in
  possession) + one **OOP role** (out of possession).
- **Team instructions are phase-split:** IP grouped into Build-Up / Progression / Final Third;
  OOP grouped into High Press / Mid Block / Low Block. Instructions only show when relevant to
  the phase/third.
- **Hard-coded role instructions are cut to a minimum** — more of the behaviour is now driven by
  individual player instructions, so you micro-manage yourself.
- Roughly **72 roles** total (~40 new), many of them OOP-specific or hybrid.

---

## 1. Roles by position

Phase column: **IP** = in-possession role, **OOP** = out-of-possession role (typically
press/cover/outlet), **Hybrid** = works in both.

### Goalkeeper
| Role | Phase | Behaviour |
|---|---|---|
| Goalkeeper (In Possession) | IP | Distributes the ball according to playing style |
| Goalkeeper (Out of Possession) | OOP | Guards the goal, focus on saves |
| Ball Playing Goalkeeper | IP | Active in build-up, willing to play short |
| No-Nonsense Goalkeeper | OOP | Cautious, stays on his line, no risk |
| Sweeper Keeper | Hybrid | Comes off his line, intercepts behind the defence |
| Line-Holding Keeper *(new)* | IP | Holds a higher line to shorten passing distances, without sweeping |

### Centre-Back
| Role | Phase | Behaviour |
|---|---|---|
| Centre-Back | Hybrid | Balanced defender |
| Advanced Centre-Back | IP | Steps forward toward the DM position |
| Ball-Playing Centre-Back | IP | Plays line-breaking passes in build-up |
| No-Nonsense Centre-Back | OOP | Holds position, clears, minimises risk |
| Wide Centre-Back | IP | Provides width, supports wide attackers |
| Overlapping Centre-Back | IP | Overlaps into wide areas as an extra winger |
| Stopping Centre-Back | OOP | Steps out and aggressively engages the opponent |
| Covering Centre-Back | OOP | Holds position, covers behind, reacts |

### Full-Back
| Role | Phase | Behaviour |
|---|---|---|
| Full-Back | Hybrid | Holds position, stays wide, overlaps |
| Inside Full-Back | IP | Tucks in as an extra central defender in build-up |
| Pressing Full-Back | OOP | Pushes up and supports the press |
| Holding Full-Back | OOP | Stays deeper while the team presses, cautious |

### Wing-Back
| Role | Phase | Behaviour |
|---|---|---|
| Wing-Back | Hybrid | Full-back + winger, gets high and provides width |
| Advanced Wing-Back | IP | As high and wide as possible |
| Inside Wing-Back | IP | Tucks in to DM, passing option + covers counters |
| Playmaking Wing-Back | IP | Tucks in to DM, deeply involved, creates via breaks/crosses |
| Pressing Wing-Back | OOP | Supports the press, engages high |
| Holding Wing-Back | OOP | Stays deeper while the team presses high |
| Inverted Wing-Back | IP | Effectively plays as a DM (your extra 6) |

### Defensive midfield
| Role | Phase | Behaviour |
|---|---|---|
| Defensive Midfielder | Hybrid | In front of the defensive line, covers counters |
| Dropping Defensive Midfielder | OOP | Drops into the defensive line as a CB under pressure |
| Pressing Defensive Midfielder | OOP | Pushes up and supports the high press |
| Screening Defensive Midfielder | OOP | Covers the space between the CBs, intercepts |
| Wide Covering Defensive Midfielder | OOP | Covers defensively in wide space |
| Deep-Lying Playmaker | IP | Dictates from deep, starts attacks |
| Half-Back | IP | Drops between the CBs in build-up |

### Central midfield
| Role | Phase | Behaviour |
|---|---|---|
| Central Midfielder | Hybrid | Supports both attack and defence |
| Screening Central Midfielder *(new)* | OOP | Blocks central passing lanes, holds position |
| Wide-Covering Central Midfielder *(new)* | OOP | Shifts wide when the full-back pushes up |
| Pressing Central Midfielder | OOP | Supports the press high |
| Midfield Playmaker | IP | Creative link between defence and attack |
| Channel Midfielder | IP | Runs into the half-spaces |
| Box-to-Box Midfielder | Hybrid | Covers the whole pitch |
| Box-to-Box Playmaker | Hybrid | Creative, drops deep and breaks forward |

### Wide midfield
| Role | Phase | Behaviour |
|---|---|---|
| Wide Midfielder | IP | Deeper, delivers crosses from wide |
| Tracking Wide Midfielder | OOP | Drops back and supports the defence |
| Wide Central Midfielder | IP | Drives into wide areas, helps build-up |
| Wide Outlet Midfielder | OOP | Doesn't track back, stays high as a counter target |

### Attacking midfield
| Role | Phase | Behaviour |
|---|---|---|
| Attacking Midfielder | IP | Works between the lines, creates space |
| Tracking Attacking Midfielder | OOP | Drops deep, provides defensive support |
| Advanced Playmaker | IP | Operates between the lines centrally |
| Central Outlet Attacking Midfielder | OOP | Stays high, no defensive duty |
| Splitting Outlet Attacking Midfielder | OOP | Stays high, drives into wide areas |
| Free Role | IP | Total freedom, goes wherever he wants |

### Winger
| Role | Phase | Behaviour |
|---|---|---|
| Winger | IP | Stretches play, delivers crosses |
| Half-Space Winger | IP | Tucks into the half-space when the full-back overlaps |
| Inside Winger | IP | Cuts inside centrally with an overlapping full-back |
| Inverting Outlet Winger | OOP | Stays high, tucks in on the counter |
| Tracking Winger | OOP | Tracks back and supports the defence |
| Wide Outlet Winger | OOP | Stays high, no defensive duty |
| Wide Playmaker | IP | Creates space, tucks in |
| Wide Forward | IP | Wide, stretches the opponent, runs in behind |
| Inside Forward | IP | Cuts inside centrally and attacks |

### Striker
| Role | Phase | Behaviour |
|---|---|---|
| False Nine | IP | Drops to AM, creates space, link-up |
| Deep-Lying Forward | IP | Connects midfield and attack |
| Half-Space Forward | IP | Wide, cuts in to score |
| Second Striker | IP | Drops into space, runs in behind |
| Channel Forward | IP | Runs into the channels/half-spaces |
| Centre Forward | Hybrid | Classic number 9, leads the line |
| Central Outlet CF | OOP | Stays high, almost no defensive duty |
| Splitting Outlet CF | OOP | Stays high, drives into wide areas |
| Tracking CF | OOP | Tracks back, counter focus |
| Target Forward | Hybrid | Physical reference point, dangerous in the air |

---

## 2. Team instructions

### In Possession

**Overview**
| Instruction | Options | Effect |
|---|---|---|
| Passing Directness | Much Shorter / Shorter / Balanced / More Direct / Much More Direct | Pass length and how quickly the ball goes forward |
| Tempo | Lower / Standard / Higher | How quickly the ball is moved and decisions are made |
| Time Wasting | Less Often / Standard / More Often | Time wasting, mainly when leading late |
| Attacking Transition | Counter-Attack / Standard / Patient Build-Up | What happens right after the ball is won |
| Attacking Width | Much Narrower / Narrower / Standard / Wider / Much Wider | How spread out the team attacks |
| Creative Freedom | More Disciplined / Balanced / More Expressive | Freedom for risk and creative actions |
| Play for Set Pieces | Keep Ball in Play / Standard | Whether the team chases set pieces or keeps the ball |

**Build-Up**
| Instruction | Options | Effect |
|---|---|---|
| Build-Up Strategy | Play Through Press / Mixed / Direct | Build-up strategy against the press |
| Goal Kicks | Short / Mixed / Long | How the keeper takes goal kicks |
| GK Distribution (Speed) | Slower / Balanced / Faster | How quickly the keeper distributes |
| GK Distribution (Target) | Centre-Backs / Full-Backs / Midfielders / Forwards | Who the keeper aims for |

**Progression**
| Instruction | Options | Effect |
|---|---|---|
| Pass Reception | Balanced / Overlapped | How players position to receive |
| Dribbling | Reduced / Balanced / Encouraged | How often players carry past opponents |
| Supporting Runs | Both Flanks / One Flank / Balanced | Where supporting runs come from |
| Progress Through | Left / Balanced / Right | Which side is preferred to progress through |

**Final Third**
| Instruction | Options | Effect |
|---|---|---|
| Patience | Work Ball Into Box / Balanced / Less Often | How patient in the final third |
| Shots from Distance | Reduced / Balanced / Encouraged | How often players shoot from distance |
| Crossing Style | Low Crosses / Balanced / High Crosses | Cross type |
| *(also Dribbling + Pass Reception here)* | | |

### Out of Possession

**Overview**
| Instruction | Options | Effect |
|---|---|---|
| Line of Engagement | High Press / Mid Block / Low Block | Where on the pitch you start defending/pressing — most important defensive instruction |
| Defensive Line | Deeper / Standard / Higher / Much Higher | How high the defensive line sits |
| Defensive Line Behaviour | Balanced / Offside Trap / Step Up | How the line moves and reacts |
| Trigger Press | Less Often / Balanced / More Often | How often you actively press the ball carrier |
| Defensive Transition | Counter-Press / Standard / Regroup | What happens right after the ball is lost |
| Tackling | Ease Off / Standard / Aggressive | How hard players tackle |

**High Press**
| Instruction | Options | Effect |
|---|---|---|
| Pressing Trap | Balanced / Active | Coordinated pressing traps |
| Short Goalkeeper Distribution | Yes / No | Whether you press the opponent's keeper |

**Mid Block / Low Block**
| Instruction | Options | Effect |
|---|---|---|
| Cross Engagement | Hold Position / Balanced / Contest | How aggressively you defend crosses |
| Pressing Trap | Balanced / Active | Coordinated pressing traps |

**Important dependencies** (for an engine validation rule): High Press pairs with Higher
Defensive Line; Low Block with Deeper. Counter-Press belongs to High Press/Higher line;
Regroup to Low Block/Deeper. Play Through Press requires Short Goal Kicks; Direct requires Long.

---

## 3. Player instructions (individual)

In FM26 the hard-coded role instructions are cut to a minimum, so **more of the fine-tuning now
lives in individual player instructions**. They are layered per player on top of the role and are
exactly the "modifier layer" from the data model.

Known types (group them this way in `instructions.ts`):

- **In possession – passing/finishing:** more/less passing risk, dribble more/less, shoot less,
  cross from the byline, line-breaking/progressive passes.
- **In possession – movement:** get further forward, stay wider, stay narrower, roam from
  position, hold position, move into channels.
- **Out of possession:** mark tighter, tackle harder, close down more/less often, step out
  aggressively, drop deeper and sweep up.

> The full, exhaustive list of individual instructions should be verified directly in FM26, as it
> is role-/position-dependent (different roles unlock different instructions) and is not cleanly
> documented externally. Treat the above as the categories the modifier layer must accommodate,
> not as a complete enumeration.

---

## 4. How the system uses it

- `lib/roles.ts` holds each role as a record: `{ name, position, phase, behaviour }` + (later)
  the Visualizer-measured offsets per third.
- `lib/instructions.ts` holds team instructions as phase-grouped enums with their options, plus
  the player-instruction categories as the modifier layer.
- The engine matches a drawn position against roles in the same position+phase; instructions
  adjust offsets and explain *why* (e.g. "narrower → pulls wide roles toward the centre").

**Remember:** this file is the vocabulary. The coordinates come from the Visualizer — that is
still the work that makes the product credible.
