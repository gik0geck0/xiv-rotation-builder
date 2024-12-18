const locale = navigator.languages[0];

const NA_PHONE_NUMBER = '($1) $2-$3';
const IS_TEN_DIGITS = /^\d{10}$/;
const TEN_TO_NA = /(\d{3})(\d{3})(\d{4})/;
const IS_ELEVEN_DIGITS = /^1\d{10}$/;
const ELEVEN_TO_NA = /1(\d{3})(\d{3})(\d{4})$/;

// The locale argument has been added for tests since there's currently no clean way of mocking the locale
export function toNorthAmericanPhoneNumber(value, userLocale) {
    if (!isNorthAmericanCountry(userLocale || locale)) {
        return value;
    }
    if (IS_TEN_DIGITS.test(value)) {
        return value.replace(TEN_TO_NA, NA_PHONE_NUMBER);
    } else if (IS_ELEVEN_DIGITS.test(value)) {
        return value.replace(ELEVEN_TO_NA, NA_PHONE_NUMBER);
    }
    return value || '';
}

function isNorthAmericanCountry(userLocale) {
    const localeCountry = getLocaleCountry(userLocale);
    if (localeCountry === 'US' || localeCountry === 'CA') {
        return true;
    }
    return false;
}

function getLocaleCountry(userLocale) {
    if (!userLocale) {
        // just adding a guard in case locale is undefined
        return null;
    }
    const [, country] = userLocale.split('-');
    return country;
}
