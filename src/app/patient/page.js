'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PatientPortal() {
  const router = useRouter();
  const [step, setStep] = useState(0); 
  const [formData, setFormData] = useState({
    language: 'English',
    name: '',
    state: '',
    ulcer: null,
    patch: null,
    lump: null,
    difficulty: null,
    burning: null,
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
    consent: false,
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
    setErrorMsg('');
    
    // Step 0: Disclaimer & Consent
    if (step === 0) {
      if (!formData.consent) return setErrorMsg('You must agree to the terms to proceed.');
      setStep(1);
      return;
    }

    // Step 1: Language
    if (step === 1) {
      setStep(2);
      return;
    }
    
    // Step 2: Profile
    if (step === 2) {
      if (!formData.name || !formData.state) return setErrorMsg('Please fill out all fields to continue.');
      setStep(3);
      return;
    }

    // Stage 1 questions
    if (step >= 3 && step <= 7) {
      const stage1Keys = ['ulcer', 'patch', 'lump', 'difficulty', 'burning'];
      const key = stage1Keys[step - 3];
      if (formData[key] === null) return setErrorMsg('Please answer the question to continue.');
      
      // If we are at the last Stage 1 question (burning), check if any Stage 1 is Yes
      if (step === 7) {
        if (formData.ulcer === 'Yes' || formData.patch === 'Yes' || formData.lump === 'Yes' || formData.difficulty === 'Yes' || formData.burning === 'Yes') {
          submitResult('High Risk', 'You have been identified as High Risk based on your symptoms. You are advised to consult with a nearby dental or medical professional for further clinical evaluation.', true);
          return;
        }
      }
      setStep(step + 1);
      return;
    }

    // Stage 2 Questions (step 8 to 18)
    const validateChoice = (key) => {
      if (formData[key] === null) {
        setErrorMsg('Please select an option to continue.');
        return false;
      }
      return true;
    };

    if (step === 8) {
      if (!validateChoice('age')) return;
      setStep(9);
      return;
    }
    
    if (step === 9) {
      if (!validateChoice('gender')) return;
      setStep(10);
      return;
    }
    
    if (step === 10) {
      if (!validateChoice('smoke')) return;
      if (formData.smoke.value === 1) {
        setStep(11); // Go to smoke details
      } else {
        setStep(14); // Skip smoke details, go to chew
      }
      return;
    }

    if (step === 11) {
      if (!validateChoice('smokeStart')) return;
      setStep(12);
      return;
    }

    if (step === 12) {
      if (!validateChoice('smokeDuration')) return;
      setStep(13);
      return;
    }

    if (step === 13) {
      if (!validateChoice('smokeQty')) return;
      setStep(14);
      return;
    }

    if (step === 14) {
      if (!validateChoice('chew')) return;
      if (formData.chew.value === 1) {
        setStep(15); // Go to chew details
      } else {
        setStep(18); // Skip chew details, go to alcohol
      }
      return;
    }

    if (step === 15) {
      if (!validateChoice('chewStart')) return;
      setStep(16);
      return;
    }

    if (step === 16) {
      if (!validateChoice('chewDuration')) return;
      setStep(17);
      return;
    }

    if (step === 17) {
      if (!validateChoice('chewFreq')) return;
      setStep(18);
      return;
    }

    if (step === 18) {
      if (!validateChoice('alcohol')) return;
      // Calculate score
      let score = 0;
      score += formData.age?.value || 0;
      score += formData.gender?.value || 0;
      score += formData.smoke?.value || 0; 
      score += formData.smokeStart?.value || 0;
      score += formData.smokeDuration?.value || 0;
      score += formData.smokeQty?.value || 0;
      score += formData.chew?.value || 0;
      score += formData.chewStart?.value || 0;
      score += formData.chewDuration?.value || 0;
      score += formData.chewFreq?.value || 0;
      score += formData.alcohol?.value || 0;

      let riskLevel = 'Low Risk';
      let message = 'You are currently at a Low Risk. Maintain good oral hygiene and continue regular checkups.';
      
      // Low Risk: 0-2, Moderate Risk: 3-7, High Risk: 8-16
      if (score >= 8) {
        riskLevel = 'High Risk';
        message = 'You have been identified as High Risk. You are advised to consult with a nearby dental or medical professional for further clinical evaluation.';
      } else if (score >= 3) {
        riskLevel = 'Moderate Risk';
        message = 'You have been identified as Moderate Risk. You are advised to consult with a nearby dental or medical professional for further clinical evaluation.';
      }

      submitResult(riskLevel, message, false, score);
    }
  };

  const submitResult = (riskLevel, message, hasSymptoms, score = null) => {
    setLoading(true);
    setRiskResult({ riskLevel, message, score });
    
    const newSubmission = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      name: formData.name,
      state: formData.state,
      language: formData.language,
      hasSymptoms,
      score,
      result: riskLevel
    };
    
    // Save to localStorage
    try {
      const existing = localStorage.getItem('oral_submissions');
      const submissions = existing ? JSON.parse(existing) : [];
      submissions.push(newSubmission);
      localStorage.setItem('oral_submissions', JSON.stringify(submissions));
    } catch (err) {
      console.error('Error saving to localStorage', err);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(19); // Result page
    setLoading(false);
  };

  const ErrorMessage = () => errorMsg ? (
    <div style={{ padding: '1rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontWeight: '500', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span>⚠️</span> {errorMsg}
    </div>
  ) : null;

  const YesNoQuestion = ({ question, name }) => (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>{question}</div>
      <div className="option-list">
        <button 
          className={`option-card ${formData[name] === 'Yes' ? 'selected' : ''}`}
          onClick={() => setFormData({...formData, [name]: 'Yes'})}
        >
          <div className="option-card-content">
            <div className="option-icon">⚠️</div>
            <span className="option-label">Yes</span>
          </div>
          <div style={{ color: formData[name] === 'Yes' ? 'var(--primary)' : 'transparent' }}>✓</div>
        </button>
        <button 
          className={`option-card ${formData[name] === 'No' ? 'selected' : ''}`}
          onClick={() => setFormData({...formData, [name]: 'No'})}
        >
          <div className="option-card-content">
            <div className="option-icon">✅</div>
            <span className="option-label">No</span>
          </div>
          <div style={{ color: formData[name] === 'No' ? 'var(--primary)' : 'transparent' }}>✓</div>
        </button>
      </div>
    </div>
  );

  const OptionGroup = ({ question, name, options }) => (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>{question}</div>
      <div className="option-list">
        {options.map((opt, i) => {
          const isSelected = formData[name]?.label === opt.label;
          return (
            <button 
              key={i}
              className={`option-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setFormData({...formData, [name]: opt})}
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

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="content-area">
            <h1>Disclaimer & Consent</h1>
            <p style={{ marginBottom: '1rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Oral cancer is a serious health concern, and early detection is key to improving outcomes. Many people are unaware of their personal risk, and access to regular screening can be limited. Mobile applications can provide a simple, convenient way for individuals to assess their risk and get guidance on seeking professional care. This study focuses on developing and validating a mobile app for self-assessment of oral cancer risk, helping users understand their risk level and promoting timely consultation with dental or medical professionals.
            </p>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Your participation is completely voluntary and you have the right to refuse participation, refuse any question and withdraw at any time without any consequence whatsoever.
            </p>
            <ErrorMessage />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', textAlign: 'left', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <input 
                type="checkbox" 
                id="consentCheck" 
                checked={formData.consent} 
                onChange={(e) => setFormData({...formData, consent: e.target.checked})} 
                style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} 
              />
              <label htmlFor="consentCheck" style={{ fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer' }}>
                I confirm that I have read and understood the information above and voluntarily agree to participate in this study.
              </label>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="content-area">
            <h1>Select Language</h1>
            <p style={{ marginBottom: '2rem' }}>Choose your preferred language.</p>
            <ErrorMessage />
            <OptionGroup 
              question="Language" name="language"
              options={[{label: 'English', value: 'en'}, {label: 'Hindi', value: 'hi'}]}
            />
          </div>
        );
      case 2:
        return (
          <div className="content-area">
            <h1>Profile</h1>
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
      case 3:
        return (
          <div className="content-area">
            <h2>Symptom Screening (1/5)</h2>
            <ErrorMessage />
            <YesNoQuestion question="Do you have a mouth ulcer that has not healed for more than 3 weeks?" name="ulcer" />
          </div>
        );
      case 4:
        return (
          <div className="content-area">
            <h2>Symptom Screening (2/5)</h2>
            <ErrorMessage />
            <YesNoQuestion question="Do you have any red or white patch inside your mouth?" name="patch" />
          </div>
        );
      case 5:
        return (
          <div className="content-area">
            <h2>Symptom Screening (3/5)</h2>
            <ErrorMessage />
            <YesNoQuestion question="Do you have any lump or swelling in your mouth?" name="lump" />
          </div>
        );
      case 6:
        return (
          <div className="content-area">
            <h2>Symptom Screening (4/5)</h2>
            <ErrorMessage />
            <YesNoQuestion question="Do you have difficulty in opening your mouth or chewing food?" name="difficulty" />
          </div>
        );
      case 7:
        return (
          <div className="content-area">
            <h2>Symptom Screening (5/5)</h2>
            <ErrorMessage />
            <YesNoQuestion question="Do you experience a burning sensation in your mouth, especially while consuming hot or spicy food?" name="burning" />
          </div>
        );
      case 8:
        return (
          <div className="content-area">
            <h2>Risk Factors (Q1)</h2>
            <ErrorMessage />
            <OptionGroup 
              question="What is your age?" name="age"
              options={[{label: '< 30 years', value: 0, icon: '🧑'}, {label: '≥ 30 years', value: 1, icon: '👨'}]}
            />
          </div>
        );
      case 9:
        return (
          <div className="content-area">
            <h2>Risk Factors (Q2)</h2>
            <ErrorMessage />
            <OptionGroup 
              question="What is your gender?" name="gender"
              options={[{label: 'Female', value: 1, icon: '👩'}, {label: 'Male', value: 0, icon: '👨'}]}
            />
          </div>
        );
      case 10:
        return (
          <div className="content-area">
            <h2>Risk Factors (Q3)</h2>
            <ErrorMessage />
            <OptionGroup 
              question="Do you smoke any tobacco products?" name="smoke"
              options={[{label: 'No, I don\'t', value: 0, icon: '🚭'}, {label: 'Yes, I do', value: 1, icon: '🚬'}]}
            />
          </div>
        );
      case 11:
        return (
          <div className="content-area">
            <h2>Risk Factors (Q4)</h2>
            <ErrorMessage />
            <OptionGroup 
              question="Age at initiation of smoking" name="smokeStart"
              options={[{label: 'After 35 years', value: 0}, {label: '25 to 35 years', value: 1}, {label: 'Before 25 years', value: 2}]}
            />
          </div>
        );
      case 12:
        return (
          <div className="content-area">
            <h2>Risk Factors (Q5)</h2>
            <ErrorMessage />
            <OptionGroup 
              question="Duration of smoking" name="smokeDuration"
              options={[{label: '< 5 years', value: 0}, {label: '5 to 10 years', value: 1}, {label: '≥ 10 years', value: 2}]}
            />
          </div>
        );
      case 13:
        return (
          <div className="content-area">
            <h2>Risk Factors (Q6)</h2>
            <ErrorMessage />
            <OptionGroup 
              question="Quantity of smoking / day" name="smokeQty"
              options={[{label: '< 5 / day', value: 0}, {label: '5 to 10 / day', value: 1}, {label: '≥ 10 / day', value: 2}]}
            />
          </div>
        );
      case 14:
        return (
          <div className="content-area">
            <h2>Risk Factors (Q7)</h2>
            <ErrorMessage />
            <OptionGroup 
              question="Do you chew smokeless tobacco?" name="chew"
              options={[{label: 'No, I don\'t', value: 0, icon: '✅'}, {label: 'Yes, I do', value: 1, icon: '⚠️'}]}
            />
          </div>
        );
      case 15:
        return (
          <div className="content-area">
            <h2>Risk Factors (Q8)</h2>
            <ErrorMessage />
            <OptionGroup 
              question="Age at initiation of chewing tobacco" name="chewStart"
              options={[{label: 'After 30 years', value: 0}, {label: '20 to 30 years', value: 1}, {label: 'Before 20 years', value: 2}]}
            />
          </div>
        );
      case 16:
        return (
          <div className="content-area">
            <h2>Risk Factors (Q9)</h2>
            <ErrorMessage />
            <OptionGroup 
              question="Duration of chewing tobacco" name="chewDuration"
              options={[{label: '< 3 years', value: 0}, {label: '3 to 5 years', value: 1}, {label: '≥ 5 years', value: 2}]}
            />
          </div>
        );
      case 17:
        return (
          <div className="content-area">
            <h2>Risk Factors (Q10)</h2>
            <ErrorMessage />
            <OptionGroup 
              question="Frequency of chewing tobacco / day" name="chewFreq"
              options={[{label: '< 3 / day', value: 0}, {label: '3 to 5 / day', value: 1}, {label: '≥ 5 / day', value: 2}]}
            />
          </div>
        );
      case 18:
        return (
          <div className="content-area">
            <h2>Risk Factors (Q11)</h2>
            <ErrorMessage />
            <OptionGroup 
              question="Alcohol Consumption" name="alcohol"
              options={[{label: 'Never', value: 0, icon: '💧'}, {label: '< 3 days / wk', value: 1, icon: '🥂'}, {label: '≥ 3 days / wk', value: 2, icon: '🍻'}]}
            />
          </div>
        );
      case 19:
        const isHigh = riskResult.riskLevel === 'High Risk';
        const isMod = riskResult.riskLevel === 'Moderate Risk';
        const badgeClass = isHigh ? 'badge-high' : isMod ? 'badge-moderate' : 'badge-low';
        const icon = isHigh ? '🚨' : isMod ? '⚠️' : '✅';
        
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
              {riskResult.score !== null && (
                <div style={{ marginTop: '1rem', fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-main)' }}>
                  Total Risk Score: {riskResult.score}
                </div>
              )}
            </div>

            <div style={{ 
              padding: '2rem', 
              background: (isHigh || isMod) ? 'var(--warning-bg)' : 'var(--success-bg)', 
              border: `1px solid ${(isHigh || isMod) ? '#fde68a' : '#a7f3d0'}`,
              borderRadius: 'var(--radius-lg)', 
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: (isHigh || isMod) ? '#b45309' : '#047857', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📋</span> Official Recommendation
              </h3>
              <p style={{ fontSize: '1.15rem', color: (isHigh || isMod) ? '#92400e' : '#065f46', lineHeight: '1.6', fontWeight: '500' }}>
                {recommendationText}
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const totalSteps = 19;
  const progressPercent = step < 19 ? ((step + 1) / totalSteps) * 100 : 100;
  
  let sectionName = '';
  if (step === 0) sectionName = 'Consent';
  else if (step === 1) sectionName = 'Language';
  else if (step === 2) sectionName = 'Profile';
  else if (step >= 3 && step <= 7) sectionName = 'Symptoms';
  else if (step >= 8 && step <= 18) sectionName = 'Risk Factors';

  return (
    <main className="app-container">
      {step < 19 && (
        <div className="progress-header">
           <div className="progress-track">
             <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
           </div>
           <div className="progress-text">
             <span>{sectionName}</span>
             <span>{step + 1} of {totalSteps}</span>
           </div>
        </div>
      )}
      
      {renderContent()}
      
      <div className="bottom-bar">
        <div className="bottom-bar-inner" style={{ display: 'flex', gap: '1rem' }}>
          {step > 0 && step < 19 && (
            <button className="btn btn-outline" onClick={() => setStep(step - 1)} disabled={loading} style={{ flex: '1' }}>
              Back
            </button>
          )}
          {step < 19 ? (
            <button className="btn btn-primary" onClick={handleNext} disabled={loading} style={{ flex: '2' }}>
              {loading ? 'Processing...' : 'Continue'}
            </button>
          ) : (
            <button className="btn btn-outline" onClick={() => router.push('/')} style={{ width: '100%' }}>
              Return Home
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
