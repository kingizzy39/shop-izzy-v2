import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/index";
import Button from "../components/Button";

const SellerJoin = () => {
  const navigate = useNavigate();
  const { setSellerProfile } = useStore();

  // Form steps
  const steps = [
    {
      id: 1,
      label: "Business Info",
      description: "Tell us about your business",
    },
    { id: 2, label: "Personal Info", description: "Your contact details" },
    {
      id: 3,
      label: "Bank Details",
      description: "Where to send your earnings",
    },
    { id: 4, label: "Verification", description: "Verify your identity" },
    { id: 5, label: "Review", description: "Confirm and submit" },
  ];

  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [businessForm, setBusinessForm] = useState({
    businessName: "",
    businessType: "individual", // individual, company
    businessCategory: "",
    businessDescription: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessPostalCode: "",
    businessPhone: "",
    businessEmail: "",
    website: "",
    cacNumber: "", // Corporate Affairs Commission number for Nigeria
    taxId: "",
  });

  const [personalForm, setPersonalForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    nin: "", // National Identity Number
    bvn: "", // Bank Verification Number
  });

  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    sortCode: "",
    swiftCode: "",
  });

  const [verificationForm, setVerificationForm] = useState({
    idType: "nin", // nin, passport, drivers_license, voters_card
    idNumber: "",
    idFrontImage: null,
    idBackImage: null,
    selfieImage: null,
    utilityBill: null,
  });

  const [agreements, setAgreements] = useState({
    termsOfService: false,
    privacyPolicy: false,
    sellerAgreement: false,
    marketingEmails: false,
  });

  // Nigerian states
  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT - Abuja",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  // Nigerian banks
  const nigerianBanks = [
    "Access Bank",
    "Citibank",
    "Diamond Bank",
    "Ecobank",
    "Fidelity Bank",
    "First Bank of Nigeria",
    "First City Monument Bank",
    "Guaranty Trust Bank",
    "Heritage Bank",
    "Keystone Bank",
    "Polaris Bank",
    "Providus Bank",
    "Stanbic IBTC Bank",
    "Standard Chartered Bank",
    "Sterling Bank",
    "SunTrust Bank",
    "Union Bank of Nigeria",
    "United Bank for Africa",
    "Unity Bank",
    "Wema Bank",
    "Zenith Bank",
    "Other",
  ];

  // Business categories
  const businessCategories = [
    "Electronics & Gadgets",
    "Fashion & Clothing",
    "Home & Living",
    "Beauty & Personal Care",
    "Phones & Tablets",
    "Groceries & Food",
    "Sports & Outdoors",
    "Books & Media",
    "Automotive",
    "Health & Wellness",
    "Baby & Kids",
    "Art & Collectibles",
    "Other",
  ];

  // Validation functions
  const validateBusiness = () => {
    const newErrors = {};
    const required = [
      "businessName",
      "businessCategory",
      "businessDescription",
      "businessAddress",
      "businessCity",
      "businessState",
      "businessPostalCode",
      "businessPhone",
      "businessEmail",
    ];
    required.forEach((field) => {
      if (!businessForm[field]?.trim()) {
        newErrors[field] = `${formatFieldName(field)} is required`;
      }
    });
    if (
      businessForm.businessEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessForm.businessEmail)
    ) {
      newErrors.businessEmail = "Invalid email address";
    }
    if (
      businessForm.businessPhone &&
      !/^(\+234|0)[789]\d{9}$/.test(businessForm.businessPhone)
    ) {
      newErrors.businessPhone = "Invalid Nigerian phone number";
    }
    if (businessForm.website && !/^https?:\/\/.+/.test(businessForm.website)) {
      newErrors.website = "Invalid URL (must start with http:// or https://)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePersonal = () => {
    const newErrors = {};
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "dateOfBirth",
      "address",
      "city",
      "state",
      "postalCode",
      "nin",
      "bvn",
    ];
    required.forEach((field) => {
      if (!personalForm[field]?.trim()) {
        newErrors[field] = `${formatFieldName(field)} is required`;
      }
    });
    if (
      personalForm.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalForm.email)
    ) {
      newErrors.email = "Invalid email address";
    }
    if (
      personalForm.phone &&
      !/^(\+234|0)[789]\d{9}$/.test(personalForm.phone)
    ) {
      newErrors.phone = "Invalid Nigerian phone number";
    }
    if (personalForm.nin && !/^\d{11}$/.test(personalForm.nin)) {
      newErrors.nin = "NIN must be 11 digits";
    }
    if (personalForm.bvn && !/^\d{11}$/.test(personalForm.bvn)) {
      newErrors.bvn = "BVN must be 11 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBank = () => {
    const newErrors = {};
    const required = ["bankName", "accountName", "accountNumber"];
    required.forEach((field) => {
      if (!bankForm[field]?.trim()) {
        newErrors[field] = `${formatFieldName(field)} is required`;
      }
    });
    if (bankForm.accountNumber && !/^\d{10}$/.test(bankForm.accountNumber)) {
      newErrors.accountNumber = "Account number must be 10 digits";
    }
    if (bankForm.sortCode && !/^\d{9}$/.test(bankForm.sortCode)) {
      newErrors.sortCode = "Sort code must be 9 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVerification = () => {
    const newErrors = {};
    if (!verificationForm.idNumber?.trim()) {
      newErrors.idNumber = "ID number is required";
    }
    if (!verificationForm.idFrontImage) {
      newErrors.idFrontImage = "Front of ID is required";
    }
    if (!verificationForm.idBackImage) {
      newErrors.idBackImage = "Back of ID is required";
    }
    if (!verificationForm.selfieImage) {
      newErrors.selfieImage = "Selfie with ID is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReview = () => {
    const newErrors = {};
    if (!agreements.termsOfService) {
      newErrors.termsOfService = "You must accept the Terms of Service";
    }
    if (!agreements.privacyPolicy) {
      newErrors.privacyPolicy = "You must accept the Privacy Policy";
    }
    if (!agreements.sellerAgreement) {
      newErrors.sellerAgreement = "You must accept the Seller Agreement";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatFieldName = (field) => {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace("Cac", "CAC")
      .replace("Nin", "NIN")
      .replace("Bvn", "BVN");
  };

  const handleBusinessChange = (e) => {
    const { name, value, type } = e.target;
    setBusinessForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handlePersonalChange = (e) => {
    const { name, value, type } = e.target;
    setPersonalForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleBankChange = (e) => {
    const { name, value, type } = e.target;
    setBankForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleVerificationChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files) {
      setVerificationForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setVerificationForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? e.target.checked : value,
      }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleAgreementChange = (e) => {
    const { name, checked } = e.target;
    setAgreements((prev) => ({ ...prev, [name]: checked }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const nextStep = () => {
    let isValid = false;
    switch (activeStep) {
      case 1:
        isValid = validateBusiness();
        break;
      case 2:
        isValid = validatePersonal();
        break;
      case 3:
        isValid = validateBank();
        break;
      case 4:
        isValid = validateVerification();
        break;
      case 5:
        isValid = validateReview();
        break;
    }
    if (isValid && activeStep < steps.length) {
      setActiveStep(activeStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateReview()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create seller profile
    const sellerProfile = {
      id: `seller_${Date.now()}`,
      name: `${personalForm.firstName} ${personalForm.lastName}`,
      email: personalForm.email,
      bio: businessForm.businessDescription,
      businessName: businessForm.businessName,
      businessType: businessForm.businessType,
      businessCategory: businessForm.businessCategory,
      businessAddress: businessForm.businessAddress,
      businessCity: businessForm.businessCity,
      businessState: businessForm.businessState,
      businessPhone: businessForm.businessPhone,
      businessEmail: businessForm.businessEmail,
      bankDetails: {
        bankName: bankForm.bankName,
        accountName: bankForm.accountName,
        accountNumber: bankForm.accountNumber,
        sortCode: bankForm.sortCode,
      },
      verificationStatus: "pending",
      createdAt: new Date().toISOString(),
    };

    setSellerProfile(sellerProfile);
    setIsSubmitting(false);

    // Navigate to dashboard
    navigate("/seller/dashboard");
  };

  const canGoNext = useMemo(() => {
    switch (activeStep) {
      case 1:
        return (
          businessForm.businessName &&
          businessForm.businessCategory &&
          businessForm.businessEmail
        );
      case 2:
        return (
          personalForm.firstName && personalForm.lastName && personalForm.email
        );
      case 3:
        return (
          bankForm.bankName && bankForm.accountName && bankForm.accountNumber
        );
      case 4:
        return (
          verificationForm.idNumber &&
          verificationForm.idFrontImage &&
          verificationForm.idBackImage &&
          verificationForm.selfieImage
        );
      case 5:
        return (
          agreements.termsOfService &&
          agreements.privacyPolicy &&
          agreements.sellerAgreement
        );
      default:
        return false;
    }
  }, [
    activeStep,
    businessForm,
    personalForm,
    bankForm,
    verificationForm,
    agreements,
  ]);

  return (
    <>
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-8 animate-fade-in text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-amber/10 mb-4">
              <svg
                className="h-8 w-8 text-gradient-amber"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-structural mb-2">
              Join as a Seller
            </h1>
            <p className="text-structural/60 text-lg max-w-2xl mx-auto">
              Start selling on Shop Izzy today. Complete your registration in 5
              simple steps.
            </p>
          </header>

          {/* Progress Steps */}
          <div className="mb-8 animate-fade-in">
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-border" />
              <div className="flex items-center justify-between relative z-10">
                {steps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        activeStep >= step.id
                          ? "bg-gradient-amber text-structural border-2 border-transparent"
                          : "bg-background-muted text-structural/40 border-2 border-border"
                      }`}
                    >
                      {activeStep > step.id ? (
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium text-center transition-colors ${
                        activeStep >= step.id
                          ? "text-structural"
                          : "text-structural/40"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span
                      className={`text-xs text-center text-structural/50 max-w-[80px]`}
                    >
                      {step.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="animate-slide-up">
            {/* Step 1: Business Info */}
            {activeStep === 1 && (
              <div className="card-premium p-6 sm:p-8">
                <div className="mb-6">
                  <h2 className="font-display text-xl font-bold text-structural mb-1">
                    Business Information
                  </h2>
                  <p className="text-structural/60">
                    Tell us about your business
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="businessName" className="label-premium">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={businessForm.businessName}
                      onChange={handleBusinessChange}
                      className={`input-premium ${errors.businessName ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="e.g., Izzy Electronics"
                      required
                    />
                    {errors.businessName && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.businessName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="businessType" className="label-premium">
                      Business Type *
                    </label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={businessForm.businessType}
                      onChange={handleBusinessChange}
                      className={`input-premium ${errors.businessType ? "border-rose-500 focus:border-rose-500" : ""}`}
                    >
                      <option value="individual">
                        Individual / Sole Proprietor
                      </option>
                      <option value="company">Registered Company</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="businessCategory" className="label-premium">
                    Business Category *
                  </label>
                  <select
                    id="businessCategory"
                    name="businessCategory"
                    value={businessForm.businessCategory}
                    onChange={handleBusinessChange}
                    className={`input-premium ${errors.businessCategory ? "border-rose-500 focus:border-rose-500" : ""}`}
                    required
                  >
                    <option value="">Select Category</option>
                    {businessCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.businessCategory && (
                    <p className="text-rose-500 text-sm mt-1">
                      {errors.businessCategory}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="businessDescription"
                    className="label-premium"
                  >
                    Business Description *
                  </label>
                  <textarea
                    id="businessDescription"
                    name="businessDescription"
                    value={businessForm.businessDescription}
                    onChange={handleBusinessChange}
                    className={`input-premium min-h-[100px] resize-y ${errors.businessDescription ? "border-rose-500 focus:border-rose-500" : ""}`}
                    placeholder="Describe your business, what you sell, and what makes you unique..."
                    required
                    rows={4}
                  />
                  {errors.businessDescription && (
                    <p className="text-rose-500 text-sm mt-1">
                      {errors.businessDescription}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="businessAddress" className="label-premium">
                      Business Address *
                    </label>
                    <input
                      type="text"
                      id="businessAddress"
                      name="businessAddress"
                      value={businessForm.businessAddress}
                      onChange={handleBusinessChange}
                      className={`input-premium ${errors.businessAddress ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="123 Commercial Avenue"
                      required
                    />
                    {errors.businessAddress && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.businessAddress}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="businessCity" className="label-premium">
                      City *
                    </label>
                    <input
                      type="text"
                      id="businessCity"
                      name="businessCity"
                      value={businessForm.businessCity}
                      onChange={handleBusinessChange}
                      className={`input-premium ${errors.businessCity ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="Lagos"
                      required
                    />
                    {errors.businessCity && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.businessCity}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="businessState" className="label-premium">
                      State *
                    </label>
                    <select
                      id="businessState"
                      name="businessState"
                      value={businessForm.businessState}
                      onChange={handleBusinessChange}
                      className={`input-premium ${errors.businessState ? "border-rose-500 focus:border-rose-500" : ""}`}
                      required
                    >
                      <option value="">Select State</option>
                      {nigerianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.businessState && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.businessState}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="businessPostalCode"
                      className="label-premium"
                    >
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      id="businessPostalCode"
                      name="businessPostalCode"
                      value={businessForm.businessPostalCode}
                      onChange={handleBusinessChange}
                      className={`input-premium ${errors.businessPostalCode ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="100001"
                      required
                      maxLength={6}
                    />
                    {errors.businessPostalCode && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.businessPostalCode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="businessPhone" className="label-premium">
                      Business Phone *
                    </label>
                    <input
                      type="tel"
                      id="businessPhone"
                      name="businessPhone"
                      value={businessForm.businessPhone}
                      onChange={handleBusinessChange}
                      className={`input-premium ${errors.businessPhone ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="+234 8XX XXX XXXX"
                      required
                    />
                    {errors.businessPhone && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.businessPhone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="businessEmail" className="label-premium">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      id="businessEmail"
                      name="businessEmail"
                      value={businessForm.businessEmail}
                      onChange={handleBusinessChange}
                      className={`input-premium ${errors.businessEmail ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="business@example.com"
                      required
                    />
                    {errors.businessEmail && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.businessEmail}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="website" className="label-premium">
                      Website (Optional)
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={businessForm.website}
                      onChange={handleBusinessChange}
                      className={`input-premium ${errors.website ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="https://yourstore.com"
                    />
                    {errors.website && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.website}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="cacNumber" className="label-premium">
                      CAC Number (If Registered)
                    </label>
                    <input
                      type="text"
                      id="cacNumber"
                      name="cacNumber"
                      value={businessForm.cacNumber}
                      onChange={handleBusinessChange}
                      className="input-premium"
                      placeholder="RC 1234567"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="taxId" className="label-premium">
                    Tax Identification Number (Optional)
                  </label>
                  <input
                    type="text"
                    id="taxId"
                    name="taxId"
                    value={businessForm.taxId}
                    onChange={handleBusinessChange}
                    className="input-premium"
                    placeholder="12345678-0001"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Personal Info */}
            {activeStep === 2 && (
              <div className="card-premium p-6 sm:p-8">
                <div className="mb-6">
                  <h2 className="font-display text-xl font-bold text-structural mb-1">
                    Personal Information
                  </h2>
                  <p className="text-structural/60">
                    Your contact details for account verification
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="label-premium">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={personalForm.firstName}
                      onChange={handlePersonalChange}
                      className={`input-premium ${errors.firstName ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="John"
                      required
                    />
                    {errors.firstName && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="label-premium">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={personalForm.lastName}
                      onChange={handlePersonalChange}
                      className={`input-premium ${errors.lastName ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="Doe"
                      required
                    />
                    {errors.lastName && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="email" className="label-premium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={personalForm.email}
                      onChange={handlePersonalChange}
                      className={`input-premium ${errors.email ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="john@example.com"
                      required
                    />
                    {errors.email && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="label-premium">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={personalForm.phone}
                      onChange={handlePersonalChange}
                      className={`input-premium ${errors.phone ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="+234 8XX XXX XXXX"
                      required
                    />
                    {errors.phone && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="dateOfBirth" className="label-premium">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={personalForm.dateOfBirth}
                      onChange={handlePersonalChange}
                      className={`input-premium ${errors.dateOfBirth ? "border-rose-500 focus:border-rose-500" : ""}`}
                      required
                      max={
                        new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split("T")[0]
                      }
                    />
                    {errors.dateOfBirth && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.dateOfBirth}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="gender" className="label-premium">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={personalForm.gender}
                      onChange={handlePersonalChange}
                      className={`input-premium ${errors.gender ? "border-rose-500 focus:border-rose-500" : ""}`}
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="address" className="label-premium">
                    Residential Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={personalForm.address}
                    onChange={handlePersonalChange}
                    className={`input-premium ${errors.address ? "border-rose-500 focus:border-rose-500" : ""}`}
                    placeholder="456 Residential Street"
                    required
                  />
                  {errors.address && (
                    <p className="text-rose-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="city" className="label-premium">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={personalForm.city}
                      onChange={handlePersonalChange}
                      className={`input-premium ${errors.city ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="Lagos"
                      required
                    />
                    {errors.city && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="state" className="label-premium">
                      State *
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={personalForm.state}
                      onChange={handlePersonalChange}
                      className={`input-premium ${errors.state ? "border-rose-500 focus:border-rose-500" : ""}`}
                      required
                    >
                      <option value="">Select State</option>
                      {nigerianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="label-premium">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={personalForm.postalCode}
                      onChange={handlePersonalChange}
                      className={`input-premium ${errors.postalCode ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="100001"
                      required
                      maxLength={6}
                    />
                    {errors.postalCode && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="nin" className="label-premium">
                      National Identity Number (NIN) *
                    </label>
                    <input
                      type="text"
                      id="nin"
                      name="nin"
                      value={personalForm.nin}
                      onChange={handlePersonalChange}
                      className={`input-premium ${errors.nin ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="12345678901"
                      required
                      maxLength={11}
                    />
                    {errors.nin && (
                      <p className="text-rose-500 text-sm mt-1">{errors.nin}</p>
                    )}
                    <p className="text-xs text-structural/50 mt-1">
                      11-digit NIN
                    </p>
                  </div>
                  <div>
                    <label htmlFor="bvn" className="label-premium">
                      Bank Verification Number (BVN) *
                    </label>
                    <input
                      type="text"
                      id="bvn"
                      name="bvn"
                      value={personalForm.bvn}
                      onChange={handlePersonalChange}
                      className={`input-premium ${errors.bvn ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="12345678901"
                      required
                      maxLength={11}
                    />
                    {errors.bvn && (
                      <p className="text-rose-500 text-sm mt-1">{errors.bvn}</p>
                    )}
                    <p className="text-xs text-structural/50 mt-1">
                      11-digit BVN
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Bank Details */}
            {activeStep === 3 && (
              <div className="card-premium p-6 sm:p-8">
                <div className="mb-6">
                  <h2 className="font-display text-xl font-bold text-structural mb-1">
                    Bank Details
                  </h2>
                  <p className="text-structural/60">
                    Where we&apos;ll send your earnings
                  </p>
                </div>

                <div className="mb-4">
                  <label htmlFor="bankName" className="label-premium">
                    Bank Name *
                  </label>
                  <select
                    id="bankName"
                    name="bankName"
                    value={bankForm.bankName}
                    onChange={handleBankChange}
                    className={`input-premium ${errors.bankName ? "border-rose-500 focus:border-rose-500" : ""}`}
                    required
                  >
                    <option value="">Select Bank</option>
                    {nigerianBanks.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                  {errors.bankName && (
                    <p className="text-rose-500 text-sm mt-1">
                      {errors.bankName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="accountName" className="label-premium">
                      Account Name *
                    </label>
                    <input
                      type="text"
                      id="accountName"
                      name="accountName"
                      value={bankForm.accountName}
                      onChange={handleBankChange}
                      className={`input-premium ${errors.accountName ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="John Doe"
                      required
                    />
                    {errors.accountName && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.accountName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="accountNumber" className="label-premium">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      id="accountNumber"
                      name="accountNumber"
                      value={bankForm.accountNumber}
                      onChange={handleBankChange}
                      className={`input-premium ${errors.accountNumber ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="0123456789"
                      required
                      maxLength={10}
                    />
                    {errors.accountNumber && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.accountNumber}
                      </p>
                    )}
                    <p className="text-xs text-structural/50 mt-1">
                      10-digit account number
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="sortCode" className="label-premium">
                      Sort Code
                    </label>
                    <input
                      type="text"
                      id="sortCode"
                      name="sortCode"
                      value={bankForm.sortCode}
                      onChange={handleBankChange}
                      className={`input-premium ${errors.sortCode ? "border-rose-500 focus:border-rose-500" : ""}`}
                      placeholder="058152036"
                      maxLength={9}
                    />
                    {errors.sortCode && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.sortCode}
                      </p>
                    )}
                    <p className="text-xs text-structural/50 mt-1">
                      9-digit bank sort code
                    </p>
                  </div>
                  <div>
                    <label htmlFor="swiftCode" className="label-premium">
                      SWIFT/BIC Code (Optional)
                    </label>
                    <input
                      type="text"
                      id="swiftCode"
                      name="swiftCode"
                      value={bankForm.swiftCode}
                      onChange={handleBankChange}
                      className="input-premium"
                      placeholder="ZIBBNGLA"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gradient-amber/5 rounded-lg border border-gradient-amber/20">
                  <div className="flex items-start gap-3">
                    <svg
                      className="h-5 w-5 text-gradient-amber flex-shrink-0 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <div className="text-sm text-structural/70">
                      <p className="font-medium text-structural mb-1">
                        Secure Banking Information
                      </p>
                      <p>
                        Your bank details are encrypted and stored securely. We
                        only use them to process your payouts. Never share your
                        login credentials with anyone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Verification */}
            {activeStep === 4 && (
              <div className="card-premium p-6 sm:p-8">
                <div className="mb-6">
                  <h2 className="font-display text-xl font-bold text-structural mb-1">
                    Identity Verification
                  </h2>
                  <p className="text-structural/60">
                    Verify your identity to comply with regulations
                  </p>
                </div>

                <div className="mb-4">
                  <label htmlFor="idType" className="label-premium">
                    ID Type *
                  </label>
                  <select
                    id="idType"
                    name="idType"
                    value={verificationForm.idType}
                    onChange={handleVerificationChange}
                    className="input-premium"
                  >
                    <option value="nin">National Identity Number (NIN)</option>
                    <option value="passport">International Passport</option>
                    <option value="drivers_license">
                      Driver&apos;s License
                    </option>
                    <option value="voters_card">Voter&apos;s Card</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="idNumber" className="label-premium">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    value={verificationForm.idNumber}
                    onChange={handleVerificationChange}
                    className={`input-premium ${errors.idNumber ? "border-rose-500 focus:border-rose-500" : ""}`}
                    placeholder="Enter your ID number"
                    required
                  />
                  {errors.idNumber && (
                    <p className="text-rose-500 text-sm mt-1">
                      {errors.idNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <p className="font-medium text-structural">
                    Required Documents
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 border-2 border-dashed border-border rounded-lg hover:border-gradient-amber transition-colors">
                      <label className="block cursor-pointer">
                        <input
                          type="file"
                          name="idFrontImage"
                          accept="image/*"
                          onChange={handleVerificationChange}
                          className="hidden"
                          id="idFrontImage"
                        />
                        <div className="text-center">
                          <svg
                            className="h-10 w-10 mx-auto text-structural/40 mb-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          <p className="font-medium text-structural">
                            Front of ID
                          </p>
                          <p className="text-sm text-structural/60">
                            Clear photo of the front
                          </p>
                          {verificationForm.idFrontImage && (
                            <p className="text-sm text-gradient-amber mt-1">
                              ✓ {verificationForm.idFrontImage.name}
                            </p>
                          )}
                          <span className="btn-outline mt-2 inline-block">
                            Choose File
                          </span>
                        </div>
                      </label>
                      {errors.idFrontImage && (
                        <p className="text-rose-500 text-sm mt-2 text-center">
                          {errors.idFrontImage}
                        </p>
                      )}
                    </div>

                    <div className="p-4 border-2 border-dashed border-border rounded-lg hover:border-gradient-amber transition-colors">
                      <label className="block cursor-pointer">
                        <input
                          type="file"
                          name="idBackImage"
                          accept="image/*"
                          onChange={handleVerificationChange}
                          className="hidden"
                          id="idBackImage"
                        />
                        <div className="text-center">
                          <svg
                            className="h-10 w-10 mx-auto text-structural/40 mb-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          <p className="font-medium text-structural">
                            Back of ID
                          </p>
                          <p className="text-sm text-structural/60">
                            Clear photo of the back
                          </p>
                          {verificationForm.idBackImage && (
                            <p className="text-sm text-gradient-amber mt-1">
                              ✓ {verificationForm.idBackImage.name}
                            </p>
                          )}
                          <span className="btn-outline mt-2 inline-block">
                            Choose File
                          </span>
                        </div>
                      </label>
                      {errors.idBackImage && (
                        <p className="text-rose-500 text-sm mt-2 text-center">
                          {errors.idBackImage}
                        </p>
                      )}
                    </div>

                    <div className="p-4 border-2 border-dashed border-border rounded-lg hover:border-gradient-amber transition-colors">
                      <label className="block cursor-pointer">
                        <input
                          type="file"
                          name="selfieImage"
                          accept="image/*"
                          onChange={handleVerificationChange}
                          className="hidden"
                          id="selfieImage"
                        />
                        <div className="text-center">
                          <svg
                            className="h-10 w-10 mx-auto text-structural/40 mb-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <circle cx="12" cy="8" r="4" />
                            <path d="M12 14c-2 0-4 2-4 4h8c0-2-2-4-4-4z" />
                          </svg>
                          <p className="font-medium text-structural">
                            Selfie with ID
                          </p>
                          <p className="text-sm text-structural/60">
                            Hold ID next to your face
                          </p>
                          {verificationForm.selfieImage && (
                            <p className="text-sm text-gradient-amber mt-1">
                              ✓ {verificationForm.selfieImage.name}
                            </p>
                          )}
                          <span className="btn-outline mt-2 inline-block">
                            Choose File
                          </span>
                        </div>
                      </label>
                      {errors.selfieImage && (
                        <p className="text-rose-500 text-sm mt-2 text-center">
                          {errors.selfieImage}
                        </p>
                      )}
                    </div>

                    <div className="p-4 border-2 border-dashed border-border rounded-lg hover:border-gradient-amber transition-colors">
                      <label className="block cursor-pointer">
                        <input
                          type="file"
                          name="utilityBill"
                          accept="image/*,application/pdf"
                          onChange={handleVerificationChange}
                          className="hidden"
                          id="utilityBill"
                        />
                        <div className="text-center">
                          <svg
                            className="h-10 w-10 mx-auto text-structural/40 mb-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                          <p className="font-medium text-structural">
                            Utility Bill (Optional)
                          </p>
                          <p className="text-sm text-structural/60">
                            Proof of address (max 3 months old)
                          </p>
                          {verificationForm.utilityBill && (
                            <p className="text-sm text-gradient-amber mt-1">
                              ✓ {verificationForm.utilityBill.name}
                            </p>
                          )}
                          <span className="btn-outline mt-2 inline-block">
                            Choose File
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg
                      className="h-5 w-5 text-gradient-amber flex-shrink-0 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                    <div className="text-sm text-structural/70">
                      <p className="font-medium text-structural mb-1">
                        Document Requirements
                      </p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Clear, readable photos (no blur or glare)</li>
                        <li>All four corners visible</li>
                        <li>Max file size: 5MB each</li>
                        <li>Formats: JPG, PNG, PDF</li>
                        <li>Documents must be valid and not expired</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {activeStep === 5 && (
              <div className="card-premium p-6 sm:p-8">
                <div className="mb-6">
                  <h2 className="font-display text-xl font-bold text-structural mb-1">
                    Review & Submit
                  </h2>
                  <p className="text-structural/60">
                    Please review all information before submitting
                  </p>
                </div>

                <div className="space-y-6 mb-6">
                  {/* Business Info Review */}
                  <div className="bg-background-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-structural mb-3 flex items-center gap-2">
                      <svg
                        className="h-5 w-5 text-gradient-amber"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Business Information
                    </h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <dt className="text-structural/60">Business Name</dt>
                      <dd className="font-medium text-structural">
                        {businessForm.businessName}
                      </dd>
                      <dt className="text-structural/60">Type</dt>
                      <dd className="font-medium text-structural capitalize">
                        {businessForm.businessType}
                      </dd>
                      <dt className="text-structural/60">Category</dt>
                      <dd className="font-medium text-structural">
                        {businessForm.businessCategory}
                      </dd>
                      <dt className="text-structural/60">Email</dt>
                      <dd className="font-medium text-structural">
                        {businessForm.businessEmail}
                      </dd>
                      <dt className="text-structural/60">Phone</dt>
                      <dd className="font-medium text-structural">
                        {businessForm.businessPhone}
                      </dd>
                      <dt className="text-structural/60">Address</dt>
                      <dd className="font-medium text-structural">
                        {businessForm.businessAddress},{" "}
                        {businessForm.businessCity},{" "}
                        {businessForm.businessState}
                      </dd>
                    </dl>
                  </div>

                  {/* Personal Info Review */}
                  <div className="bg-background-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-structural mb-3 flex items-center gap-2">
                      <svg
                        className="h-5 w-5 text-gradient-amber"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Personal Information
                    </h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <dt className="text-structural/60">Full Name</dt>
                      <dd className="font-medium text-structural">
                        {personalForm.firstName} {personalForm.lastName}
                      </dd>
                      <dt className="text-structural/60">Email</dt>
                      <dd className="font-medium text-structural">
                        {personalForm.email}
                      </dd>
                      <dt className="text-structural/60">Phone</dt>
                      <dd className="font-medium text-structural">
                        {personalForm.phone}
                      </dd>
                      <dt className="text-structural/60">Date of Birth</dt>
                      <dd className="font-medium text-structural">
                        {personalForm.dateOfBirth}
                      </dd>
                      <dt className="text-structural/60">NIN</dt>
                      <dd className="font-medium text-structural font-mono">
                        {personalForm.nin}
                      </dd>
                      <dt className="text-structural/60">BVN</dt>
                      <dd className="font-medium text-structural font-mono">
                        {personalForm.bvn}
                      </dd>
                    </dl>
                  </div>

                  {/* Bank Details Review */}
                  <div className="bg-background-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-structural mb-3 flex items-center gap-2">
                      <svg
                        className="h-5 w-5 text-gradient-amber"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                        <path d="M3 22v-4a2 2 0 0 1 2-2h14v4" />
                        <path d="M10 2v2M14 2v2M7 7h10" />
                      </svg>
                      Bank Details
                    </h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <dt className="text-structural/60">Bank</dt>
                      <dd className="font-medium text-structural">
                        {bankForm.bankName}
                      </dd>
                      <dt className="text-structural/60">Account Name</dt>
                      <dd className="font-medium text-structural">
                        {bankForm.accountName}
                      </dd>
                      <dt className="text-structural/60">Account Number</dt>
                      <dd className="font-medium text-structural font-mono">
                        ••••••{bankForm.accountNumber?.slice(-4)}
                      </dd>
                      <dt className="text-structural/60">Sort Code</dt>
                      <dd className="font-medium text-structural font-mono">
                        {bankForm.sortCode || "Not provided"}
                      </dd>
                    </dl>
                  </div>
                </div>

                {/* Agreements */}
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-structural">
                    Agreements *
                  </h3>

                  {[
                    {
                      key: "termsOfService",
                      label: "Terms of Service",
                      href: "#",
                    },
                    {
                      key: "privacyPolicy",
                      label: "Privacy Policy",
                      href: "#",
                    },
                    {
                      key: "sellerAgreement",
                      label: "Seller Agreement",
                      href: "#",
                    },
                    {
                      key: "marketingEmails",
                      label: "Receive marketing emails (optional)",
                      href: null,
                    },
                  ].map(({ key, label, href }) => (
                    <label
                      key={key}
                      className="flex items-start gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name={key}
                        checked={agreements[key]}
                        onChange={handleAgreementChange}
                        className="w-4 h-4 mt-0.5 rounded border-border text-gradient-amber focus:ring-amber-500"
                        required={key !== "marketingEmails"}
                      />
                      <div>
                        <p className="text-structural/70">{label}</p>
                        {href && (
                          <p className="text-xs text-structural/50">
                            By checking, you agree to our{" "}
                            <a
                              href={href}
                              className="text-gradient-amber hover:underline"
                            >
                              {label}
                            </a>
                            .
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                  {(errors.termsOfService ||
                    errors.privacyPolicy ||
                    errors.sellerAgreement) && (
                    <p className="text-rose-500 text-sm ml-7">
                      You must accept all required agreements
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 mt-4 border-t border-border">
              {activeStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  size="lg"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back
                </Button>
              )}
              {activeStep < steps.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  size="lg"
                  disabled={!canGoNext}
                >
                  Continue
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="group"
                >
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
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <svg
                        className="h-5 w-5 transition-transform group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Info Banner */}
      <div
        className="bg-gradient-amber/5 border-t border-gradient-amber/20 py-8 animate-fade-in"
        style={{ animationDelay: "400ms" }}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-amber/10 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-gradient-amber"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h4 className="font-semibold text-structural">Secure Platform</h4>
              <p className="text-sm text-structural/60">
                Bank-grade encryption for your data
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-amber/10 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-gradient-amber"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                  <path d="M3 22v-4a2 2 0 0 1 2-2h14v4" />
                  <path d="M10 2v2M14 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="font-semibold text-structural">Fast Payouts</h4>
              <p className="text-sm text-structural/60">
                Get paid weekly to your bank account
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-amber/10 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-gradient-amber"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h4 className="font-semibold text-structural">
                Dedicated Support
              </h4>
              <p className="text-sm text-structural/60">
                Seller success team available 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerJoin;
