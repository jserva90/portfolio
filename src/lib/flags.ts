/**
 * Feature flags for the playful LEGO easter eggs.
 *
 * Both default to `true`, which HIDES the feature site-wide: the code stays
 * in place but the behaviour (and any hints pointing at it) are disabled.
 * Flip a flag to `false` to bring the effect back.
 */

/** Hide the click-to-drop bricks in the hero (BrickField). */
export const HIDE_HERO_BRICK_DROP = true;

/**
 * Hide "build mode": typing `lego` to rain bricks over the page, and the
 * ⌘K "Make it rain bricks" command.
 */
export const HIDE_BUILD_MODE = true;

/**
 * Whether I'm currently open to new roles. When `false`, the "Available"
 * badges (on the contact section and the CV) are hidden — flip to `true`
 * if I'm job-seeking again.
 */
export const SEEKING_JOB = false;
