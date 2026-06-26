"use client";

import { motion } from "framer-motion";
import { Phone, MapPin, Clock, ShieldCheck, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, type ChangeEvent, type FormEvent } from "react";

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitted(false);

    const hasMissingFields = Object.values(formData).some((value) => !value.trim());
    if (hasMissingFields) {
      setErrorMessage("Please fill out all required fields before submitting.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data: { success?: boolean; message?: string; error?: string } = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(24,24,27,0.04),transparent_40%),radial-gradient(circle_at_bottom,rgba(24,24,27,0.03),transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 shadow-sm">
              <Phone className="h-4 w-4 text-zinc-500" />
              Get in Touch
            </span>
          </motion.div>

          <motion.h1
            className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Contact <span className="text-zinc-900">Us</span>
          </motion.h1>

          <motion.p
            className="mx-auto max-w-2xl text-xl leading-relaxed text-zinc-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Have questions about a tool? Want to suggest a feature? We&apos;d love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm md:p-10">
                <h2 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900">
                  Send us a message
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
                      <Send className="h-8 w-8 text-zinc-700" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-zinc-900">
                      Message Sent!
                    </h3>
                    <p className="mx-auto max-w-sm text-sm text-zinc-600">
                      We&apos;ll get back to you as soon as possible.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-6 border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 hover:text-zinc-950"
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium text-zinc-700">
                        Name <span className="text-zinc-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-700">
                        Email <span className="text-zinc-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="mb-2 block text-sm font-medium text-zinc-700">
                        Subject <span className="text-zinc-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
                        placeholder="What&apos;s this about?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="mb-2 block text-sm font-medium text-zinc-700">
                        Message <span className="text-zinc-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
                        placeholder="Tell us how we can help..."
                      />
                    </div>

                    {errorMessage && (
                      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700">
                        {errorMessage}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 font-semibold text-white transition-all hover:bg-zinc-800 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm">
                <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100">
                      <Phone className="h-6 w-6 text-zinc-700" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-zinc-900">Phone</h3>
                      <p className="text-zinc-600 font-medium tracking-wide">+92 344 1995788</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100">
                      <MapPin className="h-6 w-6 text-zinc-700" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-zinc-900">Location</h3>
                      <p className="text-zinc-600">Remote-first team</p>
                      <p className="text-zinc-600">Serving entrepreneurs worldwide</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100">
                      <Clock className="h-6 w-6 text-zinc-700" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-zinc-900">Response Time</h3>
                      <p className="text-zinc-600">We typically respond within 24-48 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-zinc-900">
                  What to Expect
                </h2>

                <ul className="space-y-3 text-zinc-600">
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-zinc-400" />
                    Personal response from our team
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-zinc-400" />
                    Thoughtful answers to your questions
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-zinc-400" />
                    Help with tool recommendations
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-zinc-400" />
                    Feedback on your suggestions
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50 p-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-zinc-600" />
                  <p className="text-sm font-medium text-zinc-700">
                    Your message is sent securely through our Resend integration.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
