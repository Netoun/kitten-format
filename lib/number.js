import { getLocale } from './options';

var registerdFormatters = {};

/**
 * Get formatter instance
 * @param {String} locale ex: 'fr-FR'
 * @param {String} currency ex: 'EUR'
 * @param {Int} precision ex: 2
 * @returns {Intl}
 */
function getFormatter (locale, precision) {
  var _key = locale + ':' + precision;
  if (!registerdFormatters[_key]) {
    registerdFormatters[_key] = new Intl.NumberFormat(locale, {
      maximumFractionDigits : precision
    });
  }

  return registerdFormatters[_key];
}

/**
 * Format number
 * @param {Number} value
 * @param {Object} options
 * @return {String}
 */
export function formatN (value, options) {
  if (value === undefined || value === null) {
    return value
  }

  if (typeof value === 'string' && isNaN(value)) {
    return '-';
  }

  options = options || {};

  var _localeOptions = getLocale(options.locale);
  var _precision     = options.precision || _localeOptions.precision;
  var _locale        = options.locale    || _localeOptions.locale;

  return getFormatter(_locale, _precision).format(value);
}

/**
 * Average a number
 * @param {Number} value
 * @param {Object} options
 * @returns {String}
 */
export function averageN (value, options) {
  if (value === undefined || value === null) {
    return value;
  }

  if (typeof value === 'string' && isNaN(value)) {
    return '-';
  }

  options = options || {};

  var _power = options.power === null || options.power === undefined ? 0 : options.power;
  var _unit  = options.unit;

  if (!_unit) {
    return value;
  }

  var _value        = value;
  var _averagePower = 0;
  var _displayPower = null;

  if (value >= 1) {
    var _valueStr    = (value + '').split('.')[0];
    var _valueLength = _valueStr.length;
    _averagePower    = Math.trunc(_valueLength / 3) * 3;

    if ((options.maxPower !== null && options.maxPower !== undefined) && _averagePower + _power > options.maxPower) {
      _displayPower = options.maxPower - _power;
    }

    _value = value * Math.pow(10, -(_displayPower !== null ?_displayPower : _averagePower));
  }

  if (_value < 1) {
    _value = _value * Math.pow(10, 3);
    _power -= 3;

    if (_power === -0) {
      _power = 0;
    }
  }

  var _localeOptions = getLocale(options.locale);
  var _unitPrefixes  = _localeOptions.unitPrefixes;
  var _result        = formatN(_value, options);

  var _unitPrefix = _unitPrefixes[(_displayPower !== null ? _displayPower : _averagePower) + _power];

  if (_unitPrefix === undefined) {
    _unitPrefix = '10^' + (_averagePower + _power) + _unit;
  }
  else if (typeof _unitPrefix !== 'string') {
    _unitPrefix = _unitPrefix[_unit] || _unitPrefix.default;
  }
  else {
    _unitPrefix += _unit;
  }

  return _result + ' ' + _unitPrefix;
}

/**
 * Set a number as a percentage
 * @param {Number} value
 * @param {Object} options
 */
export function percent (value, options) {
  if (value === undefined || value === null) {
    return value;
  }

  if (typeof value === 'string' && isNaN(value)) {
    return '-';
  }

  var _value = value * 100;

  if (value > 1) {
    _value = value;
  }

  return formatN(_value, options) + '%';
}
