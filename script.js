// Professional Currency Converter Application
// Enhanced with modern features and better UX

// Get references to HTML elements
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convert-btn');
const resultDiv = document.getElementById('result');
const exchangeRateDiv = document.getElementById('exchange-rate');
const lastUpdatedDiv = document.getElementById('last-updated');
const swapBtn = document.getElementById('swap-btn');
const fromSymbol = document.getElementById('from-symbol');

// Currency symbols mapping for display - comprehensive list
const currencySymbols = {
  'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CHF': '₣',
  'CAD': 'C$', 'AUD': 'A$', 'CNY': '¥', 'INR': '₹', 'KRW': '₩',
  'SEK': 'kr', 'NOK': 'kr', 'DKK': 'kr', 'PLN': 'zł', 'CZK': 'Kč',
  'HUF': 'Ft', 'RUB': '₽', 'BRL': 'R$', 'MXN': '$', 'SGD': 'S$',
  'NZD': 'NZ$', 'THB': '฿', 'TRY': '₺', 'ZAR': 'R', 'ILS': '₪',
  'AED': 'د.إ', 'SAR': '﷼', 'QAR': '﷼', 'KWD': 'د.ك', 'BHD': '.د.ب',
  'OMR': '﷼', 'JOD': 'د.ا', 'EGP': '£', 'LBP': '£', 'SYP': '£',
  'IQD': 'ع.د', 'IRR': '﷼', 'AFN': '؋', 'PKR': '₨', 'BDT': '৳',
  'LKR': '₨', 'NPR': '₨', 'BTN': 'Nu.', 'MVR': '.ރ', 'MMK': 'Ks',
  'LAK': '₭', 'KHR': '៛', 'VND': '₫', 'IDR': 'Rp', 'MYR': 'RM',
  'PHP': '₱', 'TWD': 'NT$', 'HKD': 'HK$', 'MOP': 'MOP$', 'BND': 'B$',
  'FJD': 'FJ$', 'PGK': 'K', 'SBD': 'SI$', 'VUV': 'VT', 'WST': 'WS$',
  'TOP': 'T$', 'MNT': '₮', 'KPW': '₩', 'KZT': '₸', 'UZS': 'лв',
  'KGS': 'лв', 'TJS': 'SM', 'TMT': 'T', 'AZN': '₼', 'GEL': '₾',
  'AMD': '֏', 'UAH': '₴', 'BYN': 'Br', 'MDL': 'L', 'RON': 'lei',
  'BGN': 'лв', 'HRK': 'kn', 'RSD': 'Дин.', 'MKD': 'ден', 'ALL': 'L',
  'BAM': 'KM', 'ISK': 'kr', 'ARS': '$', 'BOB': '$b', 'CLP': '$',
  'COP': '$', 'PEN': 'S/', 'UYU': '$U', 'PYG': 'Gs', 'VES': 'Bs',
  'GYD': '$', 'SRD': '$', 'TTD': 'TT$', 'BBD': '$', 'JMD': 'J$',
  'BSD': '$', 'BZD': 'BZ$', 'GTQ': 'Q', 'HNL': 'L', 'NIO': 'C$',
  'CRC': '₡', 'PAB': 'B/.', 'DOP': 'RD$', 'HTG': 'G', 'CUP': '₱',
  'XCD': '$', 'AWG': 'ƒ', 'ANG': 'ƒ', 'BMD': '$', 'KYD': '$',
  'NGN': '₦', 'GHS': '¢', 'KES': 'KSh', 'UGX': 'USh', 'TZS': 'TSh',
  'ETB': 'Br', 'MUR': '₨', 'BWP': 'P', 'XOF': 'CFA', 'XAF': 'FCFA',
  'MAD': 'MAD', 'TND': 'د.ت', 'DZD': 'دج', 'LYD': 'ل.د', 'SDG': 'ج.س.',
  'SOS': 'S', 'DJF': 'Fdj', 'ERN': 'Nfk', 'CDF': 'FC', 'AOA': 'Kz',
  'ZMW': 'ZK', 'ZWL': 'Z$', 'MWK': 'MK', 'MZN': 'MT', 'SZL': 'E',
  'LSL': 'M', 'NAD': 'N$', 'MGA': 'Ar', 'KMF': 'CF', 'SCR': '₨',
  'CVE': '$', 'STD': 'Db', 'GNF': 'GNF', 'SLL': 'Le', 'LRD': 'L$',
  'GMD': 'D', 'MRT': 'UM', 'RWF': 'R₣', 'BIF': 'FBu'
};

// Popular currencies for quick access
const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'KRW'];

// Cache for currency data
let currencyCache = null;
let lastUpdateTime = null;

// Initialize application
window.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
  loadCurrencies();
  setupEventListeners();
  setDefaultCurrencies();
  updateCurrencySymbol();
}

function setupEventListeners() {
  // Convert button
  convertBtn.addEventListener('click', handleConversion);
  
  // Enter key on amount input
  amountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleConversion();
    }
  });
  
  // Swap currencies
  swapBtn.addEventListener('click', swapCurrencies);
  
  // Update currency symbol when from currency changes
  fromCurrency.addEventListener('change', updateCurrencySymbol);
  
  // Real-time conversion on input change (with debounce)
  let debounceTimer;
  amountInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (amountInput.value && fromCurrency.value && toCurrency.value) {
        handleConversion();
      }
    }, 500);
  });
}

async function loadCurrencies() {
  try {
    showLoadingState();
    
    // Try multiple APIs for better reliability
    const apis = [
      'https://api.exchangerate-api.com/v4/latest/USD',
      'https://api.fixer.io/latest?access_key=demo',
      'https://open.er-api.com/v6/latest/USD'
    ];
    
    let currencyData = null;
    
    // Try each API until one works
    for (const apiUrl of apis) {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.rates) {
          // Convert rates to symbols format
          currencyData = {};
          Object.keys(data.rates).forEach(code => {
            currencyData[code] = { 
              description: getCurrencyName(code),
              code: code
            };
          });
          
          // Add the base currency (USD) if not present
          if (!currencyData['USD']) {
            currencyData['USD'] = { description: 'US Dollar', code: 'USD' };
          }
          
          break;
        }
      } catch (err) {
        console.log(`API ${apiUrl} failed, trying next...`);
        continue;
      }
    }
    
    if (currencyData) {
      currencyCache = currencyData;
      populateCurrencyDropdowns(currencyData);
      lastUpdateTime = new Date();
      updateLastUpdatedTime();
    } else {
      throw new Error('All APIs failed');
    }
  } catch (error) {
    console.error('Error loading currencies:', error);
    // Load comprehensive fallback currencies
    loadComprehensiveFallbackCurrencies();
  }
}

function loadFallbackCurrencies() {
  const fallbackCurrencies = {
    'USD': { description: 'US Dollar' },
    'EUR': { description: 'Euro' },
    'GBP': { description: 'British Pound' },
    'JPY': { description: 'Japanese Yen' },
    'CAD': { description: 'Canadian Dollar' },
    'AUD': { description: 'Australian Dollar' },
    'CHF': { description: 'Swiss Franc' },
    'CNY': { description: 'Chinese Yuan' },
    'INR': { description: 'Indian Rupee' }
  };
  
  populateCurrencyDropdowns(fallbackCurrencies);
  currencyCache = fallbackCurrencies;
}

function loadComprehensiveFallbackCurrencies() {
  const comprehensiveCurrencies = {
    // Major Currencies
    'USD': { description: 'US Dollar' },
    'EUR': { description: 'Euro' },
    'GBP': { description: 'British Pound Sterling' },
    'JPY': { description: 'Japanese Yen' },
    'CHF': { description: 'Swiss Franc' },
    'CAD': { description: 'Canadian Dollar' },
    'AUD': { description: 'Australian Dollar' },
    'NZD': { description: 'New Zealand Dollar' },
    'CNY': { description: 'Chinese Yuan' },
    'INR': { description: 'Indian Rupee' },
    'KRW': { description: 'South Korean Won' },
    'SGD': { description: 'Singapore Dollar' },
    'HKD': { description: 'Hong Kong Dollar' },
    'SEK': { description: 'Swedish Krona' },
    'NOK': { description: 'Norwegian Krone' },
    'DKK': { description: 'Danish Krone' },
    'PLN': { description: 'Polish Zloty' },
    'CZK': { description: 'Czech Koruna' },
    'HUF': { description: 'Hungarian Forint' },
    'RUB': { description: 'Russian Ruble' },
    'BRL': { description: 'Brazilian Real' },
    'MXN': { description: 'Mexican Peso' },
    'ZAR': { description: 'South African Rand' },
    'TRY': { description: 'Turkish Lira' },
    'THB': { description: 'Thai Baht' },
    'MYR': { description: 'Malaysian Ringgit' },
    'IDR': { description: 'Indonesian Rupiah' },
    'PHP': { description: 'Philippine Peso' },
    'VND': { description: 'Vietnamese Dong' },
    'ILS': { description: 'Israeli New Shekel' },
    'AED': { description: 'UAE Dirham' },
    'SAR': { description: 'Saudi Riyal' },
    'QAR': { description: 'Qatari Riyal' },
    'KWD': { description: 'Kuwaiti Dinar' },
    'BHD': { description: 'Bahraini Dinar' },
    'OMR': { description: 'Omani Rial' },
    'JOD': { description: 'Jordanian Dinar' },
    'LBP': { description: 'Lebanese Pound' },
    'EGP': { description: 'Egyptian Pound' },
    'MAD': { description: 'Moroccan Dirham' },
    'TND': { description: 'Tunisian Dinar' },
    'DZD': { description: 'Algerian Dinar' },
    'NGN': { description: 'Nigerian Naira' },
    'GHS': { description: 'Ghanaian Cedi' },
    'KES': { description: 'Kenyan Shilling' },
    'UGX': { description: 'Ugandan Shilling' },
    'TZS': { description: 'Tanzanian Shilling' },
    'ETB': { description: 'Ethiopian Birr' },
    'MUR': { description: 'Mauritian Rupee' },
    'BWP': { description: 'Botswana Pula' },
    'XOF': { description: 'West African CFA Franc' },
    'XAF': { description: 'Central African CFA Franc' },
    'RON': { description: 'Romanian Leu' },
    'BGN': { description: 'Bulgarian Lev' },
    'HRK': { description: 'Croatian Kuna' },
    'RSD': { description: 'Serbian Dinar' },
    'MKD': { description: 'Macedonian Denar' },
    'ALL': { description: 'Albanian Lek' },
    'BAM': { description: 'Bosnia-Herzegovina Convertible Mark' },
    'MDL': { description: 'Moldovan Leu' },
    'UAH': { description: 'Ukrainian Hryvnia' },
    'BYN': { description: 'Belarusian Ruble' },
    'GEL': { description: 'Georgian Lari' },
    'AMD': { description: 'Armenian Dram' },
    'AZN': { description: 'Azerbaijani Manat' },
    'KZT': { description: 'Kazakhstani Tenge' },
    'UZS': { description: 'Uzbekistani Som' },
    'KGS': { description: 'Kyrgystani Som' },
    'TJS': { description: 'Tajikistani Somoni' },
    'TMT': { description: 'Turkmenistani Manat' },
    'AFN': { description: 'Afghan Afghani' },
    'PKR': { description: 'Pakistani Rupee' },
    'BDT': { description: 'Bangladeshi Taka' },
    'LKR': { description: 'Sri Lankan Rupee' },
    'NPR': { description: 'Nepalese Rupee' },
    'BTN': { description: 'Bhutanese Ngultrum' },
    'MVR': { description: 'Maldivian Rufiyaa' },
    'MMK': { description: 'Myanmar Kyat' },
    'LAK': { description: 'Laotian Kip' },
    'KHR': { description: 'Cambodian Riel' },
    'BND': { description: 'Brunei Dollar' },
    'TWD': { description: 'Taiwan New Dollar' },
    'MOP': { description: 'Macanese Pataca' },
    'MNT': { description: 'Mongolian Tugrik' },
    'KPW': { description: 'North Korean Won' },
    'FJD': { description: 'Fijian Dollar' },
    'PGK': { description: 'Papua New Guinean Kina' },
    'SBD': { description: 'Solomon Islands Dollar' },
    'VUV': { description: 'Vanuatu Vatu' },
    'WST': { description: 'Samoan Tala' },
    'TOP': { description: 'Tongan Paʻanga' },
    'ARS': { description: 'Argentine Peso' },
    'BOB': { description: 'Bolivian Boliviano' },
    'CLP': { description: 'Chilean Peso' },
    'COP': { description: 'Colombian Peso' },
    'PEN': { description: 'Peruvian Sol' },
    'UYU': { description: 'Uruguayan Peso' },
    'PYG': { description: 'Paraguayan Guarani' },
    'VES': { description: 'Venezuelan Bolívar' },
    'GYD': { description: 'Guyanese Dollar' },
    'SRD': { description: 'Surinamese Dollar' },
    'TTD': { description: 'Trinidad and Tobago Dollar' },
    'BBD': { description: 'Barbadian Dollar' },
    'JMD': { description: 'Jamaican Dollar' },
    'BSD': { description: 'Bahamian Dollar' },
    'BZD': { description: 'Belize Dollar' },
    'GTQ': { description: 'Guatemalan Quetzal' },
    'HNL': { description: 'Honduran Lempira' },
    'NIO': { description: 'Nicaraguan Córdoba' },
    'CRC': { description: 'Costa Rican Colón' },
    'PAB': { description: 'Panamanian Balboa' },
    'DOP': { description: 'Dominican Peso' },
    'HTG': { description: 'Haitian Gourde' },
    'CUP': { description: 'Cuban Peso' },
    'XCD': { description: 'East Caribbean Dollar' },
    'AWG': { description: 'Aruban Florin' },
    'ANG': { description: 'Netherlands Antillean Guilder' },
    'BMD': { description: 'Bermudian Dollar' },
    'KYD': { description: 'Cayman Islands Dollar' },
    'ISK': { description: 'Icelandic Króna' },
    'FOK': { description: 'Faroese Króna' },
    'IQD': { description: 'Iraqi Dinar' },
    'IRR': { description: 'Iranian Rial' },
    'YER': { description: 'Yemeni Rial' },
    'SYP': { description: 'Syrian Pound' },
    'LYD': { description: 'Libyan Dinar' },
    'SDG': { description: 'Sudanese Pound' },
    'SOS': { description: 'Somali Shilling' },
    'DJF': { description: 'Djiboutian Franc' },
    'ERN': { description: 'Eritrean Nakfa' },
    'CDF': { description: 'Congolese Franc' },
    'AOA': { description: 'Angolan Kwanza' },
    'ZMW': { description: 'Zambian Kwacha' },
    'ZWL': { description: 'Zimbabwean Dollar' },
    'MWK': { description: 'Malawian Kwacha' },
    'MZN': { description: 'Mozambican Metical' },
    'SZL': { description: 'Swazi Lilangeni' },
    'LSL': { description: 'Lesotho Loti' },
    'NAD': { description: 'Namibian Dollar' },
    'MGF': { description: 'Malagasy Franc' },
    'KMF': { description: 'Comorian Franc' },
    'SCR': { description: 'Seychellois Rupee' },
    'CVE': { description: 'Cape Verdean Escudo' },
    'STD': { description: 'São Tomé and Príncipe Dobra' },
    'GNF': { description: 'Guinean Franc' },
    'SLL': { description: 'Sierra Leonean Leone' },
    'LRD': { description: 'Liberian Dollar' },
    'CIV': { description: 'Ivorian Franc' },
    'BFA': { description: 'Burkinabé Franc' },
    'MLI': { description: 'Malian Franc' },
    'NER': { description: 'Nigerien Franc' },
    'SEN': { description: 'Senegalese Franc' },
    'GMD': { description: 'Gambian Dalasi' },
    'GWP': { description: 'Guinea-Bissau Peso' },
    'MRT': { description: 'Mauritanian Ouguiya' },
    'ECS': { description: 'Ecuadorian Sucre' },
    'SVC': { description: 'Salvadoran Colón' }
  };
  
  populateCurrencyDropdowns(comprehensiveCurrencies);
  currencyCache = comprehensiveCurrencies;
  showError('Using offline currency list. Exchange rates may not be available.');
}

function getCurrencyName(code) {
  const currencyNames = {
    'USD': 'US Dollar',
    'EUR': 'Euro',
    'GBP': 'British Pound Sterling',
    'JPY': 'Japanese Yen',
    'CHF': 'Swiss Franc',
    'CAD': 'Canadian Dollar',
    'AUD': 'Australian Dollar',
    'NZD': 'New Zealand Dollar',
    'CNY': 'Chinese Yuan',
    'INR': 'Indian Rupee',
    'KRW': 'South Korean Won',
    'SGD': 'Singapore Dollar',
    'HKD': 'Hong Kong Dollar',
    'SEK': 'Swedish Krona',
    'NOK': 'Norwegian Krone',
    'DKK': 'Danish Krone',
    'PLN': 'Polish Zloty',
    'CZK': 'Czech Koruna',
    'HUF': 'Hungarian Forint',
    'RUB': 'Russian Ruble',
    'BRL': 'Brazilian Real',
    'MXN': 'Mexican Peso',
    'ZAR': 'South African Rand',
    'TRY': 'Turkish Lira',
    'THB': 'Thai Baht',
    'MYR': 'Malaysian Ringgit',
    'IDR': 'Indonesian Rupiah',
    'PHP': 'Philippine Peso',
    'VND': 'Vietnamese Dong',
    'ILS': 'Israeli New Shekel',
    'AED': 'UAE Dirham',
    'SAR': 'Saudi Riyal',
    'QAR': 'Qatari Riyal',
    'KWD': 'Kuwaiti Dinar',
    'BHD': 'Bahraini Dinar',
    'OMR': 'Omani Rial',
    'JOD': 'Jordanian Dinar',
    'EGP': 'Egyptian Pound',
    'NGN': 'Nigerian Naira',
    'ARS': 'Argentine Peso',
    'CLP': 'Chilean Peso',
    'COP': 'Colombian Peso',
    'PEN': 'Peruvian Sol',
    'RON': 'Romanian Leu',
    'BGN': 'Bulgarian Lev',
    'UAH': 'Ukrainian Hryvnia',
    'PKR': 'Pakistani Rupee',
    'BDT': 'Bangladeshi Taka',
    'LKR': 'Sri Lankan Rupee',
    'MMK': 'Myanmar Kyat',
    'TWD': 'Taiwan New Dollar',
    'ISK': 'Icelandic Króna',
    'IQD': 'Iraqi Dinar',
    'IRR': 'Iranian Rial',
    'AFN': 'Afghan Afghani',
    'ALL': 'Albanian Lek',
    'AMD': 'Armenian Dram',
    'ANG': 'Netherlands Antillean Guilder',
    'AOA': 'Angolan Kwanza',
    'AWG': 'Aruban Florin',
    'AZN': 'Azerbaijani Manat',
    'BAM': 'Bosnia-Herzegovina Convertible Mark',
    'BBD': 'Barbadian Dollar',
    'BND': 'Brunei Dollar',
    'BOB': 'Bolivian Boliviano',
    'BSD': 'Bahamian Dollar',
    'BTN': 'Bhutanese Ngultrum',
    'BWP': 'Botswana Pula',
    'BYN': 'Belarusian Ruble',
    'BZD': 'Belize Dollar',
    'CDF': 'Congolese Franc',
    'CRC': 'Costa Rican Colón',
    'CUP': 'Cuban Peso',
    'CVE': 'Cape Verdean Escudo',
    'DJF': 'Djiboutian Franc',
    'DOP': 'Dominican Peso',
    'DZD': 'Algerian Dinar',
    'ERN': 'Eritrean Nakfa',
    'ETB': 'Ethiopian Birr',
    'FJD': 'Fijian Dollar',
    'GEL': 'Georgian Lari',
    'GHS': 'Ghanaian Cedi',
    'GMD': 'Gambian Dalasi',
    'GNF': 'Guinean Franc',
    'GTQ': 'Guatemalan Quetzal',
    'GYD': 'Guyanese Dollar',
    'HNL': 'Honduran Lempira',
    'HRK': 'Croatian Kuna',
    'HTG': 'Haitian Gourde',
    'JMD': 'Jamaican Dollar',
    'KES': 'Kenyan Shilling',
    'KGS': 'Kyrgystani Som',
    'KHR': 'Cambodian Riel',
    'KMF': 'Comorian Franc',
    'KPW': 'North Korean Won',
    'KZT': 'Kazakhstani Tenge',
    'LAK': 'Laotian Kip',
    'LBP': 'Lebanese Pound',
    'LRD': 'Liberian Dollar',
    'LSL': 'Lesotho Loti',
    'LYD': 'Libyan Dinar',
    'MAD': 'Moroccan Dirham',
    'MDL': 'Moldovan Leu',
    'MGA': 'Malagasy Ariary',
    'MKD': 'Macedonian Denar',
    'MNT': 'Mongolian Tugrik',
    'MOP': 'Macanese Pataca',
    'MRT': 'Mauritanian Ouguiya',
    'MUR': 'Mauritian Rupee',
    'MVR': 'Maldivian Rufiyaa',
    'MWK': 'Malawian Kwacha',
    'MZN': 'Mozambican Metical',
    'NAD': 'Namibian Dollar',
    'NIO': 'Nicaraguan Córdoba',
    'NPR': 'Nepalese Rupee',
    'PAB': 'Panamanian Balboa',
    'PGK': 'Papua New Guinean Kina',
    'PYG': 'Paraguayan Guarani',
    'RSD': 'Serbian Dinar',
    'RWF': 'Rwandan Franc',
    'SBD': 'Solomon Islands Dollar',
    'SCR': 'Seychellois Rupee',
    'SDG': 'Sudanese Pound',
    'SLL': 'Sierra Leonean Leone',
    'SOS': 'Somali Shilling',
    'SRD': 'Surinamese Dollar',
    'STD': 'São Tomé and Príncipe Dobra',
    'SVC': 'Salvadoran Colón',
    'SYP': 'Syrian Pound',
    'SZL': 'Swazi Lilangeni',
    'TJS': 'Tajikistani Somoni',
    'TMT': 'Turkmenistani Manat',
    'TND': 'Tunisian Dinar',
    'TOP': 'Tongan Paʻanga',
    'TTD': 'Trinidad and Tobago Dollar',
    'TZS': 'Tanzanian Shilling',
    'UGX': 'Ugandan Shilling',
    'UYU': 'Uruguayan Peso',
    'UZS': 'Uzbekistani Som',
    'VES': 'Venezuelan Bolívar',
    'VUV': 'Vanuatu Vatu',
    'WST': 'Samoan Tala',
    'XAF': 'Central African CFA Franc',
    'XCD': 'East Caribbean Dollar',
    'XOF': 'West African CFA Franc',
    'XPF': 'CFP Franc',
    'YER': 'Yemeni Rial',
    'ZMW': 'Zambian Kwacha',
    'ZWL': 'Zimbabwean Dollar'
  };
  
  return currencyNames[code] || `${code} Currency`;
}

function populateCurrencyDropdowns(symbols) {
  // Clear existing options (except placeholder)
  fromCurrency.innerHTML = '<option value="">Select currency...</option>';
  toCurrency.innerHTML = '<option value="">Select currency...</option>';
  
  // Sort currencies: popular first, then alphabetical
  const sortedCurrencies = Object.keys(symbols).sort((a, b) => {
    const aIsPopular = popularCurrencies.includes(a);
    const bIsPopular = popularCurrencies.includes(b);
    
    if (aIsPopular && !bIsPopular) return -1;
    if (!aIsPopular && bIsPopular) return 1;
    if (aIsPopular && bIsPopular) {
      return popularCurrencies.indexOf(a) - popularCurrencies.indexOf(b);
    }
    return a.localeCompare(b);
  });
  
  // Add separator for popular currencies
  if (popularCurrencies.length > 0) {
    const popularSeparator = document.createElement('option');
    popularSeparator.disabled = true;
    popularSeparator.textContent = '── Popular Currencies ──';
    fromCurrency.appendChild(popularSeparator.cloneNode(true));
    toCurrency.appendChild(popularSeparator.cloneNode(true));
  }
  
  let addedSeparator = false;
  
  sortedCurrencies.forEach(currencyCode => {
    // Add separator after popular currencies
    if (!addedSeparator && !popularCurrencies.includes(currencyCode)) {
      const separator = document.createElement('option');
      separator.disabled = true;
      separator.textContent = '── All Currencies ──';
      fromCurrency.appendChild(separator.cloneNode(true));
      toCurrency.appendChild(separator.cloneNode(true));
      addedSeparator = true;
    }
    
    const symbol = currencySymbols[currencyCode] || '';
    const displayText = `${currencyCode} ${symbol} - ${symbols[currencyCode].description}`;
    
    const optionFrom = document.createElement('option');
    optionFrom.value = currencyCode;
    optionFrom.textContent = displayText;
    fromCurrency.appendChild(optionFrom);
    
    const optionTo = document.createElement('option');
    optionTo.value = currencyCode;
    optionTo.textContent = displayText;
    toCurrency.appendChild(optionTo);
  });
}

function setDefaultCurrencies() {
  // Set default currencies based on user's likely location
  fromCurrency.value = 'USD';
  toCurrency.value = 'EUR';
  amountInput.value = '1';
}

function updateCurrencySymbol() {
  const selectedCurrency = fromCurrency.value;
  fromSymbol.textContent = currencySymbols[selectedCurrency] || selectedCurrency;
}

function swapCurrencies() {
  const fromValue = fromCurrency.value;
  const toValue = toCurrency.value;
  
  if (fromValue && toValue) {
    fromCurrency.value = toValue;
    toCurrency.value = fromValue;
    updateCurrencySymbol();
    
    // Auto-convert if amount is entered
    if (amountInput.value) {
      handleConversion();
    }
  }
}

async function handleConversion() {
  const from = fromCurrency.value;
  const to = toCurrency.value;
  const amount = amountInput.value.trim();
  
  // Validate inputs
  if (!from || !to) {
    showError('Please select both currencies.');
    return;
  }
  
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    showError('Please enter a valid amount.');
    return;
  }
  
  if (from === to) {
    showResult(amount, from, amount, to, 1);
    return;
  }
  
  try {
    setLoadingState(true);
    
    // Try multiple exchange rate APIs for better reliability
    const exchangeAPIs = [
      `https://api.exchangerate-api.com/v4/latest/${from}`,
      `https://open.er-api.com/v6/latest/${from}`,
      `https://api.fixer.io/latest?base=${from}&access_key=demo`,
      `https://api.currencyapi.com/v3/latest?apikey=demo&base_currency=${from}`,
      `https://v6.exchangerate-api.com/v6/demo/latest/${from}`
    ];
    
    let conversionResult = null;
    
    // Try each API until one works
    for (const apiUrl of exchangeAPIs) {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        let rate = null;
        
        // Handle different API response formats
        if (data.rates && data.rates[to]) {
          rate = data.rates[to];
        } else if (data.data && data.data[to] && data.data[to].value) {
          rate = data.data[to].value;
        } else if (data.conversion_rates && data.conversion_rates[to]) {
          rate = data.conversion_rates[to];
        }
        
        if (rate) {
          const convertedAmount = (parseFloat(amount) * rate).toFixed(4);
          conversionResult = {
            amount: convertedAmount,
            rate: rate
          };
          break;
        }
      } catch (err) {
        console.log(`Exchange API ${apiUrl} failed, trying next...`);
        continue;
      }
    }
    
    if (conversionResult) {
      showResult(amount, from, conversionResult.amount, to, conversionResult.rate);
      updateLastUpdatedTime();
    } else {
      // Fallback to manual calculation with approximate rates
      const approximateRate = getApproximateRate(from, to);
      if (approximateRate) {
        const convertedAmount = (parseFloat(amount) * approximateRate).toFixed(4);
        showResult(amount, from, convertedAmount, to, approximateRate);
        showWarning('Using approximate exchange rate. Results may not be current.');
      } else {
        throw new Error('All exchange rate services are unavailable');
      }
    }
  } catch (error) {
    console.error('Conversion error:', error);
    showError('Unable to get current exchange rates. Please try again later or check your internet connection.');
  } finally {
    setLoadingState(false);
  }
}

function getApproximateRate(from, to) {
  // Approximate rates relative to USD (for fallback only)
  const approximateRates = {
    'USD': 1.0,
    'EUR': 0.85,
    'GBP': 0.73,
    'JPY': 150.0,
    'CAD': 1.35,
    'AUD': 1.50,
    'CHF': 0.88,
    'CNY': 7.20,
    'INR': 83.0,
    'KRW': 1320.0,
    'SGD': 1.35,
    'HKD': 7.80,
    'SEK': 10.50,
    'NOK': 10.80,
    'DKK': 6.80,
    'PLN': 4.20,
    'CZK': 23.0,
    'HUF': 360.0,
    'RUB': 90.0,
    'BRL': 5.20,
    'MXN': 17.0,
    'ZAR': 18.5,
    'TRY': 28.0,
    'THB': 35.0,
    'MYR': 4.70,
    'IDR': 15500.0,
    'PHP': 56.0,
    'VND': 24000.0,
    'ILS': 3.70,
    'AED': 3.67,
    'SAR': 3.75
  };
  
  const fromRate = approximateRates[from];
  const toRate = approximateRates[to];
  
  if (fromRate && toRate) {
    return toRate / fromRate;
  }
  
  return null;
}

function showResult(fromAmount, fromCurrency, toAmount, toCurrency, exchangeRate) {
  const formattedFromAmount = Number(fromAmount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  
  const formattedToAmount = Number(toAmount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });
  
  resultDiv.innerHTML = `
    <div class="result-value">${currencySymbols[toCurrency] || ''}${formattedToAmount}</div>
    <div class="result-text">${formattedFromAmount} ${fromCurrency} equals</div>
  `;
  
  // Show exchange rate
  const formattedRate = Number(exchangeRate).toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6
  });
  
  exchangeRateDiv.textContent = `1 ${fromCurrency} = ${formattedRate} ${toCurrency}`;
  exchangeRateDiv.style.display = 'block';
}

function showError(message) {
  resultDiv.innerHTML = `
    <div style="color: var(--error-color);">
      <i class="fas fa-exclamation-triangle" style="margin-right: 0.5rem;"></i>
      ${message}
    </div>
  `;
  exchangeRateDiv.style.display = 'none';
}

function showWarning(message) {
  // Create or update warning message
  let warningDiv = document.getElementById('warning-message');
  if (!warningDiv) {
    warningDiv = document.createElement('div');
    warningDiv.id = 'warning-message';
    warningDiv.style.cssText = `
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      color: #856404;
      padding: 0.75rem;
      border-radius: 6px;
      margin-top: 1rem;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    `;
    document.querySelector('.result-section').appendChild(warningDiv);
  }
  
  warningDiv.innerHTML = `
    <i class="fas fa-exclamation-triangle"></i>
    ${message}
  `;
  warningDiv.style.display = 'flex';
  
  // Auto-hide warning after 10 seconds
  setTimeout(() => {
    if (warningDiv) {
      warningDiv.style.display = 'none';
    }
  }, 10000);
}

function showLoadingState() {
  resultDiv.innerHTML = `
    <div class="result-placeholder">
      <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 1rem;"></i>
      <p>Loading currencies...</p>
    </div>
  `;
}

function setLoadingState(isLoading) {
  if (isLoading) {
    convertBtn.classList.add('loading');
    convertBtn.disabled = true;
  } else {
    convertBtn.classList.remove('loading');
    convertBtn.disabled = false;
  }
}

function updateLastUpdatedTime() {
  if (lastUpdateTime) {
    const timeString = lastUpdateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    lastUpdatedDiv.textContent = `Last updated: ${timeString}`;
    lastUpdatedDiv.style.display = 'block';
  }
}

// Auto-refresh currency list every 5 minutes
setInterval(() => {
  if (currencyCache) {
    loadCurrencies();
  }
}, 5 * 60 * 1000);

// Handle network status
window.addEventListener('online', () => {
  if (!currencyCache) {
    loadCurrencies();
  }
});

window.addEventListener('offline', () => {
  showError('No internet connection. Please check your network.');
});
