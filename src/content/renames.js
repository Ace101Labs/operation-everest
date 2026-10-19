// Stage ids are saved in every player's progress, so they must never change silently.
// If a stage is ever renamed, add 'old-id': 'new-id' here and progress moves across on load.
// If a stage is retired, map it to the stage that replaces it. The content check fails the
// build if any id from scripts/stage-ids.json disappears without an entry here.
export const RENAMES = {}
