export type OAuthProviderType = 'google' | 'facebook' | 'linkedin';

const symbolSeparation = '@';

/**
 * Represents an external ID associated with an OAuth provider.
 * This class encapsulates the provider type and the unique identifier (ID) provided by the OAuth provider.
 * It provides a static method to parse an external ID from a string and methods to retrieve the ID and provider type.
 *
 * The external ID string is expected to be in the format: `<providerType><symbolSeparation><id>`
 * where `<symbolSeparation>` is a delimiter separating the provider type and the ID and equals to '@'.
 *
 * Example usage:
 * const externalId = OUauthExternalId.fromString("google@12345");
 * console.log(externalId.getProviderType()); // Output: "google"
 * console.log(externalId.getId()); // Output: "12345"
 *
 * @class OUauthExternalId
 */
export class OUauthExternalId {
  private providerType: OAuthProviderType;
  private id: string;

  constructor(providerType: OAuthProviderType, id: string) {
    this.id = id;
    this.providerType = providerType;
  }
  static fromString(input: string) {
    const idx = input.indexOf(symbolSeparation);
    if (idx <= 0 || idx === input.length - 1) {
      throw new Error('Failed to parse externalId from string because of invalid format');
    }
    return new OUauthExternalId(
      input.substring(0, idx - 1) as OAuthProviderType,
      input.substring(idx + 1, input.length - 1)
    );
  }

  public toString() {
    return `${this.providerType}${symbolSeparation}${this.id}`;
  }

  public getId() {
    return this.id;
  }
  public getProviderType() {
    return this.providerType;
  }
}
