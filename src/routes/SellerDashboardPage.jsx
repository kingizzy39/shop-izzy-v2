import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useSellerProfile,
  useSellerProducts,
  useSellerProductActions,
  useClearSellerProfile,
} from "../store/index";
import Button from "../components/Button";
import { formatPrice, generateId } from "../utils/format";
import { CATEGORIES, productImg } from "../data";

// Status badge component
function StatusBadge({ status }) {
  const statusConfig = {
    inStock: { label: "In Stock", class: "bg-green-100 text-green-800" },
    lowStock: { label: "Low Stock", class: "bg-amber-100 text-amber-800" },
    outOfStock: { label: "Out of Stock", class: "bg-rose-100 text-rose-800" },
  };
  const config = statusConfig[status] || statusConfig.inStock;
  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${config.class}`}
    >
      {config.label}
    </span>
  );
}

// Icon Components
function OverviewIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function ProductsIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function AddProductIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

const SellerDashboardPage = () => {
  const navigate = useNavigate();
  const sellerProfile = useSellerProfile();
  const sellerProducts = useSellerProducts();
  const { addSellerProduct, removeSellerProduct } = useSellerProductActions();
  const clearSellerProfile = useClearSellerProfile();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!sellerProfile) {
      navigate("/seller/login");
    }
  }, [sellerProfile, navigate]);

  // Render nothing while redirecting
  if (!sellerProfile) {
    return null;
  }

  // Dashboard tabs - only 3 as per requirements
  const tabs = [
    { id: "overview", label: "Overview", icon: OverviewIcon },
    { id: "products", label: "Products", icon: ProductsIcon },
    { id: "addProduct", label: "Add Product", icon: AddProductIcon },
  ];

  const [activeTab, setActiveTab] = useState("overview");
  const [editingProduct, setEditingProduct] = useState(null);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    category: "electronics",
    price: "",
    wasPrice: "",
    description: "",
    keyword: "",
    stock: "",
    imagePreview: null,
    imageFile: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Categories for product form
  const categories = CATEGORIES.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = sellerProducts.length;
    const totalValue = sellerProducts.reduce(
      (sum, p) => sum + p.price * (p.stock || 0),
      0,
    );
    const lowStockCount = sellerProducts.filter(
      (p) => (p.stock || 0) > 0 && (p.stock || 0) <= 10,
    ).length;
    const outOfStockCount = sellerProducts.filter(
      (p) => (p.stock || 0) === 0,
    ).length;

    return { totalProducts, totalValue, lowStockCount, outOfStockCount };
  }, [sellerProducts]);

  // Handle image upload with live preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setFormErrors((prev) => ({
        ...prev,
        image: "Please select a valid image file",
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors((prev) => ({
        ...prev,
        image: "Image must be less than 5MB",
      }));
      return;
    }

    // Clear image error if any
    if (formErrors.image) {
      setFormErrors((prev) => ({ ...prev, image: undefined }));
    }

    setProductForm((prev) => ({ ...prev, imageFile: file }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setProductForm((prev) => ({
        ...prev,
        imagePreview: event.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Remove image preview
  const removeImagePreview = () => {
    setProductForm((prev) => ({
      ...prev,
      imagePreview: null,
      imageFile: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle product form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate product form
  const validateForm = () => {
    const errors = {};
    if (!productForm.name?.trim()) errors.name = "Product name is required";
    if (!productForm.category) errors.category = "Category is required";
    if (!productForm.price || Number(productForm.price) <= 0)
      errors.price = "Valid price is required";
    if (!productForm.description?.trim())
      errors.description = "Description is required";
    if (!productForm.stock || Number(productForm.stock) < 0)
      errors.stock = "Stock quantity is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add/edit product
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Generate image URL - use uploaded image or generate from keyword/lock
    let imageUrl = null;
    if (productForm.imagePreview) {
      imageUrl = productForm.imagePreview; // In a real app, upload to server first
    } else {
      const lock = Math.floor(Math.random() * 1000);
      const keyword =
        productForm.keyword ||
        productForm.name.toLowerCase().replace(/\s+/g, ",");
      imageUrl = productImg(keyword, lock);
    }

    // Tag product with seller ID
    const sellerId = sellerProfile.id || `seller_${Date.now()}`;

    const newProduct = {
      id: editingProduct ? editingProduct.id : `p${generateId().slice(0, 8)}`,
      name: productForm.name.trim(),
      cat: productForm.category,
      price: Number(productForm.price),
      was: productForm.wasPrice ? Number(productForm.wasPrice) : null,
      rating: 0,
      reviews: 0,
      keyword:
        productForm.keyword ||
        productForm.name.toLowerCase().replace(/\s+/g, ","),
      lock: Math.floor(Math.random() * 1000),
      desc: productForm.description.trim(),
      stock: Number(productForm.stock),
      img: imageUrl,
      sellerId: sellerId, // Tag with seller ID
    };

    addSellerProduct(newProduct);

    // Reset form and close
    resetForm();
    setIsSubmitting(false);

    // Switch to products tab to show the new product
    setActiveTab("products");
  };

  // Open edit modal (not required but useful)
  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.cat,
      price: product.price.toString(),
      wasPrice: product.was?.toString() || "",
      description: product.desc,
      keyword: product.keyword,
      stock: product.stock?.toString() || "0",
      imagePreview: product.img,
      imageFile: null,
    });
    setActiveTab("addProduct");
  };

  // Open add product tab
  const openAddModal = () => {
    setEditingProduct(null);
    resetForm();
    setActiveTab("addProduct");
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      category: "electronics",
      price: "",
      wasPrice: "",
      description: "",
      keyword: "",
      stock: "",
      imagePreview: null,
      imageFile: null,
    });
    setFormErrors({});
    setEditingProduct(null);
  };

  // Handle delete product
  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      removeSellerProduct(productId);
    }
  };

  // Handle logout
  const handleLogout = () => {
    clearSellerProfile();
    navigate("/seller/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar + Main Layout */}
      <div className="flex">
        {/* Mobile sidebar overlay */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity ${activeTab ? "" : "hidden"}`}
          onClick={() => setActiveTab("overview")}
          aria-hidden="true"
        />

        {/* Sidebar Navigation */}
        <aside className="hidden lg:flex lg:flex-col fixed lg:static inset-y-0 left-0 z-50 w-64 bg-background-elevated border-r border-border transition-transform duration-300">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-border">
            <div
              className="flex items-center space-x-3"
              aria-label="Shop Izzy Seller Dashboard"
            >
              <span className="text-xl font-bold font-display text-gradient-amber">
                Shop
              </span>
              <span className="text-xl font-bold font-display text-structural">
                Izzy
              </span>
              <span className="ml-auto px-2 py-1 text-xs font-semibold text-gradient-amber bg-gradient-amber/10 rounded-full">
                Seller
              </span>
            </div>
            <p className="mt-4 text-sm text-structural/60">
              Welcome back,{" "}
              <span className="font-semibold text-structural">
                {sellerProfile.name}
              </span>
            </p>
          </div>

          {/* Navigation Tabs */}
          <nav
            className="flex-1 p-4 space-y-1 overflow-y-auto"
            role="navigation"
            aria-label="Seller dashboard navigation"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-amber/10 text-gradient-amber border border-gradient-amber/30"
                    : "text-structural/70 hover:bg-background-muted hover:text-structural"
                }`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <tab.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}

            {/* Logout */}
            <div className="pt-4 border-t border-border mt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-structural/70 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          {/* Mobile Header */}
          <header className="lg:hidden bg-background-elevated border-b border-border sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold font-display text-gradient-amber">
                  Shop
                </span>
                <span className="text-xl font-bold font-display text-structural">
                  Izzy
                </span>
              </div>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="input-premium py-2 px-3 text-sm bg-background"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 lg:p-8 animate-fade-in">
            {/* Page Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-structural">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h1>
                <p className="text-structural/60 mt-1">
                  Manage your seller account and store
                </p>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <OverviewTab
                stats={stats}
                sellerProfile={sellerProfile}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "products" && (
              <ProductsTab
                products={sellerProducts}
                onEdit={openEditModal}
                onDelete={handleDeleteProduct}
                onAdd={openAddModal}
                categories={categories}
              />
            )}

            {activeTab === "addProduct" && (
              <AddProductTab
                productForm={productForm}
                formErrors={formErrors}
                isSubmitting={isSubmitting}
                editingProduct={editingProduct}
                categories={categories}
                handleFormChange={handleFormChange}
                handleImageUpload={handleImageUpload}
                removeImagePreview={removeImagePreview}
                fileInputRef={fileInputRef}
                handleSubmitProduct={handleSubmitProduct}
                resetForm={resetForm}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Tab Components
function OverviewTab({ stats, sellerProfile, setActiveTab }) {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          icon={<ProductsIcon className="h-6 w-6" />}
          color="bg-gradient-amber/10 text-gradient-amber"
        />
        <StatCard
          label="Inventory Value"
          value={formatPrice(stats.totalValue)}
          icon={<RevenueIcon className="h-6 w-6" />}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          label="Low Stock"
          value={stats.lowStockCount}
          icon={<LowStockIcon className="h-6 w-6" />}
          color="bg-amber-100 text-amber-700"
        />
        <StatCard
          label="Out of Stock"
          value={stats.outOfStockCount}
          icon={<OutOfStockIcon className="h-6 w-6" />}
          color="bg-rose-100 text-rose-700"
        />
      </div>

      {/* Seller Info Card */}
      <div className="card-premium p-6">
        <h2 className="font-display text-lg font-bold text-structural mb-4">
          Store Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoItem
            label="Store Name"
            value={sellerProfile.businessName || sellerProfile.name}
          />
          <InfoItem
            label="Category"
            value={sellerProfile.businessCategory || "General"}
          />
          <InfoItem
            label="Email"
            value={sellerProfile.businessEmail || sellerProfile.email}
          />
          <InfoItem
            label="Status"
            value={
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                {sellerProfile.verificationStatus || "pending"}
              </span>
            }
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-premium p-6">
        <h2 className="font-display text-lg font-bold text-structural mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => setActiveTab("products")}
            className="h-24 flex flex-col gap-2"
          >
            <ProductsIcon className="h-8 w-8 mx-auto" />
            <span>View Products</span>
          </Button>
          <Button
            variant="primary"
            onClick={() => setActiveTab("addProduct")}
            className="h-24 flex flex-col gap-2"
          >
            <AddProductIcon className="h-8 w-8 mx-auto" />
            <span>Add Product</span>
          </Button>
          <Button variant="secondary" className="h-24 flex flex-col gap-2">
            <SettingsIcon className="h-8 w-8 mx-auto" />
            <span>Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-structural/60">{label}</p>
          <p className="font-display text-2xl font-bold text-structural mt-1">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-structural/60">{label}</p>
      <p className="font-medium text-structural mt-1">{value}</p>
    </div>
  );
}

function RevenueIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function LowStockIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function OutOfStockIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function SettingsIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function ProductsTab({ products, onEdit, onDelete, onAdd, categories }) {
  if (products.length === 0) {
    return (
      <div className="card-premium p-12 text-center">
        <ProductsIcon className="h-16 w-16 mx-auto text-structural/30 mb-4" />
        <h3 className="font-display text-xl font-bold text-structural mb-2">
          No Products Yet
        </h3>
        <p className="text-structural/60 mb-6">
          Start adding products to your store
        </p>
        <Button onClick={onAdd} size="lg">
          <AddProductIcon className="h-5 w-5" />
          Add Your First Product
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Products Table */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background-muted text-left text-sm text-structural/60">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Compare At</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-background-muted/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-background-muted flex items-center justify-center overflow-hidden">
                        {product.img ? (
                          <img
                            src={product.img}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ProductsIcon className="h-6 w-6 text-structural/30" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-structural">
                          {product.name}
                        </p>
                        <p className="text-xs text-structural/50 font-mono">
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-background-muted text-structural/70">
                      {categories.find((c) => c.value === product.cat)?.label ||
                        product.cat}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-structural">
                    {formatPrice(product.price)}
                  </td>
                  <td className="p-4 text-structural/70">
                    {product.was ? formatPrice(product.was) : "—"}
                  </td>
                  <td className="p-4 text-structural/70">
                    {product.stock || 0}
                  </td>
                  <td className="p-4">
                    <StatusBadge
                      status={
                        (product.stock || 0) > 10
                          ? "inStock"
                          : (product.stock || 0) > 0
                            ? "lowStock"
                            : "outOfStock"
                      }
                    />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(product)}
                        aria-label={`Edit ${product.name}`}
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(product.id)}
                        className="text-rose-600 hover:bg-rose-50"
                        aria-label={`Delete ${product.name}`}
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AddProductTab({
  productForm,
  formErrors,
  isSubmitting,
  editingProduct,
  categories,
  handleFormChange,
  handleImageUpload,
  removeImagePreview,
  fileInputRef,
  handleSubmitProduct,
  resetForm,
}) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="card-premium overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-structural">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <Button variant="ghost" onClick={resetForm} aria-label="Reset form">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5" />
            </svg>
            Reset
          </Button>
        </div>

        <form onSubmit={handleSubmitProduct} className="p-6 space-y-5">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="label-premium">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={productForm.name}
              onChange={handleFormChange}
              className={`input-premium ${formErrors.name ? "border-rose-500 focus:border-rose-500" : ""}`}
              placeholder="Enter product name"
              required
            />
            {formErrors.name && (
              <p className="text-rose-500 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="label-premium">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={productForm.category}
              onChange={handleFormChange}
              className={`input-premium ${formErrors.category ? "border-rose-500 focus:border-rose-500" : ""}`}
              required
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {formErrors.category && (
              <p className="text-rose-500 text-sm mt-1">
                {formErrors.category}
              </p>
            )}
          </div>

          {/* Price Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="label-premium">
                Price (₦) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={productForm.price}
                onChange={handleFormChange}
                className={`input-premium ${formErrors.price ? "border-rose-500 focus:border-rose-500" : ""}`}
                placeholder="50000"
                min="1"
                required
              />
              {formErrors.price && (
                <p className="text-rose-500 text-sm mt-1">{formErrors.price}</p>
              )}
            </div>
            <div>
              <label htmlFor="wasPrice" className="label-premium">
                Compare At Price (₦) - Optional
              </label>
              <input
                type="number"
                id="wasPrice"
                name="wasPrice"
                value={productForm.wasPrice}
                onChange={handleFormChange}
                className="input-premium"
                placeholder="75000"
                min="1"
              />
              <p className="text-xs text-structural/50 mt-1">
                Original price to show discount
              </p>
            </div>
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="label-premium">
              Stock Quantity *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={productForm.stock}
              onChange={handleFormChange}
              className={`input-premium ${formErrors.stock ? "border-rose-500 focus:border-rose-500" : ""}`}
              placeholder="100"
              min="0"
              required
            />
            {formErrors.stock && (
              <p className="text-rose-500 text-sm mt-1">{formErrors.stock}</p>
            )}
          </div>

          {/* Image Upload with Live Preview */}
          <div>
            <label className="label-premium">Product Image</label>
            <div className="space-y-3">
              {/* Preview Area */}
              <div className="relative">
                {productForm.imagePreview ? (
                  <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden bg-background-muted border border-border">
                    <img
                      src={productForm.imagePreview}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImagePreview}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                      aria-label="Remove image"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div
                    className="w-full max-w-md aspect-square rounded-lg border-2 border-dashed border-border bg-background-muted flex flex-col items-center justify-center cursor-pointer hover:border-gradient-amber/50 hover:bg-gradient-amber/5 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === "Enter" && fileInputRef.current?.click()
                    }
                  >
                    <svg
                      className="h-12 w-12 text-structural/30 mb-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span className="text-structural/60 text-center px-4">
                      Click to upload or drag & drop
                    </span>
                    <p className="text-xs text-structural/40">
                      PNG, JPG up to 5MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                  </div>
                )}
              </div>
              {formErrors.image && (
                <p className="text-rose-500 text-sm">{formErrors.image}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="label-premium">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={productForm.description}
              onChange={handleFormChange}
              className={`input-premium min-h-[120px] resize-y ${formErrors.description ? "border-rose-500 focus:border-rose-500" : ""}`}
              placeholder="Describe your product features, materials, dimensions, etc."
              required
              rows={5}
            />
            {formErrors.description && (
              <p className="text-rose-500 text-sm mt-1">
                {formErrors.description}
              </p>
            )}
          </div>

          {/* Keywords */}
          <div>
            <label htmlFor="keyword" className="label-premium">
              Search Keywords (comma-separated)
            </label>
            <input
              type="text"
              id="keyword"
              name="keyword"
              value={productForm.keyword}
              onChange={handleFormChange}
              className="input-premium"
              placeholder="headphones, wireless, noise-cancelling, audio"
            />
            <p className="text-xs text-structural/50 mt-1">
              Keywords help customers find your product
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit" size="md" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {editingProduct ? "Updating..." : "Adding..."}
                </>
              ) : editingProduct ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SellerDashboardPage;
