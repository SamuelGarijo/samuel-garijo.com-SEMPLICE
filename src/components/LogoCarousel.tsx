"use client";

import React from "react";
import { Flex, Heading, Column } from "@/once-ui/components";
import styles from "./LogoCarousel.module.scss";

const companies = [
  "Ralph Lauren",
  "Facebook",
  "DoorDash",
  "Pfizer",
  "Moderna",
  "LVGL",
  "Renesas",
  "Toradex",
];

const LogoCarousel = () => {
  return (
    <Column gap="m" fillWidth className={styles.carouselSection}>
      <Heading variant="heading-default-m" onBackground="neutral-medium">
        Trusted by
      </Heading>
      <div className={styles.carousel}>
        <div className={styles.track}>
          {/* First set of company names */}
          {companies.map((company, index) => (
            <div key={`first-${index}`} className={styles.logoItem}>
              <div className={styles.wordmark}>{company}</div>
            </div>
          ))}
          {/* Duplicate set for seamless looping */}
          {companies.map((company, index) => (
            <div key={`second-${index}`} className={styles.logoItem}>
              <div className={styles.wordmark}>{company}</div>
            </div>
          ))}
        </div>
      </div>
    </Column>
  );
};

export default LogoCarousel;
