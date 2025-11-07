import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-center  px-6 md:px-18 py-16 md:py-20 bg-white text-center md:text-left">
        {/* Left side: Text */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center lg:pl-20">
          <h1 className="text-4xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-snug">
            Make their <span className="text-primary">Identity</span> & <br />{" "}
            Let world
            <span className="text-primary"> Connect</span> with them.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-md">
            Where every pet’s story lives online.
          </p>
          <p className=" text-base sm:text-lg text-blue-400 max-w-md">
            #ConnectingPetLovers
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Link
              to="/register"
              className="bg-primary text-white font-semibold px-6 py-3 rounded-full shadow hover:opacity-90 transition"
            >
              Register Your Pet
            </Link>
            {/* <Link
              to="/shop"
              className="border border-primary text-primary font-semibold px-6 py-3 rounded-full hover:bg-primary hover:text-white transition"
            >
              Shop Tags
            </Link> */}
          </div>
        </div>

        {/* Right side: Image */}
        <div className="w-full lg:w-1/2 flex justify-center md:justify-end">
          <img
            src="/img/hero.png"
            alt="NFC Dog Tag"
            className=" md:w-full h-auto object-contain rounded-3xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Why Pet Owners Love Us
        </h2>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
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
              className="p-8 rounded-2xl border border-gray-200 shadow-sm text-center hover:shadow-md transition bg-white"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-gray-600 text-base">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-20 px-6 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Share Your Pet’s Story in a Tap
        </h2>
        <p className="text-base sm:text-lg mb-8 text-gray-100 max-w-2xl mx-auto">
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
        <div className="max-w-6xl mx-auto grid gap-10 sm:grid-cols-2 md:grid-cols-3">
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
