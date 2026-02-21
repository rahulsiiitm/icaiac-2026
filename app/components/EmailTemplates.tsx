import * as React from 'react';

// Email sent when user registers/submits proof
export const RegistrationReceivedEmail = ({ name, utr }: { name: string, utr: string }) => (
  <div style={{ fontFamily: 'serif', color: '#1a1a1a' }}>
    <h1 style={{ color: '#e89b6e' }}>ICAIAC 2026</h1>
    <p>Dear {name},</p>
    <p>We have received your registration and payment proof (UTR: <strong>{utr}</strong>) for the International Conference on Artificial Intelligence and Advanced Computing.</p>
    <p>Our finance team will verify the transaction with the bank. This typically takes 2-3 business days. You will receive another email once your status is confirmed.</p>
    <p>Best Regards,<br />Organizing Committee, IIIT Manipur</p>
  </div>
);

// Email sent when admin verifies payment
export const PaymentVerifiedEmail = ({ name }: { name: string }) => (
  <div style={{ fontFamily: 'serif', color: '#1a1a1a' }}>
    <h1 style={{ color: '#e89b6e' }}>Registration Confirmed!</h1>
    <p>Dear {name},</p>
    <p>Congratulations! Your payment for <strong>ICAIAC 2026</strong> has been successfully verified.</p>
    <p>You can now log in to your dashboard to download your <strong>Official Invitation Letter</strong> and receipt.</p>
    <a href="https://icaiac.iiitmanipur.ac.in/dashboard" style={{ background: '#e89b6e', color: '#fff', padding: '12px 24px', textDecoration: 'none', fontWeight: 'bold' }}>
      Go to Dashboard
    </a>
    <p style={{ marginTop: '20px' }}>We look forward to seeing you in Imphal!</p>
  </div>
);