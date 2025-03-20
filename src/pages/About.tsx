
import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

const About = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center p-6 text-gray-800">
            <div className="max-w-6xl w-full text-center">
                <h1 className="text-5xl font-bold mb-6 text-green-600 animate-pulse">Welcome to GoTreats</h1>
                <p className="text-lg mb-6 text-orange-500 transition duration-300 hover:text-orange-700">
                    At GoTreats, we are dedicated to serving fresh, homemade, and hygienic meals
                    delivered straight to your doorstep. Our mission is to provide wholesome and
                    delicious food with the warmth of home-cooked goodness.
                </p>
                <div className="grid md:grid-cols-2 gap-10 mt-8">
                    <div className="bg-green-100 p-6 rounded-xl shadow-lg border-l-4 border-green-600 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                        <h2 className="text-2xl font-semibold mb-4 text-green-700">Daily Tiffin Service</h2>
                        <p className="text-gray-700">
                            Enjoy nutritious, home-cooked meals with our daily tiffin service,
                            featuring a variety of vegetarian and non-vegetarian options.
                        </p>
                    </div>
                    <div className="bg-orange-100 p-6 rounded-xl shadow-lg border-l-4 border-orange-600 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                        <h2 className="text-2xl font-semibold mb-4 text-orange-700">Customized Meal Plans</h2>
                        <p className="text-gray-700">
                            Choose from our customized meal plans tailored to your dietary needs,
                            ensuring a balanced and satisfying meal every day.
                        </p>
                    </div>
                    <div className="bg-green-100 p-6 rounded-xl shadow-lg border-l-4 border-green-600 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                        <h2 className="text-2xl font-semibold mb-4 text-green-700">Instant Orders</h2>
                        <p className="text-gray-700">
                            Craving a quick bite? Order from our variety of fresh snacks,
                            including pasta, Maggi, chocolates, and more.
                        </p>
                    </div>
                    <div className="bg-orange-100 p-6 rounded-xl shadow-lg border-l-4 border-orange-600 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                        <h2 className="text-2xl font-semibold mb-4 text-orange-700">Catering Services</h2>
                        <p className="text-gray-700">
                            Hosting an event? Our catering services offer a range of delicious dishes
                            to make your gatherings special.
                        </p>
                    </div>
                </div>
                <p className="text-lg mt-8 font-semibold text-green-600 transition duration-300 hover:text-green-800">
                    Experience the taste of home-cooked food with GoTreats – because good food
                    makes every day better!
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

export default About;