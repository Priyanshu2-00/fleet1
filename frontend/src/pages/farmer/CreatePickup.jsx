import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PRODUCE_TYPES = ['Onions', 'Tomatoes', 'Potatoes', 'Wheat', 'Rice', 'Sugarcane', 'Grapes', 'Pomegranate', 'Soybean', 'Jowar'];

const CreatePickup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    produce: 'Onions',
    quantity: '',
    pickupLocation: 'Farm 1 (Nashik)',
    destination: 'Mumbai APMC',
    priority: 'NORMAL',
    pickupDate: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/farmer/shipments'), 2000);
    }, 1500);
  };

  if (success) {
    return (
      <div className="card text-center p-12 animate-fade-in max-w-2xl mx-auto mt-8">
        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-4)' }}>✅</div>
        <h2>Pickup Request Created!</h2>
        <p>Your tracking ID is <strong>SHP-{Math.floor(Math.random() * 9000) + 1000}</strong></p>
        <p className="text-sm">Redirecting to your shipments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h2 className="mb-6">Request New Pickup</h2>
      
      <div className="card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="form-label">Produce Type</label>
              <select name="produce" value={formData.produce} onChange={handleChange} className="input-field" required>
                {PRODUCE_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            
            <div className="form-group mb-0">
              <label className="form-label">Quantity (Tons)</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="input-field" placeholder="e.g. 5" min="0.1" step="0.1" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="form-label">Pickup Location</label>
              <select name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} className="input-field" required>
                <option value="Farm 1 (Nashik)">Farm 1 (Nashik)</option>
                <option value="Farm 2 (Pune)">Farm 2 (Pune)</option>
              </select>
            </div>
            
            <div className="form-group mb-0">
              <label className="form-label">Destination</label>
              <select name="destination" value={formData.destination} onChange={handleChange} className="input-field" required>
                <option value="Mumbai APMC">Mumbai APMC</option>
                <option value="Vashi Market">Vashi Market</option>
                <option value="Pune Market">Pune Market</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="form-label">Priority</label>
              <div className="flex gap-4 mt-2">
                {['NORMAL', 'HIGH', 'URGENT'].map(p => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="radio" name="priority" value={p} checked={formData.priority === p} onChange={handleChange} />
                    {p}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group mb-0">
              <label className="form-label">Preferred Pickup Date</label>
              <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} className="input-field" required />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePickup;
