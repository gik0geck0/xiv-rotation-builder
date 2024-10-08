const currency = "";
const locale = navigator.languages[0];
import { getNumberFormat } from 'lightning/i18nService';
import { numberFormatFallback } from './numberFormatFallback';
import { exceedsSafeLength } from './numberUtils';
import { isAuraL10NAvailable } from './utils';

export function numberFormat(options) {
    const currencyValue = { currency: options.currency || currency };
    const normalizedOpts = Object.assign({}, options, currencyValue);
    return {
        format: (value) => {
            // TODO: when migrating off aura just use getNumberFormat directly
            // TD-0117848 will need to be completed before migrating off
            // aura fallback should only be used when aura is available and value has
            // too many significant digits to work correctly with localizer
            const useFallback =
                isAuraL10NAvailable && value && exceedsSafeLength(value);
            const numberFormatter = useFallback
                ? numberFormatFallback(normalizedOpts)
                : getNumberFormat(locale, normalizedOpts);
            return numberFormatter.format(value);
        },
    };
}
