import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
    color: #2c3e50;
  }

  :root {
    /* Paleta de colores para joyería */
    --primary-gold: #d4af37;
    --secondary-gold: #f4e4bc;
    --dark-gold: #b8860b;
    --light-gold: #fff8dc;
    --accent-bronze: #cd7f32;
    --text-dark: #2c3e50;
    --text-light: #7f8c8d;
    --white: #ffffff;
    --shadow: rgba(0, 0, 0, 0.1);
    --success: #27ae60;
    --error: #e74c3c;
    --warning: #f39c12;
    --info: #3498db;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
    text-align: center;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--primary-gold), var(--dark-gold));
    color: var(--white);
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
  }

  .btn-secondary {
    background: var(--white);
    color: var(--primary-gold);
    border: 2px solid var(--primary-gold);
  }

  .btn-secondary:hover {
    background: var(--primary-gold);
    color: var(--white);
  }

  .card {
    background: var(--white);
    border-radius: 12px;
    box-shadow: 0 8px 25px var(--shadow);
    padding: 24px;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--text-dark);
  }

  .form-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--primary-gold);
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }

  .form-select {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    background: var(--white);
    cursor: pointer;
  }

  .form-textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    min-height: 100px;
    resize: vertical;
    font-family: inherit;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: var(--white);
    border-radius: 12px;
    padding: 24px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }

  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--text-light);
    transition: color 0.3s ease;
  }

  .close-btn:hover {
    color: var(--error);
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  .table th,
  .table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }

  .table th {
    background: var(--light-gold);
    font-weight: 600;
    color: var(--text-dark);
  }

  .table tr:hover {
    background: #f8f9fa;
  }

  .status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-active {
    background: #d4edda;
    color: #155724;
  }

  .status-inactive {
    background: #f8d7da;
    color: #721c24;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 18px;
    color: var(--text-light);
  }

  .error {
    color: var(--error);
    background: #f8d7da;
    padding: 12px;
    border-radius: 8px;
    margin: 10px 0;
  }

  .success {
    color: var(--success);
    background: #d4edda;
    padding: 12px;
    border-radius: 8px;
    margin: 10px 0;
  }
`; 