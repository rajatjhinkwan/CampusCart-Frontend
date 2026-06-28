import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import toast from "react-hot-toast";
import Navbar from "../../components/navbar";

// Step Components
import Step1 from "./components/step1";
import Step1A from "./components/step1A.jsx"; // Product subcategories
import Step1B from "./components/step1B.jsx"; // Room subcategories
import Step1C from "./components/step1C.jsx"; // Job subcategories
import Step1D from "./components/step1D.jsx"; // Service subcategories
import Step1E from "./components/step1E.jsx"; // Transport details

import Step2 from "./components/step2";
import Step3 from "./components/step3";
import Step4 from "./components/step4";
import Step5 from "./components/step5";
import Step6 from "./components/step6";
import { resolveCategoryId, mapCategoryTitle } from "../../utils/categoryResolve";
import { getMinPhotosForCategory } from "../../utils/sellFlowHelpers";

export default function SellItem() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ==========================================
  // CATEGORY STATES
  // ==========================================
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        const list = res.data.categories || [];
        setCategories(list);
        if (list.length === 0) {
          console.warn("No categories in database — run npm run seed:demo in my-backend");
        }
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
    category: "",      // Subcategory label
    categoryId: "",    // Resolved MongoDB category id
    title: "",
    description: "",
    condition: "Used", // For products
    brand: "",
    model: "",
    yearOfPurchase: "",
    imei: "",
    videoUrl: "",
    photos: [],

    // Price / Rent / Salary / Rate
    priceDetails: {
      mode: "Fixed", // Default to Fixed so price field is visible
      price: "",     // For products
      minPrice: "",
      rent: "",      // For rooms
      salary: "",    // For jobs
      rate: "",      // For services
      transactionType: "sell",
      rentalPeriod: "Monthly",
      securityDeposit: "",
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

    // Transport-specific
    vehicleName: "",
    vehicleType: "Car",
    vehicleNumber: "",
    seatsAvailable: 4,
    departureTime: "",
    frequency: "One-time",
    toCity: "",
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
      case "Transport": return "transports";
      default: return "products";
    }
  };

  const getCategorySubStep = () => {
    switch (form.categoryType) {
      case "Product": return "1A";
      case "Room": return "1B";
      case "Job": return "1C";
      case "Service": return "1D";
      case "Transport": return "1E";
      default: return 1;
    }
  };

  const resolveListingCategoryId = async (type) => {
    try {
      const res = await axios.get("/api/categories");
      const list = res.data.categories || [];
      if (list.length) setCategories(list);

      if (form.categoryId) {
        const stillValid = list.some((c) => String(c._id) === String(form.categoryId));
        if (stillValid) return form.categoryId;
      }

      return resolveCategoryId(form.category, list, type);
    } catch (err) {
      console.error("Error resolving category:", err);
      return resolveCategoryId(form.category, categories, type);
    }
  };

  // ==========================================
  // FINAL SUBMISSION
  // ==========================================
  const handleFinalSubmit = async () => {
    if (!form.title?.trim() || !form.description?.trim()) {
      alert("Please fill in a title and description.");
      return;
    }

    const minPhotos = getMinPhotosForCategory(form.categoryType);
    if (form.photos.length < minPhotos) {
      alert(
        minPhotos === 1
          ? "Please upload at least 1 photo."
          : "Please upload at least 4 clear photos from all sides."
      );
      return;
    }

    if (form.categoryType === "Product") {
      if (!form.priceDetails.price && form.priceDetails.transactionType !== "rent") {
        alert("Please set a price for your product.");
        return;
      }
      if (form.priceDetails.transactionType === "rent" && !form.priceDetails.price) {
        alert("Please set a rental price.");
        return;
      }
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
      if (!form.priceDetails.rate) {
        alert("Please set a service rate.");
        return;
      }
    }

    if (form.categoryType === "Transport") {
      if (!form.vehicleName || !form.departureTime || !form.toCity) {
        alert("Please fill vehicle name, departure time, and destination for Transport.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
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
        formData.append("salary", form.priceDetails.salary);
        formData.append("jobType", form.jobType || form.priceDetails.jobType);
        formData.append("duration", form.experience || form.priceDetails.experience || "Flexible");
        formData.append("experience", form.experience || form.priceDetails.experience || "");
        formData.append("skills", JSON.stringify(
          form.skills?.length ? form.skills : (form.priceDetails.skills || [])
        ));
      }

      if (form.categoryType === "Service") {
        const serviceLabel = form.serviceType || form.category;
        formData.append("category", mapCategoryTitle(serviceLabel, "service"));
        formData.append("serviceType", serviceLabel);
        formData.append("rate", form.priceDetails.rate);
      }

      if (form.categoryType === "Product") {
        if (!form.category?.trim()) {
          toast.error("Please select a product category.");
          setIsSubmitting(false);
          return;
        }

        const categoryId = await resolveListingCategoryId("product");
        if (categoryId) {
          formData.append("category", categoryId);
        }
        // Backend resolves categoryTitle when the categories API is empty or IDs drift
        formData.append("categoryTitle", form.category);

        const type = form.priceDetails.transactionType || "sell";
        formData.append("type", type);

        if (type === "rent") {
            formData.append("rentalPrice", form.priceDetails.price);
            formData.append("rentalPeriod", form.priceDetails.rentalPeriod || "Monthly");
            formData.append("securityDeposit", form.priceDetails.securityDeposit || 0);
            formData.append("price", 0);
        } else {
            formData.append("price", form.priceDetails.price);
            formData.append("minPrice", form.priceDetails.minPrice);
        }
        if (form.brand) {
          formData.append("brand", form.brand);
        }
        if (form.model) {
          formData.append("model", form.model);
        }
        if (form.yearOfPurchase) {
          formData.append("yearOfPurchase", form.yearOfPurchase);
        }
        if (form.imei) {
          formData.append("imei", form.imei);
        }
        if (form.vehicleNumber) {
          formData.append("vehicleNumber", form.vehicleNumber);
        }
        if (form.videoUrl) {
          formData.append("videoUrl", form.videoUrl);
        }
      }

      if (form.categoryType === "Transport") {
        formData.append("vehicleName", form.vehicleName);
        formData.append("vehicleType", form.vehicleType);
        formData.append("vehicleNumber", form.vehicleNumber);
        formData.append("seatsAvailable", form.seatsAvailable);
        formData.append("departureTime", form.departureTime);
        formData.append("frequency", form.frequency);
        formData.append("price", form.priceDetails.price || 0);
        if (form.frequency === "One-time") {
          formData.append("departureDate", form.availableFrom || new Date().toISOString());
        }

        const fromObj = {
          city: form.location.city || "My Location",
          address: form.location.address || form.location.area || ""
        };
        const toObj = {
          city: form.toCity,
          address: ""
        };
        formData.append("from", JSON.stringify(fromObj));
        formData.append("to", JSON.stringify(toObj));
      }

      // -----------------------
      // POST REQUEST
      // -----------------------
      const endpoint = getApiEndpoint();
      
      // Debug: Log what we are sending
      for (let [key, value] of formData.entries()) {
        console.log(`FormData: ${key} =`, value);
      }

      const response = await axios.post(
        `/api/${endpoint}`,
        formData
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
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar />
      {/* Step 1: Main Category */}
      {step === 1 && (
        <Step1
          onSelect={(categoryName) => {
            updateField("categoryType", categoryName);
            if (categoryName === "Product") setStep("1A");
            else if (categoryName === "Room") setStep("1B");
            else if (categoryName === "Job") setStep("1C");
            else if (categoryName === "Service") setStep("1D");
            else if (categoryName === "Transport") setStep("1E");
          }}
          categories={categories.filter(cat => !cat.parent)}
        />
      )}

      {/* Step 1A-D: Subcategories */}
      {step === "1A" && (
        <Step1A
          categories={categories}
          onSelect={(subCat, categoryId) => {
            updateField("category", subCat);
            updateField("categoryId", categoryId || "");
            toast.success(`${subCat} selected`);
            setStep(2);
          }}
          onBack={() => setStep(1)}
        />
      )}
      {step === "1B" && (
        <Step1B
          onSelect={(roomType) => {
            updateField("roomType", roomType);
            updateField("category", roomType);
            toast.success(`${roomType} selected`);
            setStep(2);
          }}
          onBack={() => setStep(1)}
        />
      )}
      {step === "1C" && (
        <Step1C
          onSelect={(subCat, categoryId) => {
            updateField("category", subCat);
            updateField("categoryId", categoryId || "");
            toast.success(`${subCat} selected`);
            setStep(2);
          }}
          onBack={() => setStep(1)}
          categories={categories.filter(cat => cat.parent && cat.type === "job")}
          allCategories={categories}
        />
      )}
      {step === "1D" && (
        <Step1D
          onSelect={(subCat, categoryId) => {
            updateField("category", subCat);
            updateField("serviceType", subCat);
            updateField("categoryId", categoryId || "");
            toast.success(`${subCat} selected`);
            setStep(2);
          }}
          onBack={() => setStep(1)}
          categories={categories.filter(cat => cat.parent && cat.type === "service")}
          allCategories={categories}
        />
      )}
      {step === "1E" && (
        <Step1E
          onNext={(data) => {
             updateField("vehicleName", data.vehicleName);
             updateField("vehicleType", data.vehicleType);
             updateField("vehicleNumber", data.vehicleNumber);
             updateField("seatsAvailable", data.seatsAvailable);
             updateField("departureTime", data.departureTime);
             updateField("frequency", data.frequency);
             updateField("toCity", data.toCity);
             
             updateField("title", `${data.vehicleType} from ${form.location.city || "My Location"} to ${data.toCity}`);
             updateField("description", `Available seats: ${data.seatsAvailable}. Leaving at ${data.departureTime}.`);
             
             setStep(2);
          }}
          onBack={() => setStep(1)}
        />
      )}

      {/* Step 2: Item Details */}
      {step === 2 && (
        <Step2
          form={form}
          onChange={updateField}
          onNext={() => {
            if (!form.title?.trim() || !form.description?.trim()) {
              toast.error("Please enter a title and description");
              return;
            }
            setStep(3);
          }}
          onBack={() => setStep(getCategorySubStep())}
        />
      )}

      {/* Step 3: Photos */}
      {step === 3 && (
        <Step3
          photos={form.photos}
          onPhotosChange={updatePhotos}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
          categoryType={form.categoryType}
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
              updateField("experience", priceData.experience);
              updateField("skills", priceData.skills || []);
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
