"use client";

import { motion } from "framer-motion";
import {
  Send,
  CheckCircle,
  Lightbulb,
  FileText,
  Clock,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

const categories = [
  "AI Tools",
  "Productivity",
  "Project Management",
  "Marketing",
  "SEO",
  "Developer Tools",
  "Design",
  "Automation",
  "Analytics",
  "Affiliate Marketing",
  "CRM",
  "E-commerce",
  "Security",
  "Other",
] as const;

const roles = [
  "Founder",
  "Co-Founder",
  "Marketing Team",
  "Employee",
  "Partner",
  "Agency",
  "User",
  "Other",
] as const;

const bestForOptions = [
  "Startups",
  "Freelancers",
  "Agencies",
  "Developers",
  "Marketing Teams",
  "Enterprise",
  "Small Business",
  "Creators",
] as const;

type UploadedAsset = {
  name: string;
  type: string;
  dataUrl: string;
};

type FormState = {
  toolName: string;
  website: string;
  category: string;
  oneLineDescription: string;
  whyShouldWeFeature: string;
  contactEmail: string;
  yourRole: string;
  freePlanAvailable: "yes" | "no" | "";
  startingPrice: string;
  affiliateProgramAvailable: "yes" | "no" | "not_sure" | "";
  affiliatePartnerUrl: string;
  mainCompetitors: string;
  bestFor: string[];
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read file."));
    };

    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  try {
    return new URL(trimmed).toString();
  } catch {
    try {
      return new URL(`https://${trimmed}`).toString();
    } catch {
      return "";
    }
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function SubmitToolPage() {
  const [formData, setFormData] = useState<FormState>({
    toolName: "",
    website: "",
    category: "",
    oneLineDescription: "",
    whyShouldWeFeature: "",
    contactEmail: "",
    yourRole: "",
    freePlanAvailable: "",
    startingPrice: "",
    affiliateProgramAvailable: "",
    affiliatePartnerUrl: "",
    mainCompetitors: "",
    bestFor: [],
  });

  const [logoUpload, setLogoUpload] = useState<UploadedAsset | null>(null);
  const [productScreenshots, setProductScreenshots] = useState<UploadedAsset[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedBestForCount = useMemo(() => formData.bestFor.length, [formData.bestFor]);
  const showAffiliateUrl = formData.affiliateProgramAvailable === "yes";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitted(false);

    const requiredFields = [
      formData.toolName.trim(),
      formData.website.trim(),
      formData.category.trim(),
      formData.oneLineDescription.trim(),
      formData.whyShouldWeFeature.trim(),
      formData.contactEmail.trim(),
    ];

    if (requiredFields.some((value) => !value)) {
      setErrorMessage("Please fill out all required fields before submitting.");
      return;
    }

    if (!isValidEmail(formData.contactEmail)) {
      setErrorMessage("Please enter a valid contact email address.");
      return;
    }

    const normalizedWebsite = normalizeUrl(formData.website);
    if (!normalizedWebsite) {
      setErrorMessage("Please enter a valid official website URL.");
      return;
    }

    if (showAffiliateUrl) {
      const normalizedAffiliateUrl = normalizeUrl(formData.affiliatePartnerUrl);
      if (!normalizedAffiliateUrl) {
        setErrorMessage("Please provide a valid affiliate or partner URL.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        toolName: formData.toolName.trim(),
        website: normalizedWebsite,
        category: formData.category.trim(),
        oneLineDescription: formData.oneLineDescription.trim(),
        whyShouldWeFeature: formData.whyShouldWeFeature.trim(),
        contactEmail: formData.contactEmail.trim(),
        yourRole: formData.yourRole.trim(),
        freePlanAvailable: formData.freePlanAvailable,
        startingPrice: formData.startingPrice.trim(),
        affiliateProgramAvailable: formData.affiliateProgramAvailable,
        affiliatePartnerUrl: formData.affiliatePartnerUrl.trim(),
        mainCompetitors: formData.mainCompetitors.trim(),
        bestFor: formData.bestFor,
        logoUpload: logoUpload
          ? {
              name: logoUpload.name,
              type: logoUpload.type,
              dataUrl: logoUpload.dataUrl,
            }
          : null,
        productScreenshots: productScreenshots.map((asset) => ({
          name: asset.name,
          type: asset.type,
          dataUrl: asset.dataUrl,
        })),
      };

      const response = await fetch("/api/submit-tool", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: { error?: string } = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          toolName: "",
          website: "",
          category: "",
          oneLineDescription: "",
          whyShouldWeFeature: "",
          contactEmail: "",
          yourRole: "",
          freePlanAvailable: "",
          startingPrice: "",
          affiliateProgramAvailable: "",
          affiliatePartnerUrl: "",
          mainCompetitors: "",
          bestFor: [],
        });
        setLogoUpload(null);
        setProductScreenshots([]);
      } else {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setErrorMessage("Failed to connect to the server. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleBestFor = (value: string) => {
    setFormData((prev) => {
      const exists = prev.bestFor.includes(value);

      return {
        ...prev,
        bestFor: exists
          ? prev.bestFor.filter((item) => item !== value)
          : [...prev.bestFor, value],
      };
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");

    const file = e.target.files?.[0];
    if (!file) {
      setLogoUpload(null);
      return;
    }

    const allowedTypes = new Set(["image/png", "image/svg+xml"]);

    if (!allowedTypes.has(file.type)) {
      setErrorMessage("Logo upload must be a PNG or SVG file.");
      e.target.value = "";
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setLogoUpload({
        name: file.name,
        type: file.type,
        dataUrl,
      });
    } catch {
      setErrorMessage("Could not read the logo file. Please try again.");
    } finally {
      e.target.value = "";
    }
  };

  const handleScreenshotsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");

    const files = Array.from(e.target.files || []);
    if (!files.length) {
      setProductScreenshots([]);
      return;
    }

    if (files.length > 3) {
      setErrorMessage("Please upload no more than 3 product screenshots.");
      e.target.value = "";
      return;
    }

    const allowedTypes = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

    const unsupportedFile = files.find((file) => !allowedTypes.has(file.type));
    if (unsupportedFile) {
      setErrorMessage("Product screenshots must be PNG, JPG, JPEG, or WEBP files.");
      e.target.value = "";
      return;
    }

    try {
      const uploaded = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          dataUrl: await fileToDataUrl(file),
        }))
      );

      setProductScreenshots(uploaded);
    } catch {
      setErrorMessage("Could not read one or more screenshot files. Please try again.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(24,24,27,0.04),transparent_40%),radial-gradient(circle_at_bottom,rgba(24,24,27,0.03),transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 shadow-sm">
                <Lightbulb className="h-4 w-4 text-zinc-500" />
                Submit a Tool
              </span>
            </motion.div>

            <motion.h1
              className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Share a tool with the StackForge AI review team
            </motion.h1>

            <motion.p
              className="mx-auto max-w-2xl text-lg leading-relaxed text-zinc-600 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Send us a polished submission and we will review it manually for a potential feature, comparison placement, and editorial coverage.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Submission Process */}
      <section className="border-b border-zinc-200 bg-white py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm"
          >
            <h2 className="mb-8 text-center text-xl font-bold tracking-tight text-zinc-900">
              How It Works
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm">
                  <span className="text-lg font-bold text-zinc-700">1</span>
                </div>
                <h3 className="mb-2 font-semibold text-zinc-900">Submit Your Tool</h3>
                <p className="text-sm text-zinc-600">Fill out the form with accurate details and media.</p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm">
                  <span className="text-lg font-bold text-zinc-700">2</span>
                </div>
                <h3 className="mb-2 font-semibold text-zinc-900">We Review It</h3>
                <p className="text-sm text-zinc-600">Our team checks positioning, usefulness, and quality.</p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm">
                  <span className="text-lg font-bold text-zinc-700">3</span>
                </div>
                <h3 className="mb-2 font-semibold text-zinc-900">Get Featured</h3>
                <p className="text-sm text-zinc-600">Approved tools may appear on review pages and the homepage.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Submission Form Section */}
      <section className="bg-zinc-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm md:p-10">
                <h2 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900">
                  Tool Submission
                </h2>
                <p className="mb-8 text-sm leading-6 text-zinc-600">
                  Fields marked with <span className="font-semibold text-zinc-900">*</span> are required.
                </p>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 shadow-sm">
                      <CheckCircle className="h-8 w-8 text-zinc-700" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-zinc-900">
                      Submission Received!
                    </h3>
                    <p className="mx-auto mb-6 max-w-sm text-sm text-zinc-600">
                      Thank you. Your submission has been sent to the editorial team for manual review.
                    </p>
                    <Button
                      variant="outline"
                      className="border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 hover:text-zinc-950"
                      onClick={() => setSubmitted(false)}
                    >
                      Submit Another Tool
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-8">
                    <section className="space-y-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label htmlFor="toolName" className="mb-2 block text-sm font-medium text-zinc-700">
                            Tool Name <span className="text-zinc-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="toolName"
                            name="toolName"
                            value={formData.toolName}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-500 focus:bg-white"
                            placeholder="e.g., ClickUp"
                          />
                        </div>

                        <div>
                          <label htmlFor="website" className="mb-2 block text-sm font-medium text-zinc-700">
                            Official Website <span className="text-zinc-500">*</span>
                          </label>
                          <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-500 focus:bg-white"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label htmlFor="category" className="mb-2 block text-sm font-medium text-zinc-700">
                            Category <span className="text-zinc-500">*</span>
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-all focus:border-zinc-500"
                          >
                            <option value="" className="bg-white text-zinc-500">
                              Select a category
                            </option>
                            {categories.map((category) => (
                              <option key={category} value={category} className="bg-white text-zinc-900">
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="yourRole" className="mb-2 block text-sm font-medium text-zinc-700">
                            Your Role
                          </label>
                          <select
                            id="yourRole"
                            name="yourRole"
                            value={formData.yourRole}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-all focus:border-zinc-500"
                          >
                            <option value="" className="bg-white text-zinc-500">
                              Select your role
                            </option>
                            {roles.map((role) => (
                              <option key={role} value={role} className="bg-white text-zinc-900">
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="oneLineDescription"
                          className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                          One-Line Description <span className="text-zinc-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="oneLineDescription"
                          name="oneLineDescription"
                          value={formData.oneLineDescription}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-500 focus:bg-white"
                          placeholder="A concise, high-value summary of the tool"
                        />
                      </div>
                    </section>

                    <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-5">
                      <div>
                        <label
                          htmlFor="whyShouldWeFeature"
                          className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                          Why Should We Feature This Tool? <span className="text-zinc-500">*</span>
                        </label>
                        <textarea
                          id="whyShouldWeFeature"
                          name="whyShouldWeFeature"
                          value={formData.whyShouldWeFeature}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="w-full resize-none rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-500 focus:bg-white"
                          placeholder="Explain the product's positioning, unique value, and why readers should care."
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label htmlFor="contactEmail" className="mb-2 block text-sm font-medium text-zinc-700">
                            Contact Email <span className="text-zinc-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="contactEmail"
                            name="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-500 focus:bg-white"
                            placeholder="founder@example.com"
                          />
                        </div>

                        <div>
                          <label htmlFor="startingPrice" className="mb-2 block text-sm font-medium text-zinc-700">
                            Starting Price
                          </label>
                          <input
                            type="text"
                            id="startingPrice"
                            name="startingPrice"
                            value={formData.startingPrice}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-500 focus:bg-white"
                            placeholder="$9/month"
                          />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label htmlFor="freePlanAvailable" className="mb-3 block text-sm font-medium text-zinc-700">
                            Free Plan Available?
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {["yes", "no"].map((option) => (
                              <label
                                key={option}
                                className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition-colors hover:bg-zinc-50"
                              >
                                <input
                                  type="radio"
                                  name="freePlanAvailable"
                                  value={option}
                                  checked={formData.freePlanAvailable === option}
                                  onChange={handleChange}
                                  className="h-4 w-4 border-zinc-300 text-zinc-900"
                                />
                                <span className="capitalize text-zinc-700">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="affiliateProgramAvailable"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                          >
                            Affiliate Program Available?
                          </label>
                          <select
                            id="affiliateProgramAvailable"
                            name="affiliateProgramAvailable"
                            value={formData.affiliateProgramAvailable}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-all focus:border-zinc-500"
                          >
                            <option value="" className="bg-white text-zinc-500">
                              Select an option
                            </option>
                            <option value="yes" className="bg-white text-zinc-900">
                              Yes
                            </option>
                            <option value="no" className="bg-white text-zinc-900">
                              No
                            </option>
                            <option value="not_sure" className="bg-white text-zinc-900">
                              Not Sure
                            </option>
                          </select>
                        </div>
                      </div>

                      {showAffiliateUrl && (
                        <div>
                          <label htmlFor="affiliatePartnerUrl" className="mb-2 block text-sm font-medium text-zinc-700">
                            Affiliate / Partner URL
                          </label>
                          <input
                            type="url"
                            id="affiliatePartnerUrl"
                            name="affiliatePartnerUrl"
                            value={formData.affiliatePartnerUrl}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-500 focus:bg-white"
                            placeholder="https://partner.example.com"
                          />
                        </div>
                      )}

                      <div>
                        <label htmlFor="mainCompetitors" className="mb-2 block text-sm font-medium text-zinc-700">
                          Main Competitors
                        </label>
                        <input
                          type="text"
                          id="mainCompetitors"
                          name="mainCompetitors"
                          value={formData.mainCompetitors}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-500 focus:bg-white"
                          placeholder="Asana, Notion, Monday"
                        />
                        <p className="mt-2 text-xs text-zinc-500">
                          Add up to 5 competitors, separated by commas.
                        </p>
                      </div>
                    </section>

                    <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-5">
                      <div>
                        <div className="mb-3 flex items-center justify-between gap-4">
                          <label className="block text-sm font-medium text-zinc-700">
                            Best For
                          </label>
                          <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                            {selectedBestForCount} selected
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          {bestForOptions.map((option) => {
                            const checked = formData.bestFor.includes(option);

                            return (
                              <label
                                key={option}
                                className={[
                                  "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
                                  checked
                                    ? "border-zinc-300 bg-zinc-100 text-zinc-900"
                                    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
                                ].join(" ")}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleBestFor(option)}
                                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-300"
                                />
                                <span>{option}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </section>

                    <section className="space-y-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-zinc-700">
                            Logo Upload
                          </label>
                          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-6 text-center transition-colors hover:bg-zinc-50">
                            <Upload className="h-5 w-5 text-zinc-500" />
                            <div>
                              <p className="text-sm font-medium text-zinc-900">Upload SVG or PNG</p>
                              <p className="mt-1 text-xs text-zinc-500">One logo file only</p>
                            </div>
                            <input
                              type="file"
                              accept=".png,.svg,image/png,image/svg+xml"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                          </label>

                          {logoUpload && (
                            <div className="mt-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
                              <p className="text-sm font-medium text-zinc-900">Selected logo</p>
                              <p className="mt-1 break-all text-xs text-zinc-600">{logoUpload.name}</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-zinc-700">
                            Product Screenshots
                          </label>
                          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-6 text-center transition-colors hover:bg-zinc-50">
                            <ImageIcon className="h-5 w-5 text-zinc-500" />
                            <div>
                              <p className="text-sm font-medium text-zinc-900">Upload up to 3 images</p>
                              <p className="mt-1 text-xs text-zinc-500">PNG, JPG, JPEG, or WEBP</p>
                            </div>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/webp"
                              multiple
                              onChange={handleScreenshotsUpload}
                              className="hidden"
                            />
                          </label>

                          {productScreenshots.length > 0 && (
                            <div className="mt-3 grid grid-cols-1 gap-2">
                              {productScreenshots.map((shot) => (
                                <div
                                  key={shot.name}
                                  className="rounded-xl border border-zinc-200 bg-white px-4 py-3"
                                >
                                  <p className="break-all text-sm font-medium text-zinc-900">
                                    {shot.name}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {(logoUpload || productScreenshots.length > 0) && (
                        <div className="space-y-4">
                          {logoUpload && (
                            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4">
                              <p className="mb-3 text-sm font-medium text-zinc-900">Logo Preview</p>
                              <img
                                src={logoUpload.dataUrl}
                                alt="Uploaded logo preview"
                                className="h-auto max-h-40 w-auto rounded-lg border border-zinc-200 bg-white object-contain"
                              />
                            </div>
                          )}

                          {productScreenshots.length > 0 && (
                            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                              <p className="mb-3 text-sm font-medium text-zinc-900">Screenshot Previews</p>
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {productScreenshots.map((shot, index) => (
                                  <div key={`${shot.name}-${index}`} className="overflow-hidden rounded-xl border border-zinc-200">
                                    <img
                                      src={shot.dataUrl}
                                      alt={`Screenshot ${index + 1}`}
                                      className="h-56 w-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </section>

                    {errorMessage && (
                      <div className="rounded-2xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-700">
                        {errorMessage}
                      </div>
                    )}

                    <div className="space-y-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 font-semibold text-white transition-all hover:bg-zinc-800 disabled:opacity-50"
                      >
                        {isSubmitting ? "Submitting..." : (
                          <>
                            <Send className="h-4 w-4" />
                            Submit Tool
                          </>
                        )}
                      </Button>

                      <div className="rounded-2xl border border-zinc-200 bg-zinc-100 p-4 text-sm leading-6 text-zinc-700">
                        <p className="font-medium text-zinc-900">
                          Every submission is manually reviewed. Approved tools may receive:
                        </p>
                        <p className="mt-2">
                          • Dedicated review page • Comparison coverage • Homepage visibility • Featured deal placement • Editorial recommendations
                        </p>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <FileText className="h-5 w-5 text-zinc-500" />
                  <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                    Submission Tips
                  </h2>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-zinc-600">
                  <p>Use a short, sharp description that explains the product clearly.</p>
                  <p>Upload a clean logo and 1 to 3 screenshots to help the review team judge the product faster.</p>
                  <p>Include your contact email so we can follow up if we need anything before publishing.</p>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-zinc-500" />
                  <h3 className="text-lg font-bold tracking-tight text-zinc-900">
                    Review Timeline
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600">
                  We review submissions manually. Strong positioning, credible media, and clear partner details help move your tool forward faster.
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-zinc-500" />
                  <h3 className="text-lg font-bold tracking-tight text-zinc-900">
                    What We Look For
                  </h3>
                </div>
                <div className="space-y-3 text-sm text-zinc-600">
                  <p>• Clear product value</p>
                  <p>• Accurate contact details</p>
                  <p>• Real screenshots</p>
                  <p>• Strong fit for our readers</p>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm">
                <h3 className="mb-4 text-lg font-bold tracking-tight text-zinc-900">
                  Supported Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
