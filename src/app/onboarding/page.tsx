"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
// Imported dynamically to avoid build issues if server actions aren't fully ready, but static import is fine usually.
import { saveOnboardingData } from "@/lib/actions";

const AGE_GROUPS = [
    "10대", "20대", "30대", "40대", "50대", "60대", "70대", "일반"
];

const GENDERS = [
    "여성", "남성", "선택안함"
];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [age, setAge] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = async () => {
        if (step === 1 && age) {
            setStep(2);
        } else if (step === 2 && gender) {
            setIsSubmitting(true);
            try {
                const userId = localStorage.getItem('human_text_id');
                if (!userId) {
                    console.error("User ID not found");
                    // In real app, might want to create one or redirect to login.
                    // For now, proceed but it might fail server side if ID is required
                    return;
                }

                // Call the server action
                await saveOnboardingData(userId, age as any, gender as any);

                router.push("/sentences");
            } catch (error) {
                console.error("Failed to update profile", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="app-container">
            <div className="mobile-view px-6 flex flex-col">
                <Header title="시작하기" />

                <div className="flex-1 flex flex-col items-center justify-center -mt-20">
                    <div className="w-full max-w-sm">
                        <h2 className="text-2xl font-sans text-white mb-8 text-center leading-relaxed">
                            {step === 1 ? (
                                <>
                                    당신의 연령대를<br />
                                    알려주세요.
                                </>
                            ) : (
                                <>
                                    성별을<br />
                                    선택해주세요.
                                </>
                            )}
                        </h2>

                        <div className="grid grid-cols-2 gap-3 mb-10">
                            {step === 1 ? (
                                AGE_GROUPS.map((a) => (
                                    <button
                                        key={a}
                                        onClick={() => setAge(a)}
                                        className={`p-4 rounded-xl border transition-all ${age === a
                                            ? "bg-white text-black border-white"
                                            : "bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600"
                                            }`}
                                    >
                                        {a}
                                    </button>
                                ))
                            ) : (
                                GENDERS.map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setGender(g)}
                                        className={`p-4 rounded-xl border transition-all col-span-2 ${gender === g
                                            ? "bg-white text-black border-white"
                                            : "bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600"
                                            }`}
                                    >
                                        {g}
                                    </button>
                                ))
                            )}
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={step === 1 ? !age : !gender || isSubmitting}
                            className={`w-full py-4 rounded-full font-bold text-lg transition-all ${(step === 1 ? age : gender)
                                ? "bg-white text-black"
                                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                }`}
                        >
                            {isSubmitting ? "저장 중..." : "다음"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
