import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IRegistrationData } from '../config';
import { router } from 'expo-router';

interface RegistrationContextProps {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  steps: string[];
  user: IRegistrationData | null;
}

interface RegistrationProviderProps {
  children: ReactNode; // This allows any valid React elements to be passed as children
}

const RegistrationContext = createContext<RegistrationContextProps | undefined>(
  undefined,
);

export const RegistrationProvider: React.FC<RegistrationProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<IRegistrationData | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const steps: string[] = [
    'Name',
    'UserName',
    'Mobile/Email',
    'OTP',
    'Password',
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <RegistrationContext.Provider
      value={{ user, steps, currentStep, nextStep, prevStep }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error(
      'useRegistration must be used within a RegistrationProvider',
    );
  }
  return context;
};
