import { useState } from "react";
import {
  Badge,
  Banner,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ConfirmDialog,
  FormField,
  Inline,
  Input,
  PinInput,
  RangeSlider,
  Select,
  Stack,
  Stepper,
  Text,
} from "../../src";
import { Frame, TopBar } from "./_shared";

const steps = [
  { label: "Address", description: "Where to ship" },
  { label: "Payment", description: "Verify card" },
  { label: "Review", description: "Confirm order" },
];

const SUBTOTAL = 84;

export function CheckoutDemo() {
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("us");
  const [otp, setOtp] = useState("");
  const [tip, setTip] = useState<[number, number]>([0, 15]);
  const [touched, setTouched] = useState(false);

  const nameError =
    touched && name.trim() === "" ? "Name is required." : undefined;
  const addressError =
    touched && address.trim() === "" ? "Address is required." : undefined;
  const addressValid = name.trim() !== "" && address.trim() !== "";
  const otpValid = otp.length === 4;

  const tipAmount = Math.round((SUBTOTAL * tip[1]) / 100);
  const total = SUBTOTAL + tipAmount + 6;

  const next = () => {
    if (step === 0) {
      setTouched(true);
      if (!addressValid) return;
      setTouched(false);
    }
    if (step === 1 && !otpValid) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <Frame>
      <TopBar title="Checkout" />
      <div style={{ flex: 1, overflow: "auto", padding: "var(--space-5)" }}>
        <div
          style={{
            display: "grid",
            gap: "var(--space-5)",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
            alignItems: "start",
          }}
        >
          <Stack gap={5}>
            <Stepper
              steps={steps}
              activeStep={placed ? steps.length : step}
              aria-label="Checkout steps"
            />

            <Banner
              tone="info"
              title="Promo applied"
              action={<Badge>SAVE10</Badge>}
            >
              Free shipping on orders over $50.
            </Banner>

            {placed ? (
              <Card>
                <CardBody>
                  <Stack gap={2}>
                    <Text as="h3" size="lg" weight="bold" style={{ margin: 0 }}>
                      Order placed
                    </Text>
                    <Text>
                      Thanks, {name || "friend"}! A receipt is on its way.
                    </Text>
                    <Inline>
                      <Button
                        variant="inverse"
                        onClick={() => {
                          setPlaced(false);
                          setStep(0);
                        }}
                      >
                        Start over
                      </Button>
                    </Inline>
                  </Stack>
                </CardBody>
              </Card>
            ) : (
              <Card>
                <CardBody>
                  {step === 0 && (
                    <Stack gap={4} style={{ maxWidth: 440 }}>
                      <FormField label="Full name" error={nameError} required>
                        {(props) => (
                          <Input
                            {...props}
                            invalid={Boolean(nameError)}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        )}
                      </FormField>
                      <FormField
                        label="Street address"
                        error={addressError}
                        required
                      >
                        {(props) => (
                          <Input
                            {...props}
                            invalid={Boolean(addressError)}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        )}
                      </FormField>
                      <FormField label="Country">
                        {(props) => (
                          <Select
                            {...props}
                            value={country}
                            onValueChange={setCountry}
                            options={[
                              { value: "us", label: "United States" },
                              { value: "uk", label: "United Kingdom" },
                              { value: "de", label: "Germany" },
                              { value: "in", label: "India" },
                            ]}
                          />
                        )}
                      </FormField>
                    </Stack>
                  )}

                  {step === 1 && (
                    <Stack gap={4} style={{ maxWidth: 440 }}>
                      <FormField
                        label="Card verification code"
                        hint="Enter the 4-digit code we texted you."
                        error={
                          !otpValid && otp.length > 0
                            ? "Code must be 4 digits."
                            : undefined
                        }
                      >
                        {() => (
                          <PinInput
                            length={4}
                            value={otp}
                            onValueChange={setOtp}
                          />
                        )}
                      </FormField>
                      <FormField label={`Tip (${tip[1]}%)`}>
                        {() => (
                          <RangeSlider
                            value={tip}
                            onValueChange={setTip}
                            min={0}
                            max={30}
                            minLabel="No tip"
                            maxLabel="Tip percent"
                          />
                        )}
                      </FormField>
                    </Stack>
                  )}

                  {step === 2 && (
                    <Stack gap={3}>
                      <Text weight="bold">Ship to</Text>
                      <Text>
                        {name || "-"}, {address || "-"}
                      </Text>
                      <Text weight="bold">Payment</Text>
                      <Text>
                        Card verified {otpValid ? "\u2713" : "\u2717"}
                      </Text>
                    </Stack>
                  )}
                </CardBody>
                <CardFooter>
                  <Inline justify="between" style={{ inlineSize: "100%" }}>
                    <Button
                      variant="ghost"
                      disabled={step === 0}
                      onClick={back}
                    >
                      Back
                    </Button>
                    {step < steps.length - 1 ? (
                      <Button onClick={next}>Continue</Button>
                    ) : (
                      <Button onClick={() => setConfirming(true)}>
                        Place order
                      </Button>
                    )}
                  </Inline>
                </CardFooter>
              </Card>
            )}
          </Stack>

          <Card>
            <CardHeader>
              <Text weight="bold">Order summary</Text>
            </CardHeader>
            <CardBody>
              <Stack gap={2}>
                <Inline justify="between">
                  <Text>Subtotal</Text>
                  <Text>${SUBTOTAL}</Text>
                </Inline>
                <Inline justify="between">
                  <Text>Shipping</Text>
                  <Text>$6</Text>
                </Inline>
                <Inline justify="between">
                  <Text>Tip ({tip[1]}%)</Text>
                  <Text>${tipAmount}</Text>
                </Inline>
              </Stack>
            </CardBody>
            <CardFooter>
              <Inline justify="between" style={{ inlineSize: "100%" }}>
                <Text weight="bold">Total</Text>
                <Text weight="bold">${total}</Text>
              </Inline>
            </CardFooter>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirming}
        title="Place order?"
        description={`You will be charged $${total}.`}
        confirmLabel="Place order"
        onConfirm={() => {
          setPlaced(true);
          setConfirming(false);
        }}
        onCancel={() => setConfirming(false)}
      />
    </Frame>
  );
}
