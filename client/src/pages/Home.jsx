import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen  text-gray-800 ">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-3 justify-between px-6 md:px-20 py-24 ">
        <img
          src="/img/dog2.jpg"
          alt="NFC Dog Tag"
          className="w-full md:w-1/2 mt-12 md:mt-0 rounded-3xl shadow-2xl "
        />
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6  animate-fade-in">
            Smart NFC Tags For Your Pet
          </h1>
          <p className="text-xl mb-8  leading-relaxed">
            Reunite faster with your furry friend using our NFC-enabled pet
            tags. Just a tap and your pet's profile is shared instantly.
          </p>
          <Link
            to="/register"
            className="inline-block bg-primary text-white  font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Register Your Pet →
          </Link>
        </div>
      </section>
      <section className="py-24 px-6 md:px-20 bg-white">
        <h2 className="text-4xl font-bold text-center mb-16 ">
          Why Choose Us?
        </h2>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              icon: "/img/peticon.jpg",
              title: "Instant Pet Info",
              description:
                "Anyone with a phone can tap the tag to view your pet's profile instantly.",
            },
            {
              icon: "/img/vet.jpeg",
              title: "Find Nearby Vets",
              description:
                "Quickly locate nearby veterinary clinics in case of emergencies.",
            },
            {
              icon: "/img/secure.jpg",
              title: "Secure & Private",
              description:
                "Only share the info you choose. Your data stays protected and accessible only when needed.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="relative p-8 rounded-2xl shadow-md border border-gray-100 bg-cover bg-center text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ backgroundImage: `url(${feature.icon})` }}
            >
              <div className="absolute inset-0 bg-black/50 rounded-2xl"></div>{" "}
              {/* dark overlay for contrast */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className=" text-white py-20 text-center bg-gray-800">
        <h2 className="text-4xl font-bold mb-6">Connect Your Pet Today</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Get started with our smart NFC tags and peace of mind.
        </p>
        <br />
        <br />
        <Link
          to="/shop"
          className=" text-white bg-primary font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          Shop NFC Tags →
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-6 md:px-20">
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div>
            <h4 className="text-2xl font-bold mb-6">PetCare</h4>
            <p className="text-gray-400 leading-relaxed">
              Smart solutions for pet safety and care.
            </p>
          </div>
          <div>
            <h4 className="text-2xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {["About Us", "Contact", "FAQ"].map((item, index) => (
                <li key={index}>
                  <Link
                    to={`/${item.toLowerCase().replace(" ", "")}`}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-2xl font-bold mb-6">Contact Us</h4>
            <p className="text-gray-400">support@petcare.com</p>
            <p className="text-gray-400">1-800-PET-CARE</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} PetCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
