import { Stepper } from 'react-form-stepper';

type StepperProps = React.ComponentProps<typeof Stepper>;

// CustomStepper.tsx
const CustomStepper = (props: StepperProps) => {
  return <Stepper {...props} />;
};

export default CustomStepper;
