import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-20 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-lg text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Keep Your Pet <span className="text-primary">Safe</span> & Connected
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            With our NFC-enabled pet tags, your furry friend is always just a
            tap away from being found.
          </p>
          <div className="mt-8 flex flex-col md:flex-row gap-4 md:gap-6">
            <Link
              to="/register"
              className="bg-primary text-white font-semibold px-6 py-3 rounded-full shadow hover:opacity-90 transition"
            >
              Register Your Pet
            </Link>
            <Link
              to="/shop"
              className="border border-primary text-primary font-semibold px-6 py-3 rounded-full hover:bg-primary hover:text-white transition"
            >
              Shop Tags
            </Link>
          </div>
        </div>

        <img
          src="/img/dog2.jpg"
          alt="NFC Dog Tag"
          className="w-full md:w-1/2 rounded-3xl shadow-xl mb-8 md:mb-0"
        />
      </section>

      {/* Features */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Why Pet Owners Love Us
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: "📱",
              title: "Instant Info",
              desc: "Anyone with a phone can tap and view your pet's profile instantly.",
            },
            {
              icon: "🩺",
              title: "Nearby Vets",
              desc: "Locate veterinary clinics quickly in case of emergencies.",
            },
            {
              icon: "🔒",
              title: "Privacy First",
              desc: "You control the information you share. Your data stays protected.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border border-gray-200 shadow-sm text-center hover:shadow-md transition"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-20 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Share Your Pet’s Story in a Tap
        </h2>
        <p className="text-lg mb-8 text-gray-100">
          Give your pet a digital identity — instantly share their details &
          medical info.
        </p>
        <Link
          to="/shop"
          className="bg-white text-primary font-semibold px-8 py-3 rounded-full shadow hover:bg-gray-100 transition"
        >
          Get Started →
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6 md:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <h4 className="text-xl font-bold text-white mb-4">PetCare</h4>
            <p>Smart solutions for pet safety and care.</p>
          </div>
          <div>
            <h4 className="text-xl font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {["About Us", "Contact", "FAQ"].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={`/${item.toLowerCase().replace(" ", "")}`}
                    className="hover:text-white transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold text-white mb-4">Contact</h4>
            <p>support@petcare.com</p>
            <p>1-800-PET-CARE</p>
          </div>
        </div>
        <div className="text-center border-t border-gray-700 mt-10 pt-6 text-sm">
          &copy; {new Date().getFullYear()} PetCare. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
