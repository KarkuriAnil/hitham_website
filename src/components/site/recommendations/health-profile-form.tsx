"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DiseaseType } from "@/types";
import type { HealthProfileInput } from "@/lib/site/recommendations";

const DISEASE_TYPES: DiseaseType[] = [
  "Diabetes",
  "PCOS",
  "Weight Loss",
  "Weight Gain",
  "Gut Health",
  "Detox",
  "Cholesterol",
  "Healthy Lifestyle",
];

const ACTIVITY_LEVELS: HealthProfileInput["activityLevel"][] = [
  "Sedentary",
  "Light",
  "Moderate",
  "Active",
];

export function HealthProfileForm({
  defaultGoal,
  onSubmit,
}: {
  defaultGoal?: string;
  onSubmit: (input: HealthProfileInput) => void;
}) {
  const [age, setAge] = useState("30");
  const [gender, setGender] = useState("Female");
  const [weight, setWeight] = useState("65");
  const [height, setHeight] = useState("165");
  const [activityLevel, setActivityLevel] =
    useState<HealthProfileInput["activityLevel"]>("Moderate");
  const [diseaseType, setDiseaseType] = useState<DiseaseType>(
    (defaultGoal as DiseaseType) || "Healthy Lifestyle"
  );
  const [healthGoal, setHealthGoal] = useState("Feel more energetic day to day");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      age: Number(age),
      gender,
      weight: Number(weight),
      height: Number(height),
      activityLevel,
      diseaseType,
      healthGoal,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-xl border border-border-soft bg-white/60 p-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Age">
          <Input type="number" min={1} required value={age} onChange={(e) => setAge(e.target.value)} />
        </Field>
        <Field label="Gender">
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="h-10 rounded-md border border-border-soft bg-white px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </Field>
        <Field label="Weight (kg)">
          <Input type="number" min={1} required value={weight} onChange={(e) => setWeight(e.target.value)} />
        </Field>
        <Field label="Height (cm)">
          <Input type="number" min={1} required value={height} onChange={(e) => setHeight(e.target.value)} />
        </Field>
      </div>

      <Field label="Activity level">
        <div className="grid grid-cols-4 gap-2">
          {ACTIVITY_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setActivityLevel(level)}
              className={`rounded-md border px-2 py-2 text-xs transition-colors ${
                activityLevel === level
                  ? "border-sage bg-sage-dim text-ink"
                  : "border-border-soft text-ink-soft hover:border-sage/50"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Condition or focus area">
        <select
          value={diseaseType}
          onChange={(e) => setDiseaseType(e.target.value as DiseaseType)}
          className="h-10 rounded-md border border-border-soft bg-white px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
        >
          {DISEASE_TYPES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </Field>

      <Field label="What does success look like?">
        <Input value={healthGoal} onChange={(e) => setHealthGoal(e.target.value)} />
      </Field>

      <Button type="submit" size="lg">
        Get my recommendations
      </Button>
      <p className="text-center text-xs text-ink-soft">
        This is general nutrition guidance, not medical advice. Talk to a doctor for clinical concerns.
      </p>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
