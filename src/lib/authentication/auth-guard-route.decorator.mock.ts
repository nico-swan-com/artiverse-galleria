/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Provides a mock decorator that performs no authentication checks.
 *
 * Use this as a placeholder for the actual `AuthGuardRoute` decorator in testing or development environments where authentication is not required.
 */
export function AuthGuardRoute() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // Do nothing.  This is a mock.
  }
}
