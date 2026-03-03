"use client";
import { use } from "react";
import AuthGuard from "@/components/AuthGuard";
import EditPage from "@/components/EditPage";

export default function EditSnippetRoute({ params }) {
  const { id } = use(params);
  return (
    <AuthGuard>
      <EditPage id={id} />
    </AuthGuard>
  );
}
