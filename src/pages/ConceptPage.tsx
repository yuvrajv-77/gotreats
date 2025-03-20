
import React from "react";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const Concept = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 text-gray-800">
      <div className="max-w-6xl w-full text-center">
        <h1 className="text-5xl font-bold mb-6 text-green-600 animate-pulse">Our Concept</h1>
        <p className="text-lg mb-6 text-orange-500 transition duration-300 hover:text-orange-700">
          At GoTreats, we believe in delivering fresh, homemade meals that are
          healthy, delicious, and convenient. Our concept revolves around
          providing nutritious food with a homely touch, ensuring every meal is
          a delightful experience.
        </p>
        <div className="grid md:grid-cols-2 gap-10 mt-8">
          <div className="bg-green-100 p-6 rounded-xl shadow-lg border-l-4 border-green-600 transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-green-700">Fresh & Hygienic Food</h2>
            <p className="text-gray-700">
              We use high-quality ingredients to prepare meals in a clean and
              hygienic environment, ensuring freshness in every bite.
            </p>
          </div>
          <div className="bg-orange-100 p-6 rounded-xl shadow-lg border-l-4 border-orange-600 transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-orange-700">Affordable & Convenient</h2>
            <p className="text-gray-700">
              Our meal plans are designed to be budget-friendly while offering
              maximum convenience for students, professionals, and families.
            </p>
          </div>
          <div className="bg-green-100 p-6 rounded-xl shadow-lg border-l-4 border-green-600 transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-green-700">Balanced Nutrition</h2>
            <p className="text-gray-700">
              We ensure that our meals provide the right balance of proteins,
              carbs, and essential nutrients for a healthy lifestyle.
            </p>
          </div>
          <div className="bg-orange-100 p-6 rounded-xl shadow-lg border-l-4 border-orange-600 transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-orange-700">Eco-Friendly Packaging</h2>
            <p className="text-gray-700">
              We care for the environment, so our packaging is eco-friendly,
              biodegradable, and sustainable.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 text-green-600">Ordering Process</h2>
        <p className="text-lg mt-2 text-gray-700">
          Follow these simple steps to get your meal:
        </p>
        <div className="grid grid-cols-5 gap-4 mt-6">
          <div className="bg-green-600 text-white p-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
            <h3 className="text-2xl font-bold">1</h3>
            <p className="mt-2">Register / create an account</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
            <h3 className="text-2xl font-bold">2</h3>
            <p className="mt-2">Log in</p>
          </div>
          <div className="bg-orange-500 text-white p-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
            <h3 className="text-2xl font-bold">3</h3>
            <p className="mt-2">Select your meal</p>
          </div>
          <div className="bg-orange-600 text-white p-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
            <h3 className="text-2xl font-bold">4</h3>
            <p className="mt-2">Make payment</p>
          </div>
          <div className="bg-green-700 text-white p-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
            <h3 className="text-2xl font-bold">5</h3>
            <p className="mt-2">Meal delivered to your doorstep</p>
          </div>
        </div>

        <p className="text-lg mt-8 font-semibold text-green-600 transition duration-300 hover:text-green-800">
          GoTreats is not just a meal service; it's a lifestyle choice for those
          who love good food and healthy living.
        </p>
        <div className="flex justify-center mt-8 animate-bounce">
          <Link to={'/shop'}>
            <Button >
              Start Ordering
            </Button></Link>
        </div>
      </div>
    </div>
  );
};

export default Concept;