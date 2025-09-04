
"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import StackingCards, {
    StackingCardItem,
} from "~/components/fancy/blocks/stacking-cards"

const cards = [
    {
        "bgColor": "bg-[#f97316]",
        "title": "Medicine Reminders",
        "description": "Never miss a dose — smart alerts ensure your family stays on track with their prescriptions.",
        "image": "https://plus.unsplash.com/premium_vector-1739262161806-d954eb02427c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXxxdGU5Smx2R3d0b3x8ZW58MHx8fHx8"
    },
    {
        "bgColor": "bg-[#0015ff]",
        "title": "Track Health Goals",
        "description": "Monitor exercise, diet, and sleep schedules for every member of your family in one place.",
        "image": "https://plus.unsplash.com/premium_vector-1739200616200-69a138d91627?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MnxxdGU5Smx2R3d0b3x8ZW58MHx8fHx8"
    },
    {
        "bgColor": "bg-[#ff5941]",
        "title": "Smart Alerts",
        "description": "Get instant notifications about missed medicines, irregular vitals, or unusual health patterns.",
        "image": "https://plus.unsplash.com/premium_vector-1738597190290-a3b571590b9e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8OHxxdGU5Smx2R3d0b3x8ZW58MHx8fHx8"
    },
    {
        "bgColor": "bg-[#1f464d]",
        "title": "Family Dashboard",
        "description": "A single view of all family health records — parents, kids, and grandparents included.",
        "image": "https://plus.unsplash.com/premium_vector-1738935247245-97940c74cced?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTZ8cXRlOUpsdkd3dG98fGVufDB8fHx8fA%3D%3D"
    },
    {
        "bgColor": "bg-[#0015ff]",
        "title": "AI Health Insights",
        "description": "Personalized recommendations and insights powered by AI to improve your family’s wellbeing.",
        "image": "https://plus.unsplash.com/premium_vector-1738935247692-1c2f2c924fd8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MjJ8cXRlOUpsdkd3dG98fGVufDB8fHx8fA%3D%3D"
    }
]




export default function StackingCardsDemo() {
    const [container, setContainer] = useState<HTMLElement | null>(null)

    return (
        <div
            className="h-screen bg-white overflow-auto text-white"
            ref={(node) => setContainer(node)}
        >
            {
                container ? <StackingCards
                    totalCards={cards.length}
                    scrollOptons={{ container: { current: container } }}
                >
                    <div className="relative font-calendas h-[620px] w-full z-10 text-2xl md:text-7xl font-bold uppercase flex justify-center items-center text-[#ff5941] whitespace-pre">
                        Scroll down ↓
                    </div>
                    {cards.map(({ bgColor, description, image, title }, index) => {
                        return (
                            <StackingCardItem key={index} index={index} className="h-[620px]">
                                <div
                                    className={cn(
                                        bgColor,
                                        "h-[80%] sm:h-[70%] flex-col sm:flex-row aspect-video px-8 py-10 flex w-11/12 rounded-3xl mx-auto relative"
                                    )}
                                >
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h3 className="font-bold text-2xl mb-5">{title}</h3>
                                        <p>{description}</p>
                                    </div>

                                    <div className="w-full sm:w-1/2 rounded-xl aspect-video relative overflow-hidden">
                                        <img
                                            src={image}
                                            alt={title}
                                            className="object-cover"
                                        // fill
                                        />
                                    </div>
                                </div>
                            </StackingCardItem>
                        )
                    })}

                    <div className="w-full h-80 relative overflow-hidden">
                        <h2 className="absolute bottom-0 left-0 translate-y-1/3 sm:text-[192px] text-[80px] text-[#ff5941] font-calendas">
                            FamCare
                        </h2>
                    </div>
                </StackingCards> :
                    <div>
                        Loading</div>
            }

        </div>
    )
}
