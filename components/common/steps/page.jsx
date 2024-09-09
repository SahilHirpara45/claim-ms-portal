"use client";
import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepDescription,
} from "@/components/ui/steps";

const ClickableStep = ({ activeStep, steps, stepDescriptions }) => {
  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <Stepper alternativeLabel current={activeStep}>
          {steps?.map((label, index) => (
            <Step key={label}>
              <StepLabel >
                {label}
              </StepLabel>
              <StepDescription>{stepDescriptions[index]}</StepDescription>
            </Step>
          ))}
        </Stepper>
      </div>
    </div>
  );
};

export default ClickableStep;