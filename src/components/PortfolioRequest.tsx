"use client";

import { mailchimp } from "@/app/resources";
import { Button, Flex, Heading, Input, Text, Background, Column } from "@/once-ui/components";
import { opacity, SpacingToken } from "@/once-ui/types";
import { useState } from "react";
import emailjs from "@emailjs/browser";

function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  }) as T;
}

type PortfolioRequestProps = {
  display: boolean;
  title: string | JSX.Element;
  description: string | JSX.Element;
};

export const PortfolioRequest = ({ portfolioRequest }: { portfolioRequest: PortfolioRequestProps }) => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [touched, setTouched] = useState<{ email: boolean; name: boolean }>({ email: false, name: false });

  const validateEmail = (email: string): boolean => {
    if (email === "") {
      return true;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!validateEmail(value)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    if (touched.name && !validateName(value)) {
      setNameError("Please enter your name.");
    } else {
      setNameError("");
    }
  };

  const debouncedHandleEmailChange = debounce(handleEmailChange, 2000);

  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
    }
  };

  const handleNameBlur = () => {
    setTouched(prev => ({ ...prev, name: true }));
    if (!validateName(name)) {
      setNameError("Please enter your name.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    if (!validateEmail(email) || !validateName(name)) {
      setTouched({ email: true, name: true });
      if (!validateEmail(email)) setError("Please enter a valid email address.");
      if (!validateName(name)) setNameError("Please enter your name.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Initialize EmailJS (you'll need to replace these with your actual IDs)
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY");

      // Send email using EmailJS
      const templateParams = {
        from_name: name,
        from_email: email,
        message: message || "No additional message",
        to_email: "samuelgarijocortes@gmail.com",
      };

      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID",
        templateParams
      );

      if (result.status === 200) {
        setIsSuccess(true);
        setEmail("");
        setName("");
        setMessage("");
        // Reset success message after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("EmailJS error:", err);
      setError("Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Column
      overflow="hidden"
      fillWidth
      padding="xl"
      radius="l"
      marginBottom="m"
      horizontal="center"
      align="center"
      background="surface"
      border="neutral-alpha-weak"
    >
      <Background
            position="absolute"
            mask={{
              x: mailchimp.effects.mask.x,
              y: mailchimp.effects.mask.y,
              radius: mailchimp.effects.mask.radius,
              cursor: mailchimp.effects.mask.cursor
            }}
            gradient={{
              display: mailchimp.effects.gradient.display,
              opacity: mailchimp.effects.gradient.opacity as opacity,
              x: mailchimp.effects.gradient.x,
              y: mailchimp.effects.gradient.y,
              width: mailchimp.effects.gradient.width,
              height: mailchimp.effects.gradient.height,
              tilt: mailchimp.effects.gradient.tilt,
              colorStart: mailchimp.effects.gradient.colorStart,
              colorEnd: mailchimp.effects.gradient.colorEnd,
            }}
            dots={{
              display: mailchimp.effects.dots.display,
              opacity: mailchimp.effects.dots.opacity as opacity,
              size: mailchimp.effects.dots.size as SpacingToken,
              color: mailchimp.effects.dots.color,
            }}
            grid={{
              display: mailchimp.effects.grid.display,
              opacity: mailchimp.effects.grid.opacity as opacity,
              color: mailchimp.effects.grid.color,
              width: mailchimp.effects.grid.width,
              height: mailchimp.effects.grid.height,
            }}
            lines={{
              display: mailchimp.effects.lines.display,
              opacity: mailchimp.effects.lines.opacity as opacity,
              size: mailchimp.effects.lines.size as SpacingToken,
              thickness: mailchimp.effects.lines.thickness,
              angle: mailchimp.effects.lines.angle,
              color: mailchimp.effects.lines.color,
            }}
          />
      <Heading style={{ position: "relative" }} marginBottom="s" variant="display-strong-xs">
        {portfolioRequest.title}
      </Heading>
      <Text
        style={{
          position: "relative",
          maxWidth: "var(--responsive-width-xs)",
        }}
        wrap="balance"
        marginBottom="l"
        onBackground="neutral-medium"
      >
        {portfolioRequest.description}
      </Text>
      <form
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
        onSubmit={handleSubmit}
      >
        <Flex fillWidth maxWidth={24} direction="column" gap="16">
          <Input
            formNoValidate
            labelAsPlaceholder
            id="name"
            name="name"
            type="text"
            label="Name"
            value={name}
            required
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            errorMessage={nameError}
          />
          <Input
            formNoValidate
            labelAsPlaceholder
            id="email"
            name="email"
            type="email"
            label="Email"
            value={email}
            required
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            errorMessage={error}
          />
          <Input
            formNoValidate
            labelAsPlaceholder
            id="message"
            name="message"
            type="text"
            label="Message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {isSuccess && (
            <Text style={{ position: "relative" }} variant="body-default-s" onBackground="success-medium">
              Thank you! I&apos;ll send you my portfolio soon.
            </Text>
          )}
          <Flex height="48" vertical="center">
            <Button type="submit" size="m" fillWidth disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Request Portfolio"}
            </Button>
          </Flex>
        </Flex>
      </form>
    </Column>
  );
};