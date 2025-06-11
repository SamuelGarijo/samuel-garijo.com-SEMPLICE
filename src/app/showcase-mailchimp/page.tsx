import React from "react";
import { Column } from "@/once-ui/components";
import { Mailchimp } from "@/components";
import { newsletter } from "@/app/resources/content";

export default function ShowcaseMailchimp() {
  return (
    <Column maxWidth="m" gap="xl" horizontal="center" paddingY="xl">
      <Mailchimp newsletter={newsletter} />
    </Column>
  );
}