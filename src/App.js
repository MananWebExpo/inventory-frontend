import React, { useState } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';

function App() {
  const [refresh, setRefresh] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const handleProductAdded = () => {
    setRefresh(prev => prev + 1);
    setShowForm(false);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="display-5">
              <i className="bi bi-box-seam text-primary"></i>
              Product Inventory System
            </h1>
            <p className="lead text-muted">Manage your product inventory efficiently</p>
          </div>

          {/* Form Toggle Button */}
          {!showForm && (
            <div className="text-end mb-3">
              <button 
                className="btn btn-primary btn-lg" 
                onClick={() => setShowForm(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Product
              </button>
            </div>
          )}

          {/* Form Section */}
          {showForm && (
            <div className="row mb-4">
              <div className="col-12 col-lg-8 col-xl-6 mx-auto">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3>Add New Product</h3>
                  <button 
                    className="btn btn-outline-secondary" 
                    onClick={() => setShowForm(false)}
                    title="Close form"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                <ProductForm onProductAdded={handleProductAdded} />
              </div>
            </div>
          )}

          {/* Product List Section - hidden while form is shown */}
          {!showForm && (
            <div className="row">
              <div className="col-12">
                <ProductList refreshTrigger={refresh} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-5 py-3 border-top">
        <div className="text-center text-muted">
          <small>Product Inventory System - Built with React & Node.js</small>
        </div>
      </footer>
    </div>
  );
}

export default App;
