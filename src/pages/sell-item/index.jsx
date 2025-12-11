import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Step Components
import Step1 from "./components/step1";
import Step1A from "./components/step1A.jsx"; // Product subcategories
import Step1B from "./components/step1B.jsx"; // Room subcategories
import Step1C from "./components/step1C.jsx"; // Job subcategories
import Step1D from "./components/step1D.jsx"; // Service subcategories

import Step2 from "./components/step2";
import Step3 from "./components/step3";
import Step4 from "./components/step4";
import Step5 from "./components/step5";
import Step6 from "./components/step6";

export default function SellItem() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ==========================================
  // CATEGORY STATES
  // ==========================================
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        const list = res.data.categories || [];
        setCategories(list);

        const map = {};
        list.forEach(cat => map[cat.title] = cat._id);
        setCategoryMap(map);

      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    loadCategories();
  }, []);

  // ==========================================
  // MASTER FORM DATA
  // ==========================================
  const [form, setForm] = useState({
    categoryType: "",  // Product / Room / Job / Service
    category: "",      // Subcategory
    title: "",
    description: "",
    condition: "Used", // For products
    photos: [],

    // Price / Rent / Salary / Rate
    priceDetails: {
      mode: "",
      price: "",     // For products
      minPrice: "",
      rent: "",      // For rooms
      salary: "",    // For jobs
      rate: "",      // For services
    },

    // Location (Rooms & Jobs)
    location: {
      area: "",
      city: "",
      state: "",
      pincode: "",
      address: "",
      mapLink: ""
    },

    // Room-specific
    roomType: "",
    bhk: 1,
    furnished: "Semi-Furnished",
    availableFrom: "",
    contactNumber: "",
    features: {},
    rules: {},

    // Job-specific
    jobType: "",
    experience: "",
    skills: [],

    // Service-specific
    serviceType: "",
  });

  // ----------- Update Handlers -------------
  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateLocation = (updatedLocation) => {
    setForm(prev => ({ ...prev, location: { ...prev.location, ...updatedLocation } }));
  };

  const updatePhotos = (newPhotosArray) => {
    setForm(prev => ({ ...prev, photos: newPhotosArray }));
  };

  // ==========================================
  // API ENDPOINT
  // ==========================================
  const getApiEndpoint = () => {
    switch (form.categoryType) {
      case "Product": return "products";
      case "Room": return "rooms";
      case "Job": return "jobs";
      case "Service": return "services";
      default: return "products";
    }
  };

  // ==========================================
  // FINAL SUBMISSION
  // ==========================================
  const handleFinalSubmit = async () => {
    // Basic validation
    if (!form.title || !form.description || form.photos.length === 0) {
      alert("Please fill all required fields and add at least one photo.");
      return;
    }

    // Category-specific validation
    if (form.categoryType === "Room") {
      if (!form.priceDetails.rent || !form.contactNumber || !form.location.area || !form.location.city) {
        alert("Please fill rent, contact number, area, and city for Room.");
        return;
      }
    }

    if (form.categoryType === "Job") {
      if (!form.priceDetails.salary || !form.jobType || !form.location.city) {
        alert("Please fill salary, job type, and city for Job.");
        return;
      }
    }

    if (form.categoryType === "Service") {
      if (!form.serviceType || !form.priceDetails.rate) {
        alert("Please fill service type and rate for Service.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // -----------------------
      // COMMON FIELDS
      // -----------------------
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("condition", form.condition);

      // Photos
      form.photos.forEach(file => formData.append("images", file));

      // -----------------------
      // LOCATION
      // -----------------------
      formData.append("location", JSON.stringify(form.location));

      // -----------------------
      // CATEGORY-SPECIFIC FIELDS
      // -----------------------
      if (form.categoryType === "Room") {
        formData.append("rent", form.priceDetails.rent);
        formData.append("contactNumber", form.contactNumber);
        formData.append("roomType", form.roomType);
        formData.append("bhk", form.bhk);
        formData.append("furnished", form.furnished);
        formData.append("availableFrom", form.availableFrom);
        formData.append("features", JSON.stringify(form.features));
        formData.append("rules", JSON.stringify(form.rules));
      }

      if (form.categoryType === "Job") {
        // Category ID
        const categoryId = categoryMap[form.category];
        if (!categoryId) throw new Error(`Category ID not found for: ${form.category}`);
        formData.append("category", categoryId);

        formData.append("salary", form.priceDetails.salary);
        formData.append("jobType", form.jobType);
        formData.append("experience", form.experience);
        formData.append("skills", JSON.stringify(form.skills));
      }

      if (form.categoryType === "Service") {
        // Category ID
        const categoryId = categoryMap[form.category];
        if (!categoryId) throw new Error(`Category ID not found for: ${form.category}`);
        formData.append("category", categoryId);

        formData.append("serviceType", form.serviceType);
        formData.append("rate", form.priceDetails.rate);
      }

      if (form.categoryType === "Product") {
        // Category ID
        const categoryId = categoryMap[form.category];
        if (!categoryId) throw new Error(`Category ID not found for: ${form.category}`);
        formData.append("category", categoryId);

        formData.append("price", form.priceDetails.price);
        formData.append("minPrice", form.priceDetails.minPrice);
      }

      // -----------------------
      // POST REQUEST
      // -----------------------
      const token = localStorage.getItem("accessToken");
      const endpoint = getApiEndpoint();

      const response = await axios.post(
        `http://localhost:5000/api/${endpoint}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Listing Published Successfully!");
        setIsSubmitted(true);
      }

    } catch (err) {
      console.error("Submission Failed:", err);
      toast.error(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // RENDER STEPS
  // ==========================================
  return (
    <div>
      {/* Step 1: Main Category */}
      {step === 1 && (
        <Step1
          onSelect={(categoryName) => {
            updateField("categoryType", categoryName);
            if (categoryName === "Product") setStep("1A");
            else if (categoryName === "Room") setStep("1B");
            else if (categoryName === "Job") setStep("1C");
            else if (categoryName === "Service") setStep("1D");
          }}
          categories={categories.filter(cat => !cat.parent)}
        />
      )}

      {/* Step 1A-D: Subcategories */}
      {step === "1A" && (
        <Step1A
          onSelect={(subCat) => { updateField("category", subCat); setStep(2); }}
          categories={categories.filter(cat => cat.parent && cat.type === "product")}
        />
      )}
      {step === "1B" && (
        <Step1B
          onSelect={(roomType) => { updateField("roomType", roomType); toast.success(`${roomType} selected!`); setStep(2); }}
        />
      )}
      {step === "1C" && (
        <Step1C
          onSelect={(subCat) => { updateField("category", subCat); setStep(2); }}
          categories={categories.filter(cat => cat.parent && cat.type === "job")}
        />
      )}
      {step === "1D" && (
        <Step1D
          onSelect={(subCat) => { updateField("category", subCat); setStep(2); }}
          categories={categories.filter(cat => cat.parent && cat.type === "service")}
        />
      )}

      {/* Step 2: Item Details */}
      {step === 2 && (
        <Step2
          form={form}
          onChange={updateField}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {/* Step 3: Photos */}
      {step === 3 && (
        <Step3
          photos={form.photos}
          onPhotosChange={updatePhotos}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {/* Step 4: Price Details */}
      {step === 4 && (
        <Step4
          data={form.priceDetails}
          onNext={(priceData) => {
            updateField("priceDetails", priceData);
            if (form.categoryType === "Job") {
              updateField("jobType", priceData.jobType);
            }
            setStep(5);
          }}
          onBack={() => setStep(3)}
          categoryType={form.categoryType}
          jobType={form.jobType}
        />
      )}

      {/* Step 5: Location */}
      {step === 5 && (
        <Step5
          form={form.location}
          onNext={(locData) => { updateLocation(locData); setStep(6); }}
          onBack={() => setStep(4)}
          categoryType={form.categoryType} // optional: Step5 can require area for Rooms, city for Jobs
        />
      )}

      {/* Step 6: Publish */}
      {step === 6 && (
        <Step6
          formData={form}
          prevStep={() => setStep(5)}
          onPublish={handleFinalSubmit}
          isSubmitting={isSubmitting}
          isSubmitted={isSubmitted}
        />
      )}
    </div>
  );
}
