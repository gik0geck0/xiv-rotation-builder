export const VARIANT = {
    STANDARD: 'standard',
    LABEL_HIDDEN: 'label-hidden',
    LABEL_STACKED: 'label-stacked',
    LABEL_INLINE: 'label-inline',
};

/**
A variant normalization utility for attributes.
@param {Any} value - The value to normalize.
@return {Boolean} - The normalized value.
**/
export function normalizeVariant(value) {
    return value;
}

export function normalizeInput(value) {
    if (typeof value === 'number' || typeof value === 'string') {
        return String(value);
    }
    return '';
}
