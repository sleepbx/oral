'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PatientPortal() {
  const router = useRouter();
  const [step, setStep] = useState(0); 
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    stage1Answers: {
      ulcer: null,
      patch: null,
      lump: null,
      difficulty: null,
      burning: null,
    },
    stage2Answers: {
      age: null,
      gender: null,
      smoke: null,
      smokeStart: null,
      smokeDuration: null,
      smokeQty: null,
      chew: null,
      chewStart: null,
      chewDuration: null,
      chewFreq: null,
      alcohol: null,
    }
  });

  const [riskResult, setRiskResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  const handleNext = () => {
    setErrorMsg(''); // Reset error
    
    if (step === 0) {
      if (!formData.name || !formData.state) return setErrorMsg('Please fill out all fields to continue.');
      setStep(1);
    } else if (step === 1) {
      const s1 = formData.stage1Answers;
      if (Object.values(s1).some(val => val === null)) {
        return setErrorMsg('Please answer all symptom questions.');
      }
      
      if (Object.values(s1).some(val => val === 'Yes')) {
        submitResult('High Risk', 'You have been identified as High Risk based on your symptoms. You are advised to consult with a nearby dental or medical professional for further clinical evaluation.', true);
      } else {
        setStep(2);
      }
    } else if (step === 2) {
      const s2 = formData.stage2Answers;
      if (s2.age === null || s2.gender === null || s2.smoke === null || s2.chew === null || s2.alcohol === null) {
         return setErrorMsg('Please answer all the base lifestyle questions.');
      }
      if (s2.smoke.value === 1 && (s2.smokeStart === null || s2.smokeDuration === null || s2.smokeQty === null)) {
         return setErrorMsg('Please complete all questions in the smoking section.');
      }
      if (s2.chew.value === 1 && (s2.chewStart === null || s2.chewDuration === null || s2.chewFreq === null)) {
         return setErrorMsg('Please complete all questions in the smokeless tobacco section.');
      }
      
      let score = 0;
      score += s2.age.value || 0;
      score += s2.gender.value || 0;
      score += s2.smoke.value || 0;
      score += s2.smokeStart?.value || 0;
      score += s2.smokeDuration?.value || 0;
      score += s2.smokeQty?.value || 0;
      score += s2.chew.value || 0;
      score += s2.chewStart?.value || 0;
      score += s2.chewDuration?.value || 0;
      score += s2.chewFreq?.value || 0;
      score += s2.alcohol.value || 0;
      
      let riskLevel = 'Low Risk';
      let message = 'You are currently at a Low Risk. Maintain good oral hygiene and continue regular checkups.';
      if (score >= 7) {
        riskLevel = 'High Risk';
        message = 'You have been identified as High Risk. You are advised to consult with a nearby dental or medical professional for further clinical evaluation.';
      } else if (score >= 4) {
        riskLevel = 'Moderate Risk';
        message = 'You have been identified as Moderate Risk. You are advised to consult with a nearby dental or medical professional for further clinical evaluation.';
      }
      submitResult(riskLevel, message, false, score);
    }
  };

  const submitResult = async (riskLevel, message, hasSymptoms, score = null) => {
    setLoading(true);
    setRiskResult({ riskLevel, message });
    
    // We want to extract just the values for the DB to save space, but it's okay to save as is for now.
    const simplifiedData = {
      name: formData.name,
      state: formData.state,
      hasSymptoms,
      score,
      result: riskLevel
    };
    
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simplifiedData)
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setStep(3);
    } catch (err) {
      setErrorMsg('Error submitting result. Please try again.');
    }
    setLoading(false);
  };

  const ErrorMessage = () => errorMsg ? (
    <div style={{ padding: '1rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontWeight: '500', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span>⚠️</span> {errorMsg}
    </div>
  ) : null;

  const renderUserInfo = () => (
    <div className="content-area">
      <h1>Welcome</h1>
      <p style={{ marginBottom: '2rem' }}>Enter your details to begin the screening.</p>
      
      <ErrorMessage />

      <div className="input-group">
        <label className="label">Full Name</label>
        <input 
          type="text" 
          className="input-field" 
          placeholder="e.g. John Doe"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />
      </div>
      
      <div className="input-group">
        <label className="label">State</label>
        <input 
          type="text" 
          list="states-list"
          className="input-field" 
          placeholder="Select or type your state"
          value={formData.state}
          onChange={e => setFormData({...formData, state: e.target.value})}
        />
        <datalist id="states-list">
          {indianStates.map(state => (
            <option key={state} value={state} />
          ))}
        </datalist>
      </div>
    </div>
  );

  const YesNoQuestion = ({ question, name, stateObj }) => (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>{question}</div>
      <div className="option-list">
        <button 
          className={`option-card ${formData[stateObj][name] === 'Yes' ? 'selected' : ''}`}
          onClick={() => setFormData({...formData, [stateObj]: {...formData[stateObj], [name]: 'Yes'}})}
        >
          <div className="option-card-content">
            <div className="option-icon">⚠️</div>
            <span className="option-label">Yes</span>
          </div>
          <div style={{ color: formData[stateObj][name] === 'Yes' ? 'var(--primary)' : 'transparent' }}>✓</div>
        </button>
        <button 
          className={`option-card ${formData[stateObj][name] === 'No' ? 'selected' : ''}`}
          onClick={() => setFormData({...formData, [stateObj]: {...formData[stateObj], [name]: 'No'}})}
        >
          <div className="option-card-content">
            <div className="option-icon">✅</div>
            <span className="option-label">No</span>
          </div>
          <div style={{ color: formData[stateObj][name] === 'No' ? 'var(--primary)' : 'transparent' }}>✓</div>
        </button>
      </div>
    </div>
  );

  const renderStage1 = () => (
    <div className="content-area">
      <h2>Symptom Screening</h2>
      <p style={{ marginBottom: '2rem' }}>Please carefully read and answer the following.</p>
      
      <ErrorMessage />

      <YesNoQuestion question="1. Do you have a mouth ulcer that has not healed for more than 3 weeks?" name="ulcer" stateObj="stage1Answers" />
      <YesNoQuestion question="2. Do you have any red or white patch inside your mouth?" name="patch" stateObj="stage1Answers" />
      <YesNoQuestion question="3. Do you have any lump or swelling in your mouth?" name="lump" stateObj="stage1Answers" />
      <YesNoQuestion question="4. Do you have difficulty in opening your mouth or chewing food?" name="difficulty" stateObj="stage1Answers" />
      <YesNoQuestion question="5. Do you experience a burning sensation in your mouth, especially while consuming hot or spicy food?" name="burning" stateObj="stage1Answers" />
    </div>
  );

  const OptionGroup = ({ question, name, options, stateObj = 'stage2Answers' }) => (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>{question}</div>
      <div className="option-list">
        {options.map((opt, i) => {
          const isSelected = formData[stateObj][name]?.label === opt.label;
          return (
            <button 
              key={i}
              className={`option-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setFormData({...formData, [stateObj]: {...formData[stateObj], [name]: opt}})}
            >
              <div className="option-card-content">
                {opt.icon && <div className="option-icon">{opt.icon}</div>}
                <span className="option-label">{opt.label}</span>
              </div>
              <div style={{ color: isSelected ? 'var(--primary)' : 'transparent' }}>✓</div>
            </button>
          )
        })}
      </div>
    </div>
  );

  const renderStage2 = () => (
    <div className="content-area">
      <h2>Risk Factors</h2>
      <p style={{ marginBottom: '2rem' }}>Provide details about your habits.</p>
      
      <ErrorMessage />
      
      <OptionGroup 
        question="1. What is your age?" name="age"
        options={[{label: '< 30 years', value: 0, icon: '🧑'}, {label: '≥ 30 years', value: 1, icon: '👨'}]}
      />
      <OptionGroup 
        question="2. What is your gender?" name="gender"
        options={[{label: 'Female', value: 0, icon: '👩'}, {label: 'Male', value: 1, icon: '👨'}]}
      />
      
      <OptionGroup 
        question="3. Do you smoke any tobacco products?" name="smoke"
        options={[{label: 'No, I don\'t', value: 0, icon: '🚭'}, {label: 'Yes, I do', value: 1, icon: '🚬'}]}
      />
      {formData.stage2Answers.smoke === 1 && (
        <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem' }}>
          <OptionGroup question="Age at initiation" name="smokeStart" options={[{label: 'After 25 years', value: 0}, {label: 'Before 25 years', value: 1}]} />
          <OptionGroup question="Duration" name="smokeDuration" options={[{label: '< 10 years', value: 0}, {label: '≥ 10 years', value: 1}]} />
          <OptionGroup question="Quantity / day" name="smokeQty" options={[{label: '< 10 / day', value: 0}, {label: '≥ 10 / day', value: 1}]} />
        </div>
      )}

      <OptionGroup 
        question="4. Do you chew smokeless tobacco?" name="chew"
        options={[{label: 'No, I don\'t', value: 0, icon: '✅'}, {label: 'Yes, I do', value: 1, icon: '⚠️'}]}
      />
      {formData.stage2Answers.chew === 1 && (
        <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem' }}>
          <OptionGroup question="Age at initiation" name="chewStart" options={[{label: 'After 20 years', value: 0}, {label: 'Before 20 years', value: 1}]} />
          <OptionGroup question="Duration" name="chewDuration" options={[{label: '< 5 years', value: 0}, {label: '≥ 5 years', value: 1}]} />
          <OptionGroup question="Frequency / day" name="chewFreq" options={[{label: '< 5 / day', value: 0}, {label: '≥ 5 / day', value: 1}]} />
        </div>
      )}

      <OptionGroup 
        question="5. Alcohol Consumption" name="alcohol"
        options={[{label: 'Never', value: 0, icon: '💧'}, {label: '< 3 days / wk', value: 0, icon: '🥂'}, {label: '≥ 3 days / wk', value: 1, icon: '🍻'}]}
      />
    </div>
  );

  const renderResult = () => {
    const isHigh = riskResult.riskLevel === 'High Risk';
    const isMod = riskResult.riskLevel === 'Moderate Risk';
    const badgeClass = isHigh ? 'badge-high' : isMod ? 'badge-moderate' : 'badge-low';
    const icon = isHigh ? '🚨' : isMod ? '⚠️' : '✅';
    
    // Exact phrasing from the PDF protocol
    const recommendationText = (isHigh || isMod) 
      ? "Automated In-App Notification: You are advised to consult with a nearby dental or medical professional for further clinical evaluation."
      : "You are currently at a Low Risk. Maintain good oral hygiene and continue regular checkups.";

    return (
      <div className="content-area" style={{ display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '1rem', animation: 'fadeIn 0.5s ease-out' }}>{icon}</div>
          <h1 style={{ fontSize: '2.25rem', color: 'var(--text-main)' }}>Screening Complete</h1>
          <p style={{ color: 'var(--text-muted)' }}>Here is your personalized oral health risk assessment.</p>
        </div>
        
        <div style={{ 
          padding: '2rem', 
          background: 'var(--card-bg)', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginBottom: '1rem' }}>
            Final Risk Classification
          </div>
          <div className={`badge ${badgeClass}`} style={{ fontSize: '1.75rem', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)' }}>
            {riskResult.riskLevel}
          </div>
        </div>

        {(isHigh || isMod) && (
          <div style={{ 
            padding: '2rem', 
            background: 'var(--warning-bg)', 
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-lg)', 
            marginBottom: '2rem'
          }}>
            <h3 style={{ color: '#b45309', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📋</span> Official Recommendation
            </h3>
            <p style={{ fontSize: '1.15rem', color: '#92400e', lineHeight: '1.6', fontWeight: '500' }}>
              {recommendationText}
            </p>
          </div>
        )}

        {(!isHigh && !isMod) && (
          <div style={{ 
            padding: '2rem', 
            background: 'var(--success-bg)', 
            border: '1px solid #a7f3d0',
            borderRadius: 'var(--radius-lg)', 
            marginBottom: '2rem'
          }}>
            <h3 style={{ color: '#047857', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📋</span> Official Recommendation
            </h3>
            <p style={{ fontSize: '1.15rem', color: '#065f46', lineHeight: '1.6', fontWeight: '500' }}>
              {recommendationText}
            </p>
          </div>
        )}

      </div>
    );
  };

  const isSkipStage2 = Object.values(formData.stage1Answers).some(v => v === 'Yes');
  const totalSteps = isSkipStage2 ? 2 : 3;

  return (
    <main className="app-container">
      {step < 3 && (
        <div className="progress-header">
           <div className="progress-track">
             <div className="progress-fill" style={{ width: `${((step + 1) / totalSteps) * 100}%` }}></div>
           </div>
           <div className="progress-text">
             <span>{['Profile', 'Symptoms', 'Lifestyle'][step]}</span>
             <span>{step + 1} of {totalSteps}</span>
           </div>
        </div>
      )}
      
      {step === 0 && renderUserInfo()}
      {step === 1 && renderStage1()}
      {step === 2 && renderStage2()}
      {step === 3 && renderResult()}
      
      <div className="bottom-bar">
        <div className="bottom-bar-inner">
          {step < 3 ? (
            <button className="btn btn-primary" onClick={handleNext} disabled={loading}>
              {loading ? 'Processing...' : 'Continue'}
            </button>
          ) : (
            <button className="btn btn-outline" onClick={() => router.push('/')}>
              Return Home
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
