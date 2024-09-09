"use client";
import React from "react";
import { SiteLogo } from "@/components/svg";
import { Loader2 } from "lucide-react";
const LayoutLoader = () => {
  return (
    <div className="h-screen flex items-center justify-center flex-col space-y-2 z-[9999] ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className="h-48 w-48"
      >
        <rect
          fill="#37BCB5"
          stroke="#37BCB5"
          strokeWidth="15"
          width="40"
          height="40"
          x="25"
          y="50"
        >
          <animate
            attributeName="y"
            calcMode="spline"
            dur="2s"
            values="50;120;50"
            keySplines=".5 0 .5 1; .5 0 .5 1"
            repeatCount="indefinite"
            begin="-0.4s"
          ></animate>
        </rect>
        <rect
          fill="#37BCB5"
          stroke="#37BCB5"
          strokeWidth="15"
          width="40"
          height="40"
          x="85"
          y="50"
        >
          <animate
            attributeName="y"
            calcMode="spline"
            dur="2s"
            values="50;120;50"
            keySplines=".5 0 .5 1; .5 0 .5 1"
            repeatCount="indefinite"
            begin="-0.2s"
          ></animate>
        </rect>
        <rect
          fill="#37BCB5"
          stroke="#37BCB5"
          strokeWidth="15"
          width="40"
          height="40"
          x="145"
          y="50"
        >
          <animate
            attributeName="y"
            calcMode="spline"
            dur="2s"
            values="50;120;50"
            keySplines=".5 0 .5 1; .5 0 .5 1"
            repeatCount="indefinite"
            begin="0s"
          ></animate>
        </rect>
      </svg>
      <span className="inline-flex gap-1 justify-center text-center text-[2rem]">
        {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
        Loading...
      </span>
    </div>
  );
};

export default LayoutLoader;
