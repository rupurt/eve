/**
 * Thrown from the core reactor
 *
 * e.g. when the reactor is ticked without being started
 *
 */
class ReactorError extends Error {}

class NotImplementedError extends Error {}

export { ReactorError, NotImplementedError };
