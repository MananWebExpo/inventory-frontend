import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function ProductForm({ onProductAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all categories from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => {
        const categoryOptions = res.data.map((cat) => ({
          label: cat.name,
          value: cat.name, // Use name as value since backend expects category names
        }));
        setCategories(categoryOptions);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      });
  }, []);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!name.trim() || !quantity || selectedCategories.length === 0) {
      setError("Please fill all required fields and select at least one category.");
      return;
    }

    if (Number(quantity) <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        quantity: Number(quantity),
        categories: selectedCategories.map((cat) => cat.value), // Send category names
      };
      
      console.log("Submitting product:", payload);

      await axios.post("http://localhost:5000/api/products", payload);

      // Reset form
      setName("");
      setDescription("");
      setQuantity("");
      setSelectedCategories([]);
      setError("");
      
      // Notify parent component
      onProductAdded();
      
      // Show success message briefly
      alert("Product added successfully!");
      
    } catch (err) {
      const msg = err.response?.data?.message || "Error adding product";
      setError(msg);
      console.error("Error adding product:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card p-4">
      <h5 className="card-title">Add New Product</h5>
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
            aria-label="Close"
          ></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">
            Product Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="productName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="productDescription" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="productDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="productQuantity" className="form-label">
            Quantity <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            id="productQuantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            min="1"
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="productCategories" className="form-label">
            Categories <span className="text-danger">*</span>
          </label>
          <Select
            isMulti
            options={categories}
            value={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="Select categories..."
            isDisabled={isSubmitting}
            className="react-select-container"
            classNamePrefix="react-select"
          />
          <div className="form-text">
            Select one or more categories for this product
          </div>
        </div>

        <div className="d-grid gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Adding Product...
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-2"></i>
                Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;