"use client"

import { Category, Companion } from "@prisma/client";

interface CompanionFormProps{
    initialData: Companion | null;
    categories: Category[];
}
const CompanionForm = ({
    categories,
    initialData
}: CompanionFormProps) => {
  return (
    <div>Companion Form</div>
  )
}

export default CompanionForm