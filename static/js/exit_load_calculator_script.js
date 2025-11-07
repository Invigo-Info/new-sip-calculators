// Exit Load Calculator Script (UI-only changes preserved; functionality intact)

let chart = null;
let timeComparisonChart = null;

// Input elements
const investmentAmountInput = document.getElementById('investmentAmount');
const investmentAmountSlider = document.getElementById('investmentAmountSlider');
const exitLoadRateInput = document.getElementById('exitLoadRate');
const exitLoadRateSlider = document.getElementById('exitLoadRateSlider');
const redemptionAmountInput = document.getElementById('redemptionAmount');
const redemptionAmountSlider = document.getElementById('redemptionAmountSlider');
const exitLoadPeriodInput = document.getElementById('exitLoadPeriod');
const exitLoadPeriodSlider = document.getElementById('exitLoadPeriodSlider');
const purchaseNAVInput = document.getElementById('purchaseNAV');
const purchaseNAVSlider = document.getElementById('purchaseNAVSlider');
const currentNAVInput = document.getElementById('currentNAV');
const currentNAVSlider = document.getElementById('currentNAVSlider');

// Custom Chart.js plugin to display center text
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw: function(c) {
    if (!c.config.options.plugins.centerText || !c.config.options.plugins.centerText.display) return;
    const ctx = c.ctx;
    const centerX = (c.chartArea.left + c.chartArea.right) / 2;
    const centerY = (c.chartArea.top + c.chartArea.bottom) / 2;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillStyle = '#1a202c';
    ctx.fillText(c.config.options.plugins.centerText.text, centerX, centerY - 8);
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('Net Amount', centerX, centerY + 12);
    ctx.restore();
  }
};
Chart.register(centerTextPlugin);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    setupSliders();
    addEventListeners();
    initialSyncValues();
    calculateAndUpdateResults();
    setupResponsiveCharts();
  }, 100);
});

function setupSliders() {
  syncInputs(investmentAmountInput, investmentAmountSlider);
  syncInputs(exitLoadRateInput, exitLoadRateSlider);
  syncInputs(redemptionAmountInput, redemptionAmountSlider);
  syncInputs(exitLoadPeriodInput, exitLoadPeriodSlider);
  syncInputs(purchaseNAVInput, purchaseNAVSlider);
  syncInputs(currentNAVInput, currentNAVSlider);
}

function initialSyncValues() {
  investmentAmountInput.value = 100000;
  investmentAmountSlider.value = 100000;
  exitLoadRateInput.value = 1;
  exitLoadRateSlider.value = 1;
  redemptionAmountInput.value = 120000;
  redemptionAmountSlider.value = 120000;
  exitLoadPeriodInput.value = 1;
  exitLoadPeriodSlider.value = 1;
  purchaseNAVInput.value = 10;
  purchaseNAVSlider.value = 10;
  currentNAVInput.value = 12;
  currentNAVSlider.value = 12;
  updateAllSlidersProgress();
}

function updateAllSlidersProgress() {
  [investmentAmountSlider, exitLoadRateSlider, redemptionAmountSlider, exitLoadPeriodSlider, purchaseNAVSlider, currentNAVSlider].forEach(slider => {
    const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty('--fill', `${percentage}%`);
  });
}

function syncInputs(input, slider) {
  function updateSliderProgress(slider) {
    const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty('--fill', `${percentage}%`);
  }
  updateSliderProgress(slider);
  input.addEventListener('input', function() {
    const value = parseFloat(this.value) || 0;
    if (value >= parseFloat(slider.min) && value <= parseFloat(slider.max)) {
      slider.value = value;
      updateSliderProgress(slider);
    }
    calculateAndUpdateResults();
  });
  slider.addEventListener('input', function() {
    input.value = this.value;
    updateSliderProgress(this);
    calculateAndUpdateResults();
  });
  input.addEventListener('change', function() {
    const value = parseFloat(this.value) || 0;
    if (value >= parseFloat(slider.min) && value <= parseFloat(slider.max)) {
      slider.value = value;
      updateSliderProgress(slider);
    } else if (value < parseFloat(slider.min)) {
      this.value = slider.min;
      slider.value = slider.min;
      updateSliderProgress(slider);
    } else if (value > parseFloat(slider.max)) {
      this.value = slider.max;
      slider.value = slider.max;
      updateSliderProgress(slider);
    }
    calculateAndUpdateResults();
  });
}

function addEventListeners() {
  [investmentAmountInput, exitLoadRateInput, redemptionAmountInput, exitLoadPeriodInput, purchaseNAVInput, currentNAVInput].forEach(input => {
    input.addEventListener('change', calculateAndUpdateResults);
    input.addEventListener('keyup', calculateAndUpdateResults);
  });
  [investmentAmountSlider, exitLoadRateSlider, redemptionAmountSlider, exitLoadPeriodSlider, purchaseNAVSlider, currentNAVSlider].forEach(slider => {
    slider.addEventListener('input', calculateAndUpdateResults);
  });
}

function calculateAndUpdateResults() {
  const data = {
    investment_amount: parseFloat(investmentAmountInput.value) || 0,
    exit_load_rate: parseFloat(exitLoadRateInput.value) || 0,
    redemption_amount: parseFloat(redemptionAmountInput.value) || 0,
    exit_load_period: (parseFloat(exitLoadPeriodInput.value) || 0) * 365,
    purchase_nav: parseFloat(purchaseNAVInput.value) || 0,
    current_nav: parseFloat(currentNAVInput.value) || 0
  };
  if (data.investment_amount < 0 || data.exit_load_rate < 0 || data.redemption_amount < 0 || data.exit_load_period < 0 || data.purchase_nav < 0 || data.current_nav < 0) {
    return;
  }
  fetch('/calculate-exit-load', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(r => r.json())
    .then(result => {
      updateResultsDisplay(result);
      updateChart(result);
      updateTimeComparisonChart(result);
      updateBreakdownTable(result);
    })
    .catch(err => console.error('Error:', err));
}

function updateResultsDisplay(result) {
  document.getElementById('netRedemptionResult').textContent = formatCurrency(result.net_redemption_amount);
  document.getElementById('currentValueResult').textContent = formatCurrency(result.current_value);
  document.getElementById('exitLoadChargeResult').textContent = formatCurrency(result.exit_load_charge);
  document.getElementById('totalGainLossResult').textContent = formatCurrency(result.total_gain_loss);
  const statusElement = document.getElementById('exitLoadStatusResult');
  if (result.exit_load_applicable) {
    statusElement.textContent = 'Applicable';
    statusElement.style.color = '#e53e3e';
  } else {
    statusElement.textContent = 'Not Applicable';
    statusElement.style.color = '#38a169';
  }
  document.getElementById('investmentAmountDisplay').textContent = formatCurrency(result.investment_amount);
  document.getElementById('gainsEarnedDisplay').textContent = formatCurrency(result.gains_earned);
  document.getElementById('exitLoadChargeDisplay').textContent = formatCurrency(result.exit_load_charge);
}

function updateChart(result) {
  const ctx = document.getElementById('exitLoadChart').getContext('2d');
  if (chart) chart.destroy();
  const centerText = formatCurrency(result.net_redemption_amount);
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Investment Amount', 'Gains Earned', 'Exit Load Charge'],
      datasets: [{
        data: [result.investment_amount, result.gains_earned, Math.abs(result.exit_load_charge)],
        backgroundColor: ['#3c83f6', '#16a249', '#43e97b'],
        borderWidth: 0,
        cutout: '65%'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) { return ctx.label + ': ' + formatCurrency(ctx.parsed); }
          }
        },
        centerText: { display: true, text: centerText }
      }
    }
  });
}

function updateTimeComparisonChart(result) {
  const ctx = document.getElementById('timeComparisonChart').getContext('2d');
  if (timeComparisonChart) timeComparisonChart.destroy();
  const redemptionAmounts = [];
  const netAmounts = [];
  const exitLoads = [];
  const currentValue = result.current_value || 100000;
  const baseAmounts = [0, currentValue * 0.1, currentValue * 0.25, currentValue * 0.5, currentValue * 0.75, currentValue, currentValue * 1.25, currentValue * 1.5, currentValue * 2, Math.max(currentValue * 3, 1000000)];
  baseAmounts.forEach(amount => {
    redemptionAmounts.push(amount);
    const exitLoadCharge = (result.exit_load_rate > 0 && amount > 0) ? (amount * result.exit_load_rate / 100) : 0;
    const netAmount = amount - exitLoadCharge;
    netAmounts.push(netAmount);
    exitLoads.push(exitLoadCharge);
  });
  timeComparisonChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: redemptionAmounts.map(a => formatCurrency(a)),
      datasets: [
        { label: 'Net Redemption Amount', data: netAmounts, borderColor: '#3182ce', backgroundColor: 'rgba(49,130,206,0.1)', fill: true, tension: 0.4 },
        { label: 'Exit Load Charge', data: exitLoads, borderColor: '#43e97b', backgroundColor: 'rgba(255,107,53,0.1)', fill: false, tension: 0.4 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: {
          callbacks: { label: function(ctx){ return ctx.dataset.label + ': ' + formatCurrency(ctx.parsed.y); } }
        }
      },
      scales: {
        x: { title: { display: true, text: 'Redemption Amount' } },
        y: { title: { display: true, text: 'Amount (\u20B9)' }, ticks: { callback: (v)=>formatCurrency(v) } }
      }
    }
  });
}

function updateBreakdownTable(result) {
  const tableBody = document.getElementById('breakdownTableBody');
  tableBody.innerHTML = '';
  const breakdown = [
    { parameter: 'Investment Amount', value: formatCurrency(result.investment_amount), description: 'Original amount invested' },
    { parameter: 'Purchase NAV', value: '\u20B9' + (result.purchase_nav||0), description: 'NAV when units were purchased' },
    { parameter: 'Current NAV', value: '\u20B9' + (result.current_nav||0), description: 'Current NAV of the fund' },
    { parameter: 'Units Held', value: (result.units_held||0).toFixed(4), description: 'Number of units owned' },
    { parameter: 'Current Value', value: formatCurrency(result.current_value), description: 'Current market value of investment' },
    { parameter: 'Gains/Loss', value: formatCurrency(result.total_gain_loss), description: 'Profit or loss on investment' },
    { parameter: 'Redemption Amount', value: formatCurrency(result.redemption_amount), description: 'Amount to be redeemed from investment' },
    { parameter: 'Exit Load Period', value: ((result.exit_load_period||0) / 365).toFixed(1) + ' years', description: 'Period during which exit load applies' },
    { parameter: 'Exit Load Rate', value: (result.exit_load_rate||0) + '%', description: 'Percentage charged as exit load' },
    { parameter: 'Exit Load Applicable', value: result.exit_load_applicable ? 'Yes' : 'No', description: 'Whether exit load will be charged' },
    { parameter: 'Exit Load Charge', value: formatCurrency(result.exit_load_charge), description: 'Amount charged as exit load' },
    { parameter: 'Net Redemption Amount', value: formatCurrency(result.net_redemption_amount), description: 'Final amount after exit load deduction' }
  ];
  breakdown.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="font-weight: 500;">${item.parameter}</td>
      <td style="font-weight: 600; color: #2d3748;">${item.value}</td>
      <td style="color: #718096; font-size: 13px;">${item.description}</td>
    `;
    tableBody.appendChild(row);
  });
}

function formatCurrency(amount) {
  const absAmount = Math.abs(amount||0);
  const sign = (amount||0) < 0 ? '-' : '';
  const numStr = Math.round(absAmount).toString();
  if (numStr.length <= 3) return sign + '\u20B9' + numStr;
  let result = '';
  let count = 0;
  for (let i = numStr.length - 1; i >= 0; i--) {
    result = numStr[i] + result;
    count++;
    if (count === 3 && i > 0) {
      result = ',' + result;
    } else if (count > 3 && (count - 3) % 2 === 0 && i > 0) {
      result = ',' + result;
    }
  }
  return sign + '\u20B9' + result;
}


function setupResponsiveCharts() {
  // Placeholder for any responsive tweaks if needed
}
