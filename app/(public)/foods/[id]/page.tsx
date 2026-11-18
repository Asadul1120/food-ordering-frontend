
"use client";

import { useParams } from "next/navigation";

import ProductDetails from "@/components/foods/product-details";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return <ProductDetails key={id} id={id} />;
}
