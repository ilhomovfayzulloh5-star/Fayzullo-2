import React, { useState } from 'react';

const MathSetupModal = ({ onClose, onStartGame, gameType }) => {
  const [step, setStep] = useState((gameType === 'english' || gameType === 'russian' || gameType === 'mother' || gameType === 'biology' || gameType === 'chemistry' || gameType === 'physics' || gameType === 'history' || gameType === 'geography' || gameType === 'informatics' || gameType === 'literature' || gameType === 'turkish') ? 3 : 1);
  
  // Step 1: Amallar state
  const [operations, setOperations] = useState(['addition']); // 'addition', 'subtraction', 'multiplication', 'division'

  // Step 2: Qiyinlik state
  const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard'

  // Step 3: Jamoalar state
  const [blueTeam, setBlueTeam] = useState('');
  const [redTeam, setRedTeam] = useState('');

  const toggleOperation = (op) => {
    if (operations.includes(op)) {
      if (operations.length > 1) {
        setOperations(operations.filter(item => item !== op));
      }
    } else {
      setOperations([...operations, op]);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onStartGame({
        gameType: gameType || 'math',
        operations,
        difficulty,
        blueTeam: blueTeam.trim() || "1-Jamoa",
        redTeam: redTeam.trim() || "2-Jamoa"
      });
    }
  };

  const handleBack = () => {
    if (gameType === 'english' || gameType === 'russian' || gameType === 'mother' || gameType === 'biology' || gameType === 'chemistry' || gameType === 'physics' || gameType === 'history' || gameType === 'geography' || gameType === 'informatics' || gameType === 'literature' || gameType === 'turkish') {
      onClose();
      return;
    }
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="math-setup-backdrop">
      <div className="math-setup-modal">
        <h2 className="math-setup-title">JAMOALARNI TAYYORLANG</h2>
        
        {/* Step Indicator */}
        {(gameType !== 'english' && gameType !== 'russian' && gameType !== 'mother' && gameType !== 'biology' && gameType !== 'chemistry' && gameType !== 'physics' && gameType !== 'history' && gameType !== 'geography' && gameType !== 'informatics' && gameType !== 'literature' && gameType !== 'turkish') && (
          <div className="math-setup-steps">
            <div className="step-container">
              <div className={`step-circle ${step >= 1 ? 'active' : ''}`}>1</div>
              <div className="step-label">Amallar</div>
            </div>
            <div className="step-line"></div>
            <div className="step-container">
              <div className={`step-circle ${step >= 2 ? 'active' : ''}`}>2</div>
              <div className="step-label">Qiyinlik</div>
            </div>
            <div className="step-line"></div>
            <div className="step-container">
              <div className={`step-circle ${step >= 3 ? 'active' : ''}`}>3</div>
              <div className="step-label">Jamoalar</div>
            </div>
          </div>
        ) /* close of gameType check */}

        {/* Content Body */}
        <div className="math-setup-content">
          {step === 1 && (
            <div className="step-content-body">
              <h3 className="step-content-title">Amallar</h3>
              <p className="step-content-desc">Bir yoki bir nechta amallarni tanlang</p>
              
              <div className="operations-grid">
                <button 
                  type="button" 
                  className={`operation-card ${operations.includes('addition') ? 'active' : ''}`}
                  onClick={() => toggleOperation('addition')}
                >
                  <div className="operation-icon blue">+</div>
                  <span className="operation-text">Qo'shish</span>
                </button>

                <button 
                  type="button" 
                  className={`operation-card ${operations.includes('subtraction') ? 'active' : ''}`}
                  onClick={() => toggleOperation('subtraction')}
                >
                  <div className="operation-icon">-</div>
                  <span className="operation-text">Ayirish</span>
                </button>

                <button 
                  type="button" 
                  className={`operation-card ${operations.includes('multiplication') ? 'active' : ''}`}
                  onClick={() => toggleOperation('multiplication')}
                >
                  <div className="operation-icon">×</div>
                  <span className="operation-text">Ko'paytirish</span>
                </button>

                <button 
                  type="button" 
                  className={`operation-card ${operations.includes('division') ? 'active' : ''}`}
                  onClick={() => toggleOperation('division')}
                >
                  <div className="operation-icon">÷</div>
                  <span className="operation-text">Bo'lish</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content-body">
              <h3 className="step-content-title" style={{ display: 'none' }}>Qiyinlik</h3>
              <p className="step-content-desc" style={{ fontSize: '16px', fontWeight: 'bold', color: '#475569' }}>Qiyinlik darajasi</p>
              
              <div className="difficulty-grid">
                <button 
                  type="button" 
                  className={`difficulty-card ${difficulty === 'easy' ? 'active' : ''}`}
                  onClick={() => setDifficulty('easy')}
                >
                  <span className="diff-icon">💡</span>
                  <span className="diff-text">Oson</span>
                </button>

                <button 
                  type="button" 
                  className={`difficulty-card ${difficulty === 'medium' ? 'active' : ''}`}
                  onClick={() => setDifficulty('medium')}
                >
                  <span className="diff-icon">🧠</span>
                  <span className="diff-text">O'rta</span>
                </button>

                <button 
                  type="button" 
                  className={`difficulty-card ${difficulty === 'hard' ? 'active' : ''}`}
                  onClick={() => setDifficulty('hard')}
                >
                  <svg className="diff-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  <span className="diff-text">Qiyin</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content-body">
              <div className="teams-setup-wrapper">
                {/* Blue Team */}
                <div className="team-setup-card blue">
                  <div className="team-icon-label">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>1-JAMOA (KO'K)</span>
                  </div>
                  <input 
                    type="text" 
                    className="team-name-input" 
                    placeholder="Jamoa nomi"
                    value={blueTeam}
                    onChange={(e) => setBlueTeam(e.target.value)}
                  />
                </div>

                <div className="teams-vs-text">VS</div>

                {/* Red Team */}
                <div className="team-setup-card red">
                  <div className="team-icon-label">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>2-JAMOA (QIZIL)</span>
                  </div>
                  <input 
                    type="text" 
                    className="team-name-input" 
                    placeholder="Jamoa nomi"
                    value={redTeam}
                    onChange={(e) => setRedTeam(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`math-setup-footer ${(gameType === 'english' || gameType === 'russian' || gameType === 'mother' || gameType === 'biology' || gameType === 'chemistry' || gameType === 'physics' || gameType === 'history' || gameType === 'geography' || gameType === 'informatics' || gameType === 'literature' || gameType === 'turkish') ? 'english-footer' : ''}`}>
          {(gameType !== 'english' && gameType !== 'russian' && gameType !== 'mother' && gameType !== 'biology' && gameType !== 'chemistry' && gameType !== 'physics' && gameType !== 'history' && gameType !== 'geography' && gameType !== 'informatics' && gameType !== 'literature' && gameType !== 'turkish') && (
            <button type="button" className="setup-btn back" onClick={handleBack}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              ORTGA
            </button>
          )}
          
          <button type="button" className="setup-btn next" onClick={handleNext}>
            {step === 3 ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                O'YINNI BOSHLASH
              </>
            ) : (
              <>
                KEYINGI
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MathSetupModal;
