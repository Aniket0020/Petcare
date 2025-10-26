import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is a Pet Care QR Tag?",
    answer:
      "A Pet Care QR Tag is a smart collar tag with a unique QR code. When scanned, it opens your pet’s digital profile with important details.",
  },
  {
    question: "What information can I store on my pet’s profile?",
    answer:
      "You can add your pet’s name, photo, breed, age, your contact details, medical info (vaccinations, allergies, medications), vet details, and emergency notes.",
  },
  {
    question: "Do I need an app to use it?",
    answer:
      "No. The QR code works with any smartphone camera or QR scanner app. The pet’s profile opens directly in a browser.",
  },
  {
    question: "How do I activate my pet’s QR Tag?",
    answer:
      "Simply scan the QR code, enter the activation code provided, fill out your pet’s details, and save — your profile is live!",
  },
  {
    question: "What happens if someone finds my lost pet?",
    answer:
      "When they scan the QR tag, they can instantly see your pet’s profile and your contact information to reach you quickly.",
  },

  {
    question: "Can I update my pet’s profile later?",
    answer:
      "Yes. You can log in anytime to update details like new vaccinations, emergency instructions, or your contact info.",
  },
  {
    question: "Does the QR tag need batteries?",
    answer: "No. QR codes will work without charging or maintenance.",
  },
  {
    question: "What if the QR tag gets damaged or lost?",
    answer:
      "You can request a replacement tag. Your pet’s profile stays saved and can be linked to the new QR code.",
  },
  {
    question: "Can I manage profiles for multiple pets?",
    answer:
      "Yes. Each pet gets its own QR tag and profile, but you can manage all of them from your account.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50  ">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">
          🐾 Frequently Asked Questions
        </h2>
        <div className="space-y-4 ">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl shadow-sm bg-white"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full p-4 text-left"
              >
                <span className="font-medium text-gray-800">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 text-gray-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
