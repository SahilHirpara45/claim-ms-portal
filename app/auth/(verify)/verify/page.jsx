"use client";
import { Fragment } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import background from "@/public/images/auth/line.png";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import VerfiyForm from "@/components/auth/verify-form";

const VerifyPage = () => {
  return (
    <Fragment>
      <div className="min-h-screen bg-card  flex items-center  overflow-hidden w-full">
        <div className="lg-inner-column flex w-full flex-wrap justify-center overflow-y-auto">
          <div
            className="basis-1/2 bg-primary w-full relative hidden xl:flex justify-center items-center bg-gradient-to-br
          from-primary-600 via-primary-400 to-primary-600"
          >
            <Image
              src={background}
              alt="image"
              className="absolute top-0 left-0 w-full h-full"
            />
            <div className="relative z-10 backdrop-blur bg-primary-foreground/40 py-[84px] pl-[50px] pr-[136px] rounded">
              <div>
                <div className="text-6xl leading-[72px] font-semibold mt-2.5">
                  {/* <span className="text-slate-700">
                    Unlock <br />
                    Your Project
                  </span>{" "} */}
                  <span className="text-default-600 dark:text-default-300 ">
                    ClaimMS
                  </span>
                  <br />
                  <span className="text-slate-700">Performance</span>
                </div>
                <div className="mt-8 text-default-900 dark:text-slate-200  text-2xl font-medium">
                  Claim Management System
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-screen basis-full md:basis-1/2 w-full px-4 flex justify-center items-center">
            <div className="lg:w-[480px]">
              <VerfiyForm />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default VerifyPage;
