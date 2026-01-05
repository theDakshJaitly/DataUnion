import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
    children,
    className,
    containerClassName,
    animate = true,
    colors,
}: {
    children?: React.ReactNode;
    className?: string;
    containerClassName?: string;
    animate?: boolean;
    colors?: string[];
}) => {
    const variants = {
        initial: {
            backgroundPosition: "0 50%",
        },
        animate: {
            backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
        },
    };

    const gradientColors = colors || [
        "#00ccb1",
        "#7b61ff",
        "#ffc414",
        "#1ca0fb",
        "#141316"
    ];

    const gradientStyle = `radial-gradient(circle farthest-side at 0 100%,${gradientColors[0]},transparent),radial-gradient(circle farthest-side at 100% 0,${gradientColors[1]},transparent),radial-gradient(circle farthest-side at 100% 100%,${gradientColors[2]},transparent),radial-gradient(circle farthest-side at 0 0,${gradientColors[3]},${gradientColors[4] || "#141316"})`;

    return (
        <div className={cn("relative p-[4px] group", containerClassName)}>
            <motion.div
                variants={animate ? variants : undefined}
                initial={animate ? "initial" : undefined}
                animate={animate ? "animate" : undefined}
                transition={
                    animate
                        ? {
                            duration: 5,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }
                        : undefined
                }
                style={{
                    backgroundImage: gradientStyle,
                    backgroundSize: animate ? "400% 400%" : undefined,
                }}
                className={cn(
                    "absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl  transition duration-500 will-change-transform",
                )}
            />
            <motion.div
                variants={animate ? variants : undefined}
                initial={animate ? "initial" : undefined}
                animate={animate ? "animate" : undefined}
                transition={
                    animate
                        ? {
                            duration: 5,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }
                        : undefined
                }
                style={{
                    backgroundImage: gradientStyle,
                    backgroundSize: animate ? "400% 400%" : undefined,
                }}
                className={cn(
                    "absolute inset-0 rounded-3xl z-[1] will-change-transform",
                )}
            />

            <div className={cn("relative z-10", className)}>{children}</div>
        </div>
    );
};
