const labelBadInput = 'Bad Input';
const labelPatternMismatch = 'Pattern Mismatch';
const labelRangeOverflow = 'Range Overflow';
const labelRangeUnderflow = 'Range Undeflow';
const labelStepMismatch = 'Step Mismatch';
const labelTooLong = 'Too Long';
const labelTooShort = 'Too Short';
const labelTypeMismatch = 'Type Mismatch';
const labelValueMissing = 'Value Missing';
const labelSelectAtleastOneValue = 'Select at least one';
import { reflectAttribute } from 'lex/utilsPrivate';

const constraintsSortedByPriority = [
    'customError',
    'badInput',
    'patternMismatch',
    'rangeOverflow',
    'rangeUnderflow',
    'stepMismatch',
    'tooLong',
    'tooShort',
    'typeMismatch',
    'valueMissing',
    'selectAtleastOneValue',
];

const defaultLabels = {
    badInput: labelBadInput,
    customError: labelBadInput,
    patternMismatch: labelPatternMismatch,
    rangeOverflow: labelRangeOverflow,
    rangeUnderflow: labelRangeUnderflow,
    stepMismatch: labelStepMismatch,
    tooLong: labelTooLong,
    tooShort: labelTooShort,
    typeMismatch: labelTypeMismatch,
    valueMissing: labelValueMissing,
    selectAtleastOneValue: labelSelectAtleastOneValue,
};

function resolveBestMatch(validity) {
    let validityState;
    if (validity && validity.valid === false) {
        validityState = 'badInput';
        constraintsSortedByPriority.some((stateName) => {
            if (validity[stateName] === true) {
                validityState = stateName;
                return true;
            }
            return false;
        });
    }
    return validityState;
}

function computeConstraint(valueProvider, constraint) {
    const provider = valueProvider[constraint];
    if (typeof provider === 'function') {
        return provider();
    }
    if (typeof provider === 'boolean') {
        return provider;
    }
    return false;
}

// We're doing the below to avoid exposing the constraintsProvider in the ValidityState
function newValidityState(constraintsProvider) {
    class ValidityState {
        get valueMissing() {
            return computeConstraint(constraintsProvider, 'valueMissing');
        }

        get typeMismatch() {
            return computeConstraint(constraintsProvider, 'typeMismatch');
        }

        get patternMismatch() {
            return computeConstraint(constraintsProvider, 'patternMismatch');
        }

        get tooLong() {
            return computeConstraint(constraintsProvider, 'tooLong');
        }

        get tooShort() {
            return computeConstraint(constraintsProvider, 'tooShort');
        }

        get rangeUnderflow() {
            return computeConstraint(constraintsProvider, 'rangeUnderflow');
        }

        get rangeOverflow() {
            return computeConstraint(constraintsProvider, 'rangeOverflow');
        }

        get stepMismatch() {
            return computeConstraint(constraintsProvider, 'stepMismatch');
        }

        get customError() {
            return computeConstraint(constraintsProvider, 'customError');
        }

        get badInput() {
            return computeConstraint(constraintsProvider, 'badInput');
        }
        get selectAtleastOneValue() {
            return computeConstraint(
                constraintsProvider,
                'validitySelectAtleastOneValue'
            );
        }

        get valid() {
            return !(
                this.valueMissing ||
                this.typeMismatch ||
                this.patternMismatch ||
                this.tooLong ||
                this.tooShort ||
                this.rangeUnderflow ||
                this.rangeOverflow ||
                this.stepMismatch ||
                this.customError ||
                this.badInput ||
                this.selectAtleastOneValue
            );
        }
    }

    return new ValidityState();
}

export function buildSyntheticValidity(constraintProvider) {
    return Object.freeze(newValidityState(constraintProvider));
}

export function getErrorMessage(validity, labelMap) {
    const key = resolveBestMatch(validity);
    if (key) {
        return labelMap[key] ? labelMap[key] : defaultLabels[key];
    }
    return '';
}

export class FieldConstraintApi {
    constructor(inputComponentProvider, constraintProviders) {
        this._inputComponentProvider = inputComponentProvider;
        this._constraintsProvider = Object.assign({}, constraintProviders);
        if (!this._constraintsProvider.customError) {
            this._constraintsProvider.customError = () =>
                typeof this._customValidityMessage === 'string' &&
                this._customValidityMessage !== '';
        }
    }

    get validity() {
        if (!this._constraint) {
            this._constraint = buildSyntheticValidity(
                this._constraintsProvider
            );
        }

        return this._constraint;
    }

    checkValidity() {
        const isValid = this.validity.valid;
        if (!isValid) {
            if (this.inputComponent) {
                this.inputComponent.dispatchEvent(
                    new CustomEvent('invalid', { cancellable: true })
                );
            }
        }
        return isValid;
    }

    reportValidity(callback) {
        const valid = this.checkValidity();

        // the input might have been removed from the DOM by the time we query it
        if (this.inputComponent) {
            this.inputComponent.classList.toggle('slds-has-error', !valid);
            reflectAttribute(this.inputComponent, 'invalid', !valid);

            if (callback) {
                callback(this.validationMessage);
            }
        }

        return valid;
    }

    setCustomValidity(message) {
        this._customValidityMessage = message;
    }

    get validationMessage() {
        return getErrorMessage(this.validity, {
            customError: this._customValidityMessage,
            badInput: this.inputComponent.messageWhenBadInput,
            patternMismatch: this.inputComponent.messageWhenPatternMismatch,
            rangeOverflow: this.inputComponent.messageWhenRangeOverflow,
            rangeUnderflow: this.inputComponent.messageWhenRangeUnderflow,
            stepMismatch: this.inputComponent.messageWhenStepMismatch,
            tooShort: this.inputComponent.messageWhenTooShort,
            tooLong: this.inputComponent.messageWhenTooLong,
            typeMismatch: this.inputComponent.messageWhenTypeMismatch,
            valueMissing: this.inputComponent.messageWhenValueMissing,
            selectAtleastOneValue: this.inputComponent.messageWhenValueMissing,
        });
    }

    get inputComponent() {
        if (!this._inputComponentElement) {
            this._inputComponentElement = this._inputComponentProvider();
        }
        return this._inputComponentElement;
    }
}

export class FieldConstraintApiWithProxyInput {
    constructor(inputComponent, overrides = {}, inputElementName = 'input') {
        this._inputComponent = inputComponent;
        this._overrides = overrides;
        this._proxyInput = document.createElement(inputElementName);
    }

    setInputAttributes(attributes) {
        this._attributes = attributes;

        this._attributeUpdater = (attributeNames) => {
            if (!attributes) {
                return;
            }
            if (typeof attributeNames === 'string') {
                this._setAttribute(
                    attributeNames,
                    attributes[attributeNames]()
                );
            } else {
                attributeNames.forEach((attributeName) => {
                    this._setAttribute(
                        attributeName,
                        attributes[attributeName]()
                    );
                });
            }
        };
        return this._attributeUpdater;
    }

    get validity() {
        return this._constraintApi.validity;
    }

    checkValidity() {
        return this._constraintApi.checkValidity();
    }

    reportValidity(callback) {
        return this._constraintApi.reportValidity(callback);
    }

    setCustomValidity(message) {
        this._constraintApi.setCustomValidity(message);
        this._proxyInput.setCustomValidity(message);
    }

    get validationMessage() {
        return this._constraintApi.validationMessage;
    }

    _setAttribute(attributeName, value) {
        if (value !== null && value !== undefined && value !== false) {
            if (attributeName === 'value') {
                if (this._proxyInput.type === 'file') {
                    // Can't set value on file
                    return;
                }
                this._proxyInput.value = value;
            } else {
                this._proxyInput.setAttribute(attributeName, value);
            }
        } else {
            this._removeAttribute(attributeName);
        }
    }

    _removeAttribute(attributeName) {
        this._proxyInput.removeAttribute(attributeName);
    }

    get _constraintApi() {
        if (!this._privateConstraintApi) {
            this._updateAllAttributes();

            const computeConstraintWithProxyInput = (constraintName) => {
                const constraintOverride = this._overrides[constraintName];

                const isDisabledOrReadOnly =
                    this._proxyInput.hasAttribute('disabled') ||
                    this._proxyInput.hasAttribute('readonly');

                if (typeof constraintOverride === 'function') {
                    return !isDisabledOrReadOnly && constraintOverride();
                }

                // Firefox incorrectly computes rangeUnderflow for disabled and readonly inputs, so we're adding
                // a check here instead to always return false when the input has readonly or disabled attributes set
                return (
                    !isDisabledOrReadOnly &&
                    this._proxyInput.validity[constraintName]
                );
            };
            const constraintsProvider = constraintsSortedByPriority.reduce(
                (provider, constraint) => {
                    provider[constraint] = computeConstraintWithProxyInput.bind(
                        this,
                        constraint
                    );
                    return provider;
                },
                {}
            );

            this._privateConstraintApi = new FieldConstraintApi(
                this._inputComponent,
                constraintsProvider
            );
        }
        return this._privateConstraintApi;
    }

    _updateAllAttributes() {
        if (this._attributes) {
            Object.entries(this._attributes).forEach(([key, valueFunction]) => {
                this._setAttribute(key, valueFunction());
            });
        }
    }
}
