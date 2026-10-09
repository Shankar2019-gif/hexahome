import React, { useState } from 'react';
import { Calculator, ArrowRight, DollarSign, Percent, Clock } from 'lucide-react';

export default function CalculatorsSection() {
  const [loanAmount, setLoanAmount] = useState(5000000); // 50 Lakhs
  const [interestRate, setInterestRate] = useState(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState(20); // 20 years

  // Calculate Monthly EMI: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const totalAmountPayable = emi * totalMonths;
  const totalInterest = totalAmountPayable - loanAmount;

  return (
    <section id="emi-calculator" className="section-padding calculators-section bg-subtle">
      <div className="container">
        <div className="section-header-centered">
          <div className="section-eyebrow">Smart Real Estate Utilities</div>
          <h2 className="section-heading">Popular Property Calculators</h2>
          <p className="section-subtext">
            Plan your budget, forecast monthly cashflows, and calculate home loan EMIs before investing.
          </p>
        </div>

        <div className="calculator-widget-card">
          <div className="calc-left-controls">
            <div className="calc-title-row">
              <Calculator size={22} color="#033487" />
              <h3>Home Loan EMI Calculator</h3>
            </div>

            {/* Slider 1: Loan Amount */}
            <div className="calc-field-group">
              <div className="calc-label-row">
                <label>Loan Amount</label>
                <span className="calc-val-highlight">₹{(loanAmount / 100000).toFixed(1)} Lacs</span>
              </div>
              <input 
                type="range" 
                min="500000" 
                max="30000000" 
                step="100000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="calc-range-slider"
              />
              <div className="slider-limits">
                <span>₹5 Lacs</span>
                <span>₹3 Cr</span>
              </div>
            </div>

            {/* Slider 2: Interest Rate */}
            <div className="calc-field-group">
              <div className="calc-label-row">
                <label>Interest Rate (% p.a.)</label>
                <span className="calc-val-highlight">{interestRate}%</span>
              </div>
              <input 
                type="range" 
                min="6.5" 
                max="14.0" 
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="calc-range-slider"
              />
              <div className="slider-limits">
                <span>6.5%</span>
                <span>14%</span>
              </div>
            </div>

            {/* Slider 3: Loan Tenure */}
            <div className="calc-field-group">
              <div className="calc-label-row">
                <label>Loan Tenure</label>
                <span className="calc-val-highlight">{tenureYears} Years</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="30" 
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="calc-range-slider"
              />
              <div className="slider-limits">
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>

          {/* Right Results Summary */}
          <div className="calc-right-results">
            <div className="result-main-box">
              <span className="result-label">Estimated Monthly EMI</span>
              <span className="result-amount">₹{emi.toLocaleString('en-IN')}</span>
              <span className="result-sub">Per Month for {tenureYears} years</span>
            </div>

            <div className="breakdown-list">
              <div className="breakdown-item">
                <span className="breakdown-lbl">Principal Loan:</span>
                <span className="breakdown-val">₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-lbl">Total Interest:</span>
                <span className="breakdown-val">₹{totalInterest.toLocaleString('en-IN')}</span>
              </div>
              <div className="breakdown-item total-item">
                <span className="breakdown-lbl">Total Amount Payable:</span>
                <span className="breakdown-val">₹{totalAmountPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button type="button" className="calc-apply-btn">
              <span>Check Pre-Approved Home Loans</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
