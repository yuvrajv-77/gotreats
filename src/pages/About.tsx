import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarClock,
  UtensilsCrossed,
  CookingPot,
  Package,
} from "lucide-react";

const About = () => {
  const services = [
    {
      title: "Daily Tiffin Service",
      desc: "Nutritious, home-cooked meals delivered daily. Choose from veg or non-veg options and enjoy food just like home.",
      icon: <CalendarClock size={36} />,
      bg: "bg-green-50",
      border: "border-green-500",
    },
    {
      title: "Customized Meal Plans",
      desc: "Tailored meal plans to match your lifestyle and dietary needs. Stay healthy with balanced and delicious food daily.",
      icon: <UtensilsCrossed size={36} />,
      bg: "bg-orange-50",
      border: "border-orange-500",
    },
    {
      title: "Instant Orders",
      desc: "Quick bites made fresh – from classic Maggi to pasta and more. Perfect for when you need a tasty snack, fast!",
      icon: <CookingPot size={36} />,
      bg: "bg-green-50",
      border: "border-green-500",
    },
    {
      title: "Catering Services",
      desc: "Planning an event? Let us serve your guests with flavorful food that turns every occasion into a celebration.",
      icon: <Package size={36} />,
      bg: "bg-orange-50",
      border: "border-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-lime-50 to-green-100 p-6 sm:p-12">
      <div className="max-w-7xl mx-auto space-y-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700">
          Welcome to <span className="text-orange-500">GoTreats</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
          Your go-to place for fresh, healthy, and homemade meals delivered straight to your doorstep – made with love, served with care.
        </p>

        {/* Services Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-12 text-left">
          {services.map((service, idx) => (
            <div
              key={idx}
              className={`group ${service.bg} border-l-4 ${service.border} p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:ring-2 hover:ring-green-400`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-orange-500 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-green-700 group-hover:text-green-800">
                    {service.title}
                  </h2>
                  <p className="text-gray-700 mt-1 group-hover:text-gray-900">
                    {service.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <p className="text-lg mt-12 font-medium text-green-800">
          Experience the joy of hassle-free, healthy eating – with GoTreats, every meal feels like home.
        </p>

        <div className="mt-8">
          <Link to="/shop">
            <button className="relative inline-flex items-center justify-center px-7 py-3 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-green-500 to-green-600 overflow-hidden group transition duration-500 ease-in-out shadow-md hover:shadow-xl hover:scale-105">
              {/* Background animation */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out z-0" />
              <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">
                Start Ordering →
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
