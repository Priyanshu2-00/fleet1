import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MOCK_STOP_DETAILS = {
  farmer: 'Suresh K.',
  produce: 'Tomatoes',
  expectedQty: 2.0,
  location: 'Farm B (Chinchwad)'
};

const PickupConfirmation = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const details = MOCK_STOP_DETAILS;
  
  const [actualQty, setActualQty] = useState(details.expectedQty);
  const [notes, setNotes] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      alert('Pickup Confirmed! Quantities updated.');
      navigate(`/driver/trip/${tripId}`);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in p-2">
      <button className="btn btn-ghost mb-4 pl-0" onClick={() => navigate(-1)}>← Back to Trip</button>
      
      <h2 className="mb-6">Confirm Pickup</h2>

      <div className="card mb-6 shadow-sm">
        <div className="text-xs text-secondary mb-1">Location</div>
        <div className="font-bold mb-4 text-lg">{details.location}</div>
        
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
          <div>
            <div className="text-xs text-secondary mb-1">Farmer</div>
            <div className="font-bold">{details.farmer}</div>
          </div>
          <div>
            <div className="text-xs text-secondary mb-1">Produce</div>
            <div className="font-bold">{details.produce}</div>
          </div>
        </div>
      </div>

      <div className="card mb-6 border-accent shadow-lg relative overflow-hidden" style={{ borderColor: 'var(--color-accent-info)' }}>
        <div className="absolute top-0 right-0 p-2 bg-info/20 rounded-bl-lg text-xs font-bold text-info" style={{ backgroundColor: 'var(--color-accent-info-transparent)', color: 'var(--color-accent-info)' }}>EXPECTED: {details.expectedQty}T</div>
        
        <label className="form-label text-lg mb-4">Actual Quantity Loaded (Tons)</label>
        
        <div className="flex items-center gap-4 mb-2">
          <button 
            type="button" 
            className="w-12 h-12 rounded-full bg-white/5 border border-border flex items-center justify-center text-xl font-bold active:bg-white/10 transition-colors"
            onClick={() => setActualQty(Math.max(0, actualQty - 0.1))}
          >
            -
          </button>
          
          <input 
            type="number" 
            className="input-field text-center text-3xl font-bold py-4 flex-1 bg-black/20"
            value={actualQty.toFixed(1)}
            onChange={(e) => setActualQty(parseFloat(e.target.value) || 0)}
            step="0.1"
          />
          
          <button 
            type="button" 
            className="w-12 h-12 rounded-full bg-white/5 border border-border flex items-center justify-center text-xl font-bold active:bg-white/10 transition-colors"
            onClick={() => setActualQty(actualQty + 0.1)}
          >
            +
          </button>
        </div>
        {actualQty !== details.expectedQty && (
          <div className="text-xs text-warning mt-2 text-center" style={{ color: 'var(--color-accent-secondary)' }}>
            ⚠️ Quantity differs from expectation
          </div>
        )}
      </div>

      <div className="form-group mb-8">
        <label className="form-label">Notes (Optional)</label>
        <textarea 
          className="input-field min-h-[100px]" 
          placeholder="Any issues with quality or loading?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
      </div>

      <button 
        className="btn btn-primary w-full py-4 text-lg font-bold shadow-lg flex justify-center items-center gap-2"
        onClick={handleConfirm}
        disabled={isConfirming}
      >
        {isConfirming ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Confirming...
          </>
        ) : '✅ Confirm & Continue'}
      </button>
    </div>
  );
};

export default PickupConfirmation;
