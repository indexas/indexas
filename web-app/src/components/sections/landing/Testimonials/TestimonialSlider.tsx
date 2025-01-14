import Image from "next/image";
import React, { useState } from "react";

const testimonials = [
  {
    name: "Danny Zuckerman",
    title: "3Box Labs, Co-founder",
    image: "/images/testimonials/zuckerman.jpg",
    text: "Apps need to deliver better information and experiences faster. Index's semantic index does that. Index can make better discovery a primitive all apps rely on.",
    twitter: "https://x.com/dazuck",
  },
  {
    name: "Oak",
    title: "Autonolas, Co-founder",
    image: "/images/testimonials/oak.jpg",
    text: "Index is attempting to create a totally novel discovery and social experience. They aim to deploy autonomous agents in a way that can uniquely benefit from web3 technology and I'm really excited to see their progress.",
    twitter: "https://x.com/tannedoaksprout",
  },
  {
    name: "Simon Brown",
    title: "Consensys, Researcher & Advisor",
    image: "/images/testimonials/brown.jpg",
    text: "Index Network is going to change the way we think about discovering information and interacting with the web. The ability to use autonomous AI agents to index and interpret data from multiple sources through an intuitive natural language interface is a total game changer!",
    twitter: "https://x.com/orbmis",
  },
  {
    name: "David Sneider",
    title: "Lit Protocol, Co-founder",
    image: "/images/testimonials/sneider.jpg",
    text: "Index Network is a foundational base layer for the user owned web. We're so glad to be  collaborators on privacy at Lit Protocol!",
    twitter: "https://x.com/davidlsneider",
  },
  {
    name: "Billy Luedtke",
    title: "Intuition Systems, Founder",
    image: "/images/testimonials/billy.jpg",
    text: "The future is AI. And in this future, the efficacy of AI will only be as good as the data our agents are ingesting. Index plays a pivotal role in this future, enabling our AI counterparts to return increasingly relevant, contextual, and accurate results and information.",
    twitter: "https://x.com/0xbilly",
  },
];

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <div className="mx-auto py-10 relative">
      <div className="overflow-hidden">
        <div
          className="flex gap-10 md:pr-12 no-scrollbar overflow-x-auto snap-x snap-mandatory scroll-smooth transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="snap-center w-[400px] relative flex-shrink-0 bg-gray-800 text-white p-8 rounded-lg shadow-lg"
            >
              <a href={testimonial.twitter} target="_blank" rel="noreferrer">
                <Image
                  src={"/images/ic_twitter.svg"}
                  width={16}
                  height={16}
                  alt="twitter"
                  className="absolute right-8 top-8"
                />
              </a>
              <div className="flex items-center mb-4">
                <Image
                  width={48}
                  height={48}
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-xl font-bold">{testimonial.name}</h3>
                  <p className="text-sm">{testimonial.title}</p>
                </div>
              </div>
              <p className="text-sm">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
      {/* <button
        onClick={goToPrevSlide}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
      >
        Prev
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
      >
        Next
      </button> */}
    </div>
  );
};

export default TestimonialSlider;
