import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';

function ProductList({ refreshTrigger }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch products with optional filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Add search parameter
      if (search.trim()) {
        params.append('search', search.trim());
      }
      
      // Add category filters - use category names since backend expects names
      selectedCategories.forEach(categoryName => {
        params.append('category', categoryName);
      });

      const query = `http://localhost:5000/api/products?${params.toString()}`;
      console.log('Fetching products with query:', query);
      
      const res = await axios.get(query);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger, search, selectedCategories]);

  // Fetch categories on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data || []))
      .catch(err => {
        console.error('Error fetching categories:', err);
        setCategories([]);
      });
  }, []);

  // Delete a product
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts(); // Refresh the list
      alert('Product deleted successfully!');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  // Handle category filter checkbox toggle
  const handleCategoryFilterChange = (e) => {
    const categoryName = e.target.value;
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setShowFilter(false);
  };

  // Apply filters and close modal
  const applyFilters = () => {
    fetchProducts();
    setShowFilter(false);
  };

  return (
    <div className="card p-3">
      <div className="card-header bg-transparent border-0 p-0 mb-3">
        <h5 className="card-title mb-0">Product Inventory</h5>
      </div>

      {/* Search & Filter Controls */}
      <div className="mb-3 d-flex gap-2 align-items-center">
        <div className="flex-grow-1">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by product name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button 
          className="btn btn-outline-primary" 
          onClick={() => setShowFilter(true)}
          title="Filter by categories"
        >
          <i className="bi bi-funnel-fill"></i>
        </button>
        {(search || selectedCategories.length > 0) && (
          <button 
            className="btn btn-outline-secondary" 
            onClick={clearFilters}
            title="Clear all filters"
          >
            <i className="bi bi-x-circle"></i>
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {selectedCategories.length > 0 && (
        <div className="mb-3">
          <small className="text-muted">Active filters:</small>
          <div className="mt-1">
            {selectedCategories.map(categoryName => (
              <span key={categoryName} className="badge bg-primary me-1">
                {categoryName}
                <button
                  type="button"
                  className="btn-close btn-close-white ms-1"
                  style={{ fontSize: '0.6rem' }}
                  onClick={() => setSelectedCategories(prev => 
                    prev.filter(cat => cat !== categoryName)
                  )}
                  aria-label="Remove filter"
                ></button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter Modal */}
      {showFilter && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowFilter(false)}
            style={{ zIndex: 1040 }}
          ></div>

          <div className="modal show fade d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-sm modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Filter by Categories</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowFilter(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {categories.length === 0 ? (
                    <p className="text-muted">No categories available</p>
                  ) : (
                    categories.map(cat => (
                      <div key={cat._id} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`category-${cat._id}`}
                          value={cat.name}
                          checked={selectedCategories.includes(cat.name)}
                          onChange={handleCategoryFilterChange}
                        />
                        <label className="form-check-label" htmlFor={`category-${cat._id}`}>
                          {cat.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setShowFilter(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th style={{ width: '5%' }}>#</th>
              <th style={{ width: '20%' }}>Name</th>
              <th style={{ width: '30%' }}>Description</th>
              <th style={{ width: '10%' }}>Quantity</th>
              <th style={{ width: '15%' }}>Categories</th>
              <th style={{ width: '10%' }}>Added On</th>
              <th style={{ width: '10%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  {loading ? (
                    'Loading products...'
                  ) : (
                    <div>
                      <i className="bi bi-inbox display-4 text-muted"></i>
                      <p className="mt-2 text-muted">
                        {search || selectedCategories.length > 0 
                          ? 'No products found matching your criteria'
                          : 'No products available'
                        }
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              products.map((product, idx) => (
                <tr key={product._id}>
                  <td>{idx + 1}</td>
                  <td>
                    <strong>{product.name}</strong>
                    <br />
                    <small className="text-muted">ID: {product._id}</small>
                  </td>
                  <td>{product.description || '-'}</td>
                  <td>
                    <span className={`badge ${product.quantity > 10 ? 'bg-success' : product.quantity > 5 ? 'bg-warning' : 'bg-danger'}`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td>
                    {Array.isArray(product.categories) && product.categories.length > 0 ? (
                      product.categories.map((cat, i) => (
                        <span className="badge bg-secondary me-1" key={i}>
                          {typeof cat === 'string' ? cat : cat.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">No categories</span>
                    )}
                  </td>
                  <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(product._id)}
                      title="Delete product"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {products.length > 0 && (
        <div className="mt-3">
          <small className="text-muted">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
            {(search || selectedCategories.length > 0) && ' (filtered)'}
          </small>
        </div>
      )}
    </div>
  );
}

export default ProductList;