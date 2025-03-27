import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import {
  UtensilsCrossed,
  PiggyBank,
  Salad,
  Leaf,
  UserPlus,
  LogIn,
  ShoppingCart,
  CreditCard,
  Truck,
  ArrowRight,
  ArrowDown,
} from "lucide-react";

const Concept = () => {
  const steps = [
    { icon: <UserPlus size={28} />, title: "Register", desc: "Create an account" },
    { icon: <LogIn size={28} />, title: "Login", desc: "Log into your account" },
    { icon: <ShoppingCart size={28} />, title: "Select Meal", desc: "Choose your meal" },
    { icon: <CreditCard size={28} />, title: "Payment", desc: "Securely checkout" },
    { icon: <Truck size={28} />, title: "Delivery", desc: "Get it at your doorstep" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-lime-50 to-green-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700">Our Concept</h1>
        <p className="text-lg text-gray-700">
          At GoTreats, we deliver homemade meals that are fresh, healthy, and affordable – crafted with love and served with care.
        </p>

        <div className="grid md:grid-cols-2 gap-6 text-left">
        <ConceptCard
  title="Fresh & Hygienic"
  desc="Prepared with high-quality ingredients in a hygienic environment."
  icon={<UtensilsCrossed size={36} className="text-orange-500" />}
/>
<ConceptCard
  title="Affordable & Convenient"
  desc="Meals for students, families, and professionals – all on a budget."
  icon={<PiggyBank size={36} className="text-orange-500" />}
/>
<ConceptCard
  title="Balanced Nutrition"
  desc="Perfect balance of protein, carbs, and nutrients for your lifestyle."
  icon={<Salad size={36} className="text-orange-500" />}
/>
<ConceptCard
  title="Eco-Friendly Packaging"
  desc="Delivered in biodegradable and sustainable containers."
  icon={<Leaf size={36} className="text-orange-500" />}
/>

        </div>

        <h2 className="text-3xl font-bold mt-12 text-green-700">How It Works</h2>
        <p className="text-gray-700 mb-4">Just 5 steps to your meal!</p>

        {/* Steps with Responsive Arrows */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:flex-wrap">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <StepCard step={step} />
              {idx < steps.length - 1 && (
               <div className="text-orange-500">

                  <span className="hidden sm:inline">
                    <ArrowRight size={24} />
                  </span>
                  <span className="sm:hidden">
                    <ArrowDown size={24} />
                  </span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <p className="mt-10 text-lg text-green-800 font-medium">
          GoTreats is not just a meal service – it's a lifestyle.
        </p>

        <Link to="/shop" className="inline-block mt-6 group">
        <Button className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-green-600 relative overflow-hidden group transition-transform transform hover:scale-105 duration-500">
  <span className="relative z-10">Start Ordering →</span>
  <span className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out z-0"></span>
</Button>


        </Link>
      </div>
    </div>
  );
};

const ConceptCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:ring-2 hover:ring-green-400 group">
    <div className="flex items-center gap-4 mb-3">
      {icon}
      <h3 className="text-xl font-semibold text-green-700 group-hover:text-green-800">{title}</h3>
    </div>
    <p className="text-gray-700 group-hover:text-gray-900">{desc}</p>
  </div>
);

const StepCard = ({
  step,
}: {
  step: { icon: React.ReactNode; title: string; desc: string };
}) => (
  <div className="bg-white border-2 border-green-600 rounded-lg shadow-md p-4 w-40 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:brightness-110">
    <div className="text-orange-500 mb-2">{step.icon}</div>
    <h3 className="font-semibold">{step.title}</h3>
    <p className="text-sm text-gray-600">{step.desc}</p>
  </div>
);

export default Concept;
