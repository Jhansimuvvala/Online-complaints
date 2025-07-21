import React from 'react';
import { MDBFooter } from 'mdb-react-ui-kit';

export default function FooterC() {
  return (
    <MDBFooter
      className="text-center text-muted"
      style={{
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e4e6ea',
        padding: '20px 0',
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '0.95rem',
        marginTop: '60px'
      }}
    >
      <div>
        <p className="mb-1">ComplaintCare</p>
        <p className="mb-0">&copy; {new Date().getFullYear()}</p>
      </div>
    </MDBFooter>
  );
}