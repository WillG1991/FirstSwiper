import React, { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { Button, Text, View } from "react-native";
import { ADD_USER, VALIDATE_USER_CREDENTIALS } from "../../utils/mutations";
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';

const Signup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Step One", "Step Two", "Step Three", "Review"];
  const [userSignedup, setUserSignedup] = useState(null);
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    description: "",
    ethnicity: "",
    position: "",
    gender: "",
    role: "",
    photoURL: "",
    kinks: [],
  });
  const [stepOneError, setStepOneError] = useState(null);
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [addUser] = useMutation(ADD_USER);
  const [validateUserCredentials] = useMutation(VALIDATE_USER_CREDENTIALS);
  const recaptchaRef = useRef();

  const handleStepOneChange = (updatedFormState) => {
    setFormState(updatedFormState);
  };

  const handleFormSubmit = async () => {
    try {
      console.log('submitted data: ', formState);
      const recaptchaToken = recaptchaRef.current.getValue();
      await addUser({
        variables: {
          ...formState,
          recaptchaToken: recaptchaToken,
        },
      });
      setUserSignedup(
        'Thank you for signing up! Please check your email (including spam or junk folder) to verify your account.'
      );
    } catch (e) {
      console.error(e);
      setStepOneError('An error occurred, try again.');
    }
  };

  const handleValidateCredentials = async () => {
    try {
      const { data } = await validateUserCredentials({
        variables: {
          username: formState.username,
          email: formState.email,
          password: formState.password,
        },
      });

      if (data.validateUserCredentials === "Credentials are valid") {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
      } else {
        setStepOneError(data.validateUserCredentials);
      }
    } catch (error) {
      console.error(error);
      setStepOneError("An error occurred while validating credentials.");
    }
  };

  const handleNext = () => {
    // Only validate credentials on the first step
    if (activeStep === 0) {
      handleValidateCredentials();
      return;
    }
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  return (
    <>
      {!userSignedup ? (
        <>
          <View>
            {activeStep === 0 && (
              <StepOne
                formState={formState}
                onStepOneChange={handleStepOneChange}
                stepOneError={stepOneError}
              />
            )}
            {activeStep === 1 && (
              <StepTwo
                formState={formState}
                onStepTwoChange={(updatedFormState) => {
                  setFormState({ ...formState, ...updatedFormState });
                }}
              />
            )}
            {activeStep === 2 && (
              <StepThree
                formState={formState}
                recaptchaRef={recaptchaRef}
                agree1={agree1}
                agree2={agree2}
                setAgree1={setAgree1}
                setAgree2={setAgree2}
              />
            )}
            {activeStep === 3 && (
              <View>
                <Text>Review</Text>
                <Text>Step {activeStep + 1}</Text>
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 8,
            }}
          >
            <Button
              title="Back"
              onPress={handleBack}
              disabled={activeStep === 0}
            />
            <Button
              title="Next"
              onPress={handleNext}
              disabled={
                (activeStep === 0 &&
                  (!formState.username ||
                    !formState.email ||
                    !formState.password)) ||
                (activeStep === 1 &&
                  (!formState.role ||
                    !formState.ethnicity ||
                    !formState.position ||
                    !formState.gender ||
                    !formState.age ||
                    !formState.photoURL))
              }
            />
          </View>
          {activeStep === steps.length - 1 && (
            <Button
              title="Sign Up"
              onPress={handleFormSubmit}
              disabled={
                (activeStep === 0 &&
                  (!formState.username ||
                    !formState.email ||
                    !formState.password)) ||
                (activeStep === 1 &&
                  (!formState.role ||
                    !formState.ethnicity ||
                    !formState.position ||
                    !formState.gender ||
                    !formState.age ||
                    !formState.photoURL))
              }
            />
          )}
        </>
      ) : (
        <Text align="center">{userSignedup}</Text>
      )}
    </>
  );
};

export default Signup;
