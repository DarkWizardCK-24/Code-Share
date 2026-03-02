"use client";
import { use } from "react";
import ViewPage from "@/components/ViewPage";

export default function SnippetRoute({ params }) {
  const { id } = use(params);
  return <ViewPage id={id} />;
}
