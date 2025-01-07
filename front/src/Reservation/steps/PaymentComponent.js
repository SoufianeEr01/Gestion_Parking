import React, { useState } from 'react';
import { CreditCard, Lock, Calendar, User } from 'lucide-react';
import './PaymentComponent.css';

function PaymentComponent() {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Paiement soumis:', formData);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1 className="title">Paiement Sécurisé</h1>
          <Lock size={24} color="#059669" />
        </div>

        <div className="credit-card">
          <div className="credit-card-header">
            <CreditCard size={32} color="white" />
            <p className="amount">€49.99</p>
          </div>
          <div className="credit-card-details">
            <p>**** **** **** 4242</p>
            <p>Valide jusqu'à 12/25</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Numéro de carte</label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="input"
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
              />
              <CreditCard className="input-icon" size={20} />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Titulaire de la carte</label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="John Doe"
                className="input"
                value={formData.cardHolder}
                onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
              />
              <User className="input-icon" size={20} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Date d'expiration</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="MM/AA"
                  className="input"
                  value={formData.expiry}
                  onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                />
                <Calendar className="input-icon" size={20} />
              </div>
            </div>
            <div className="form-group">
              <label className="label">CVV</label>
              <input
                type="text"
                placeholder="123"
                className="input"
                value={formData.cvv}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="submit-button">
            <Lock size={20} />
            <span>Payer maintenant</span>
          </button>
        </form>

        <div className="security-notice">
          <Lock size={16} />
          <p>Paiement sécurisé par SSL</p>
        </div>
      </div>
    </div>
  );
}

export default PaymentComponent;
