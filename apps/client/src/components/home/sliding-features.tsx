
import { AnimatePresence, motion } from "motion/react";
import { useMemo, } from "react";
import { useLoop } from "~/hooks/use-loop";


export const SlidingFeatures = () => {
    const { key } = useLoop();

    const array = useMemo(
        () => [
            "Health Records",
            "Advanced Search",
            "AI Chat",
            "Calendar",
            "Add Members",
            "Track Diet",
            "Medicine Schedule",
            "Exercise Suggestions"
        ],
        [],
    );

    const currentItem = useMemo(() => {
        return array[key % array.length];
    }, [array, key]);

    return (
        <AnimatePresence mode="popLayout">
            <motion.h3
                key={key}
                initial={{ opacity: 0, y: " 100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "-100%" }}
                transition={{ duration: 0.3 }}
                className=" whitespace-nowrap text-center text-4xl"
            >
                {currentItem}
            </motion.h3>
        </AnimatePresence>
    );
};