import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Users, Globe, Eye, Heart } from "lucide-react";
import { useRef, useState } from "react";

const features = [
    {
        icon: Users,
        title: "Skill-Based Matchmaking",
        description: "Play against opponents of similar skill level for balanced and exciting games."
    },
    {
        icon: Globe,
        title: "Global Community",
        description: "Connect and compete with chess enthusiasts from all around the world."
    },
    {
        icon: Eye,
        title: "Move Analysis",
        description: "Review and analyze every move to improve your chess strategy and skills."
    },
    {
        icon: Heart,
        title: "Play with Loved Ones",
        description: "Challenge friends and family members anytime, anywhere in private matches."
    }
];

const FeaturesSection = () => {
    const containerRef = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        container: containerRef,
        offset: ["start start", "end start"]
    });
    const [activeFeature, setActiveFeature] = useState(0);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const featureBreakpoints = features.map((_, i) => i / features.length);
        const closestIndex = featureBreakpoints.reduce((acc, bp, i) => {
            const dist = Math.abs(latest - bp);
            return dist < Math.abs(latest - featureBreakpoints[acc]) ? i : acc;
        }, 0);
        setActiveFeature(closestIndex);
    });


    return (
        <section className="bg-secondary/30">
            {/* Header - Completely separate and always visible */}
            <div className="relative z-10 text-center py-20 px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold text-primary mb-4"
                >
                    Master Your Game
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg text-muted-foreground"
                >
                    Experience chess like never before with our advanced features.
                </motion.p>
            </div>

            {/* Features Container */}
            <div ref={containerRef} className="relative flex h-[20rem] justify-center space-x-10 overflow-y-auto rounded-md p-10">
                {/* Desktop Layout */}
                <div className="div relative flex items-start">
                    {/* Left Side - Scrollable Content */}
                    <div className="space-y-45">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                className="pr-8"
                            >
                                <feature.icon className="w-12 h-12 text-primary mb-6" />
                                <motion.h3 className="text-2xl font-semibold mb-4 text-foreground"
                                    initial={{
                                        opacity: 0,
                                    }}

                                    animate={{
                                        opacity: activeFeature === index ? 1 : 0.3,
                                    }}
                                >
                                    {feature.title}
                                </motion.h3>
                                <motion.p className="text-muted-foreground text-lg leading-relaxed"
                                    initial={{
                                        opacity: 0,
                                    }}
                                    animate={{
                                        opacity: activeFeature === index ? 1 : 0.3,
                                    }}
                                >
                                    {feature.description}
                                </motion.p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Fixed Image Container */}
                <div className="sticky top-1 ml-20 hidden h-60 w-80 overflow-hidden rounded-md bg-white lg:block">
                    {/* All feature icons positioned absolutely */}
                    {features.map((feature, index) => (
                        <motion.div
                            key={`icon-${index}`}
                            className="absolute inset-8 flex items-center justify-center transition-transform"
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: activeFeature === index ? 1 : 0,
                            }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="w-full aspect-square rounded-xl flex items-center justify-center">
                                <feature.icon className="w-16 h-16 text-primary" />
                            </div>
                        </motion.div>
                    ))}
                    {/* <div className="w-full aspect-square max-w-xs mx-auto opacity-0"></div> */}
                    {/* Invisible spacer for sizing - smaller container */}
                </div>


                {/* Mobile Layout - Stacked */}
            </div>

            {/* Extra bottom padding for desktop to ensure last feature is fully visible */}
            <div className="hidden lg:block h-32"></div>
        </section>
    );
};

export default FeaturesSection;