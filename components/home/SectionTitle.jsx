"use client";
import React from "react";

const SectionTitle = ({ children, description }) => (
  <div className="flex flex-col items-center text-center gap-2 mb-6">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{children}</h2>
    {description && <p className="text-gray-500 max-w-prose">{description}</p>}
  </div>
);

export default SectionTitle;
