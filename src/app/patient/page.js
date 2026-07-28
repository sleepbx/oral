'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PatientPortal() {
  const router = useRouter();
  const [step, setStep] = useState(0); 
  const [history, setHistory] = useState([]);
  const [formData, setFormData] = useState({
    language: 'hi', // Hindi first
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

  const t = {
    en: {
      langHeader: "Select Language",
      langDesc: "Choose your preferred language.",
      profile: "Profile",
      profileDesc: "Enter your details to begin the screening.",
      nameLabel: "Full Name",
      stateLabel: "State",
      continueBtn: "Continue",
      backBtn: "Back",
      processing: "Processing...",
      homeBtn: "Return Home",
      sympHeader: "Symptom Screening",
      yes: "Yes",
      no: "No",
      q_ulcer: "Do you have a mouth ulcer that has not healed for more than 3 weeks?",
      q_patch: "Do you have any red or white patch inside your mouth?",
      q_lump: "Do you have any lump or swelling in your mouth?",
      q_diff: "Do you have difficulty in opening your mouth or chewing food?",
      q_burn: "Do you experience a burning sensation in your mouth, especially while consuming hot or spicy food?",
      riskHeader: "Risk Factors",
      q_age: "What is your age?",
      a_age0: "Less than 30 years",
      a_age1: "≥ 30 years",
      q_gender: "What is your gender?",
      a_gender0: "Male",
      a_gender1: "Female",
      q_smoke: "Do you smoke any tobacco products such as cigarettes or beedis?",
      q_smokeStart: "At what age did you start smoking tobacco?",
      a_never: "Never",
      a_after25: "After 25 years",
      a_before25: "Before 25 years",
      q_smokeDur: "For how many years have you been smoking?",
      a_less10: "Less than 10 years",
      a_more10: "More than 10 years",
      q_smokeQty: "On average, how many cigarettes/beedis do you smoke per day?",
      a_less10day: "Less than 10 per day",
      a_more10day: "More than 10 per day",
      q_chew: "Do you chew any form of smokeless tobacco such as gutka, khaini, gudaku, paan with tobacco, or supari?",
      q_chewStart: "At what age did you start using smokeless tobacco?",
      a_after20: "After 20 years",
      a_before20: "Before 20 years",
      q_chewDur: "For how many years have you been using smokeless tobacco?",
      a_less5: "Less than 5 years",
      a_more5: "More than 5 years",
      q_chewFreq: "On average, how many times do you chew smokeless tobacco per day?",
      a_less5day: "Less than 5 times per day",
      a_more5day: "More than 5 times per day",
      q_alcohol: "Do you consume alcohol?",
      a_less3: "Mostly <3 days a week",
      a_more3: "Mostly >3 days a week",
      resHeader: "Screening Complete",
      resDesc: "Here is your personalized oral health risk assessment.",
      classTitle: "Final Risk Classification",
      scoreTitle: "Total Risk Score:",
      recTitle: "Official Recommendation",
      highRiskRec: "Automated In-App Notification: You are advised to consult with a nearby dental or medical professional for further clinical evaluation.",
      lowRiskRec: "You are currently at a Low Risk. Maintain good oral hygiene and continue regular checkups.",
      highRisk: "High Risk",
      modRisk: "Moderate Risk",
      lowRisk: "Low Risk",
      errFill: "Please fill out all fields to continue.",
      errSelect: "Please select an option to continue.",
      disclaimerTitle: "Disclaimer",
      disclaimerText: "Oral cancer is a serious health concern, and early detection is key to improving outcomes. This application is for informational self-assessment purposes only and does not substitute professional medical advice, diagnosis, or treatment. Your participation was completely voluntary."
    },
    hi: {
      langHeader: "भाषा चुनें",
      langDesc: "अपनी पसंदीदा भाषा चुनें।",
      profile: "प्रोफ़ाइल",
      profileDesc: "स्क्रीनिंग शुरू करने के लिए अपना विवरण दर्ज करें।",
      nameLabel: "पूरा नाम",
      stateLabel: "राज्य",
      continueBtn: "जारी रखें",
      backBtn: "पीछे",
      processing: "प्रसंस्करण...",
      homeBtn: "होम पर लौटें",
      sympHeader: "लक्षण स्क्रीनिंग",
      yes: "हाँ",
      no: "नहीं",
      q_ulcer: "क्या आपके मुँह में ऐसा घाव (अल्सर) है जो 3 सप्ताह से अधिक समय से ठीक नहीं हुआ है?",
      q_patch: "क्या आपके मुँह के अंदर कोई लाल या सफेद धब्बा है?",
      q_lump: "क्या आपके मुँह में कोई गाँठ या सूजन है?",
      q_diff: "क्या आपको मुँह खोलने या भोजन चबाने में कठिनाई होती है?",
      q_burn: "क्या आपको गरम या मसालेदार भोजन लेने पर मुँह में जलन का अनुभव होता है?",
      riskHeader: "जोखिम कारक",
      q_age: "आपकी आयु क्या है?",
      a_age0: "30 वर्ष से कम",
      a_age1: "30 वर्ष से अधिक",
      q_gender: "आपका लिंग क्या है?",
      a_gender0: "पुरुष",
      a_gender1: "महिला",
      q_smoke: "क्या आप किसी भी प्रकार के तंबाकू उत्पाद जैसे सिगरेट या बीड़ी का धूम्रपान करते हैं?",
      q_smokeStart: "आपने तंबाकू का धूम्रपान किस आयु में प्रारम्भ किया?",
      a_never: "कभी नहीं",
      a_after25: "25 वर्ष की आयु के बाद",
      a_before25: "25 वर्ष की आयु से पहले",
      q_smokeDur: "आप कितने वर्षों से धूम्रपान कर रहे हैं?",
      a_less10: "10 वर्ष से कम",
      a_more10: "10 वर्ष से अधिक",
      q_smokeQty: "औसतन, आप प्रतिदिन कितनी सिगरेट/बीड़ी का धूम्रपान करते हैं?",
      a_less10day: "प्रतिदिन 10 से कम",
      a_more10day: "प्रतिदिन 10 से अधिक",
      q_chew: "क्या आप धूम्ररहित तंबाकू जैसे गुटखा, खैनी, गुड़ाकू, तंबाकू युक्त पान या सुपारी का उपयोग करते हैं?",
      q_chewStart: "आपने धूम्ररहित तंबाकू का उपयोग किस आयु में प्रारम्भ किया?",
      a_after20: "20 वर्ष की आयु के बाद",
      a_before20: "20 वर्ष की आयु से पहले",
      q_chewDur: "आप कितने वर्षों से धूम्ररहित तंबाकू का उपयोग कर रहे हैं?",
      a_less5: "5 वर्ष से कम",
      a_more5: "5 वर्ष से अधिक",
      q_chewFreq: "औसतन, आप प्रतिदिन कितनी बार धूम्ररहित तंबाकू का उपयोग करते हैं?",
      a_less5day: "प्रतिदिन 5 बार से कम",
      a_more5day: "प्रतिदिन 5 बार से अधिक",
      q_alcohol: "क्या आप मद्यपान करते हैं?",
      a_less3: "सप्ताह में अधिकांशतः 3 दिनों से कम",
      a_more3: "सप्ताह में अधिकांशतः 3 दिनों से अधिक",
      resHeader: "स्क्रीनिंग पूर्ण",
      resDesc: "यहाँ आपका व्यक्तिगत मौखिक स्वास्थ्य जोखिम मूल्यांकन है।",
      classTitle: "अंतिम जोखिम वर्गीकरण",
      scoreTitle: "कुल जोखिम स्कोर:",
      recTitle: "आधिकारिक सिफारिश",
      highRiskRec: "स्वचालित इन-ऐप अधिसूचना: आपको आगे के नैदानिक ​​मूल्यांकन के लिए पास के दंत या चिकित्सा पेशेवर से परामर्श करने की सलाह दी जाती है।",
      lowRiskRec: "आप वर्तमान में कम जोखिम में हैं। अच्छी मौखिक स्वच्छता बनाए रखें और नियमित जांच जारी रखें।",
      highRisk: "उच्च जोखिम",
      modRisk: "मध्यम जोखिम",
      lowRisk: "कम जोखिम",
      errFill: "कृपया जारी रखने के लिए सभी फ़ील्ड भरें।",
      errSelect: "कृपया जारी रखने के लिए एक विकल्प चुनें।",
      disclaimerTitle: "अस्वीकरण",
      disclaimerText: "मुँह का कैंसर एक गंभीर स्वास्थ्य समस्या है, और इसका जल्दी पता लगाना परिणामों को सुधारने में महत्वपूर्ण है। यह एप्लिकेशन केवल सूचनात्मक स्व-मूल्यांकन उद्देश्यों के लिए है और पेशेवर चिकित्सा सलाह का विकल्प नहीं है। आपकी भागीदारी पूरी तरह से स्वैच्छिक थी।"
    }
  };

  const langKey = typeof formData.language === 'string' ? formData.language : formData.language?.value || 'hi';
  const str = t[langKey] || t['hi'];

  const goNext = (nextStep) => {
    setHistory([...history, step]);
    setStep(nextStep);
  };

  const handleNext = () => {
    setErrorMsg('');
    
    // Step 0: Language
    if (step === 0) {
      goNext(1);
      return;
    }
    
    // Step 1: Profile
    if (step === 1) {
      if (!formData.name || !formData.state) return setErrorMsg(str.errFill);
      goNext(2);
      return;
    }

    // Stage 1 questions
    if (step >= 2 && step <= 6) {
      const stage1Keys = ['ulcer', 'patch', 'lump', 'difficulty', 'burning'];
      const key = stage1Keys[step - 2];
      if (formData[key] === null) return setErrorMsg(str.errSelect);
      
      if (step === 6) {
        if (formData.ulcer === 'Yes' || formData.patch === 'Yes' || formData.lump === 'Yes' || formData.difficulty === 'Yes' || formData.burning === 'Yes') {
          submitResult(str.highRisk, str.highRiskRec, true);
          return;
        }
      }
      goNext(step + 1);
      return;
    }

    // Stage 2 Questions
    const validateChoice = (key) => {
      if (formData[key] === null) {
        setErrorMsg(str.errSelect);
        return false;
      }
      return true;
    };

    if (step === 7) {
      if (!validateChoice('age')) return;
      goNext(8);
      return;
    }
    
    if (step === 8) {
      if (!validateChoice('gender')) return;
      goNext(9);
      return;
    }
    
    if (step === 9) {
      if (!validateChoice('smoke')) return;
      if (formData.smoke.value === 1) {
        goNext(10);
      } else {
        goNext(13); // Skip smoke details
      }
      return;
    }

    if (step === 10) {
      if (!validateChoice('smokeStart')) return;
      goNext(11);
      return;
    }

    if (step === 11) {
      if (!validateChoice('smokeDuration')) return;
      goNext(12);
      return;
    }

    if (step === 12) {
      if (!validateChoice('smokeQty')) return;
      goNext(13);
      return;
    }

    if (step === 13) {
      if (!validateChoice('chew')) return;
      if (formData.chew.value === 1) {
        goNext(14);
      } else {
        goNext(17); // Skip chew details
      }
      return;
    }

    if (step === 14) {
      if (!validateChoice('chewStart')) return;
      goNext(15);
      return;
    }

    if (step === 15) {
      if (!validateChoice('chewDuration')) return;
      goNext(16);
      return;
    }

    if (step === 16) {
      if (!validateChoice('chewFreq')) return;
      goNext(17);
      return;
    }

    if (step === 17) {
      if (!validateChoice('alcohol')) return;
      
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

      let riskLevel = str.lowRisk;
      let message = str.lowRiskRec;
      
      if (score >= 8) {
        riskLevel = str.highRisk;
        message = str.highRiskRec;
      } else if (score >= 3) {
        riskLevel = str.modRisk;
        message = str.highRiskRec;
      }

      submitResult(riskLevel, message, false, score);
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    const newHistory = [...history];
    const prevStep = newHistory.pop();
    setHistory(newHistory);
    setStep(prevStep);
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
    
    try {
      const existing = localStorage.getItem('oral_submissions');
      const submissions = existing ? JSON.parse(existing) : [];
      submissions.push(newSubmission);
      localStorage.setItem('oral_submissions', JSON.stringify(submissions));
    } catch (err) {
      console.error('Error saving to localStorage', err);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // push step 18 to history so back button is disabled on result
    setHistory([...history, step]);
    setStep(18); // Result page
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
            <span className="option-label">{str.yes}</span>
          </div>
          <div style={{ color: formData[name] === 'Yes' ? 'var(--primary)' : 'transparent' }}>✓</div>
        </button>
        <button 
          className={`option-card ${formData[name] === 'No' ? 'selected' : ''}`}
          onClick={() => setFormData({...formData, [name]: 'No'})}
        >
          <div className="option-card-content">
            <div className="option-icon">✅</div>
            <span className="option-label">{str.no}</span>
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
          const isSelected = formData[name]?.value === opt.value;
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
            <h1>{str.langHeader}</h1>
            <p style={{ marginBottom: '2rem' }}>{str.langDesc}</p>
            <ErrorMessage />
            <OptionGroup 
              question="" name="language"
              options={[{label: 'हिन्दी (Hindi)', value: 'hi'}, {label: 'English', value: 'en'}]}
            />
          </div>
        );
      case 1:
        return (
          <div className="content-area">
            <h1>{str.profile}</h1>
            <p style={{ marginBottom: '2rem' }}>{str.profileDesc}</p>
            <ErrorMessage />
            <div className="input-group">
              <label className="label">{str.nameLabel}</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label className="label">{str.stateLabel}</label>
              <input 
                type="text" 
                list="states-list"
                className="input-field" 
                placeholder="State"
                value={formData.state}
                onChange={e => setFormData({...formData, state: e.target.value})}
              />
              <datalist id="states-list">
                {indianStates.map(s => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="content-area">
            <h2>{str.sympHeader} (1/5)</h2>
            <ErrorMessage />
            <YesNoQuestion question={str.q_ulcer} name="ulcer" />
          </div>
        );
      case 3:
        return (
          <div className="content-area">
            <h2>{str.sympHeader} (2/5)</h2>
            <ErrorMessage />
            <YesNoQuestion question={str.q_patch} name="patch" />
          </div>
        );
      case 4:
        return (
          <div className="content-area">
            <h2>{str.sympHeader} (3/5)</h2>
            <ErrorMessage />
            <YesNoQuestion question={str.q_lump} name="lump" />
          </div>
        );
      case 5:
        return (
          <div className="content-area">
            <h2>{str.sympHeader} (4/5)</h2>
            <ErrorMessage />
            <YesNoQuestion question={str.q_diff} name="difficulty" />
          </div>
        );
      case 6:
        return (
          <div className="content-area">
            <h2>{str.sympHeader} (5/5)</h2>
            <ErrorMessage />
            <YesNoQuestion question={str.q_burn} name="burning" />
          </div>
        );
      case 7:
        return (
          <div className="content-area">
            <h2>{str.riskHeader} (Q1)</h2>
            <ErrorMessage />
            <OptionGroup 
              question={str.q_age} name="age"
              options={[{label: str.a_age0, value: 0, icon: '🧑'}, {label: str.a_age1, value: 1, icon: '👨'}]}
            />
          </div>
        );
      case 8:
        return (
          <div className="content-area">
            <h2>{str.riskHeader} (Q2)</h2>
            <ErrorMessage />
            <OptionGroup 
              question={str.q_gender} name="gender"
              options={[{label: str.a_gender1, value: 1, icon: '👩'}, {label: str.a_gender0, value: 0, icon: '👨'}]}
            />
          </div>
        );
      case 9:
        return (
          <div className="content-area">
            <h2>{str.riskHeader} (Q3)</h2>
            <ErrorMessage />
            <OptionGroup 
              question={str.q_smoke} name="smoke"
              options={[{label: str.no, value: 0, icon: '🚭'}, {label: str.yes, value: 1, icon: '🚬'}]}
            />
          </div>
        );
      case 10:
        return (
          <div className="content-area">
            <h2>{str.riskHeader} (Q4)</h2>
            <ErrorMessage />
            <OptionGroup 
              question={str.q_smokeStart} name="smokeStart"
              options={[{label: str.a_never, value: 0}, {label: str.a_after25, value: 1}, {label: str.a_before25, value: 2}]}
            />
          </div>
        );
      case 11:
        return (
          <div className="content-area">
            <h2>{str.riskHeader} (Q5)</h2>
            <ErrorMessage />
            <OptionGroup 
              question={str.q_smokeDur} name="smokeDuration"
              options={[{label: str.a_never, value: 0}, {label: str.a_less10, value: 1}, {label: str.a_more10, value: 2}]}
            />
          </div>
        );
      case 12:
        return (
          <div className="content-area">
            <h2>{str.riskHeader} (Q6)</h2>
            <ErrorMessage />
            <OptionGroup 
              question={str.q_smokeQty} name="smokeQty"
              options={[{label: str.a_never, value: 0}, {label: str.a_less10day, value: 1}, {label: str.a_more10day, value: 2}]}
            />
          </div>
        );
      case 13:
        return (
          <div className="content-area">
            <h2>{str.riskHeader} (Q7)</h2>
            <ErrorMessage />
            <OptionGroup 
              question={str.q_chew} name="chew"
              options={[{label: str.no, value: 0, icon: '✅'}, {label: str.yes, value: 1, icon: '⚠️'}]}
            />
          </div>
        );
      case 14:
        return (
          <div className="content-area">
            <h2>{str.riskHeader} (Q8)</h2>
            <ErrorMessage />
            <OptionGroup 
              question={str.q_chewStart} name="chewStart"
              options={[{label: str.a_never, value: 0}, {label: str.a_after20, value: 1}, {label: str.a_before20, value: 2}]}
            />
          </div>
        );
      case 15:
        return (
          <div className="content-area">
            <h2>{str.riskHeader} (Q9)</h2>
            <ErrorMessage />
            <OptionGroup 
              question={str.q_chewDur} name="chewDuration"
              options={[{label: str.a_never, value: 0}, {label: str.a_less5, value: 1}, {label: str.a_more5, value: 2}]}
            />
          </div>
        );
      case 16:
        return (
          <div className="content-area">
            <h2>{str.riskHeader} (Q10)</h2>
            <ErrorMessage />
            <OptionGroup 
              question={str.q_chewFreq} name="chewFreq"
              options={[{label: str.a_never, value: 0}, {label: str.a_less5day, value: 1}, {label: str.a_more5day, value: 2}]}
            />
          </div>
        );
      case 17:
        return (
          <div className="content-area">
            <h2>{str.riskHeader} (Q11)</h2>
            <ErrorMessage />
            <OptionGroup 
              question={str.q_alcohol} name="alcohol"
              options={[{label: str.a_never, value: 0, icon: '💧'}, {label: str.a_less3, value: 1, icon: '🥂'}, {label: str.a_more3, value: 2, icon: '🍻'}]}
            />
          </div>
        );
      case 18:
        const isHigh = riskResult.riskLevel === str.highRisk;
        const isMod = riskResult.riskLevel === str.modRisk;
        const badgeClass = isHigh ? 'badge-high' : isMod ? 'badge-moderate' : 'badge-low';
        const icon = isHigh ? '🚨' : isMod ? '⚠️' : '✅';

        return (
          <div className="content-area" style={{ display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ fontSize: '4.5rem', marginBottom: '1rem', animation: 'fadeIn 0.5s ease-out' }}>{icon}</div>
              <h1 style={{ fontSize: '2.25rem', color: 'var(--text-main)' }}>{str.resHeader}</h1>
              <p style={{ color: 'var(--text-muted)' }}>{str.resDesc}</p>
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
                {str.classTitle}
              </div>
              <div className={`badge ${badgeClass}`} style={{ fontSize: '1.75rem', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)' }}>
                {riskResult.riskLevel}
              </div>
              {riskResult.score !== null && (
                <div style={{ marginTop: '1rem', fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-main)' }}>
                  {str.scoreTitle} {riskResult.score}
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
                <span>📋</span> {str.recTitle}
              </h3>
              <p style={{ fontSize: '1.15rem', color: (isHigh || isMod) ? '#92400e' : '#065f46', lineHeight: '1.6', fontWeight: '500' }}>
                {riskResult.message}
              </p>
            </div>
            
            <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginTop: '1rem' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{str.disclaimerTitle}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {str.disclaimerText}
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const totalSteps = 18;
  // If we are at step 18 (Result), progress is 100%. Otherwise it's step/18 * 100
  const progressPercent = step < 18 ? ((step + 1) / totalSteps) * 100 : 100;
  
  let sectionName = '';
  if (step === 0) sectionName = str.langHeader;
  else if (step === 1) sectionName = str.profile;
  else if (step >= 2 && step <= 6) sectionName = str.sympHeader;
  else if (step >= 7 && step <= 17) sectionName = str.riskHeader;

  return (
    <main className="app-container">
      {step < 18 && (
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
          {step > 0 && step < 18 && (
            <button className="btn btn-outline" onClick={handleBack} disabled={loading} style={{ flex: '1' }}>
              {str.backBtn}
            </button>
          )}
          {step < 18 ? (
            <button className="btn btn-primary" onClick={handleNext} disabled={loading} style={{ flex: '2' }}>
              {loading ? str.processing : str.continueBtn}
            </button>
          ) : (
            <button className="btn btn-outline" onClick={() => router.push('/')} style={{ width: '100%' }}>
              {str.homeBtn}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
