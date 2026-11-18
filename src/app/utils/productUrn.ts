const PRODUCT_SPEC_URN_PREFIX = 'urn:ngsi-ld:product-specification:';

/**
 * Marketplace product id as a product-specification URN, prefixed exactly once.
 * Requests stored before intake started stripping the prefix keep the full URN in id_PO;
 * adding the prefix blindly sent the label to a product id that doesn't exist.
 */
export function productSpecUrn(idPO: string): string {
  let id = (idPO ?? '').trim();
  while (id.startsWith(PRODUCT_SPEC_URN_PREFIX)) id = id.slice(PRODUCT_SPEC_URN_PREFIX.length);
  return PRODUCT_SPEC_URN_PREFIX + id;
}
