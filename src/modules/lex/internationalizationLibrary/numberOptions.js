// TODO: remove file when migrating off aura
const numberFormat = "";
const percentFormat = "";
const currencyFormat = "";
const currency = "";
import {
    STYLE,
    updateFractionPart,
    updateIntegerPart,
    updateCurrencySymbol,
    getCurrency,
} from './numberUtils';

const isDefaultCurrency = (options) => {
    return !options.currency || currency === options.currency;
};

const getDefaultSkeleton = (options) => {
    if (options.style === STYLE.CURRENCY) {
        return currencyFormat;
    } else if (options.style === STYLE.PERCENT) {
        return percentFormat;
    }
    return numberFormat;
};

/**
 * Function translating provided number formatting options to a
 * string that can be passed into Aura localization service.
 *
 * @param {Object} options - number formatting options
 * @returns {string} representing provided options as a string -
 * e.g. "$#,##,##0.00#"
 */
export const getSkeleton = (options) => {
    const defaultSkeleton = getDefaultSkeleton(options);
    let skeleton = updateFractionPart(defaultSkeleton, options);
    skeleton = updateIntegerPart(skeleton, options);
    if (!isDefaultCurrency(options)) {
        skeleton = updateCurrencySymbol(
            skeleton,
            getCurrency(options),
            options
        );
    }
    return skeleton;
};
