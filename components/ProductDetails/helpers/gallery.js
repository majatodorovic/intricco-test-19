export const getCurrentGalleryByVariantKeys = ({
  variantKeys,
  productGallery,
}) => {
  let currentGallery = productGallery.gallery.filter((gallery) => {
    const allMatchs = variantKeys?.every((variantKey) =>
      gallery.variant_key_array.some(
        (variant) =>
          variant.attribute_key === variantKey.attribute_key &&
          variant.value_key === variantKey.value_key
      )
    );

    return allMatchs;
  });
  return currentGallery;
};
