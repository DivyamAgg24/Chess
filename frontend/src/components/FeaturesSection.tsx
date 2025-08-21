import { motion, useScroll, useTransform } from "framer-motion";
import { Users, Globe, Eye, Heart } from "lucide-react";
import { useRef } from "react";

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
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        container: containerRef,
        offset: ["start start", "end start"], // maps scroll from top → bottom of section
    });

    const contentLength = features.length;

    return (
        <section ref={containerRef} className="relative h-screen overflow-y-scroll bg-secondary/30">
            {/* Sticky container */}
            <div className="top-0 h-full flex items-center justify-center">
                <div className="max-w-5xl w-full px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                            Master Your Game
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Experience chess like never before with our advanced features.
                        </p>
                    </div>

                    <div className="relative h-96">
                        {features.map((feature, index) => {
                            // define segment for each feature
                            const start = index / contentLength;
                            const end = (index + 1) / contentLength;

                            const opacity = useTransform(scrollYProgress, [start, (start + end) / 2, end], [0.3, 1, 0.3]);
                            const y = useTransform(scrollYProgress, [start, (start + end) / 2, end], [50, 0, -50]);

                            return (
                                <motion.div
                                    key={feature.title}
                                    className="inset-0 flex flex-col lg:flex-row items-center gap-10"
                                    style={{ opacity, y }}
                                >
                                    <div className="flex-1 text-center lg:text-left">
                                        <feature.icon className="w-12 h-12 text-primary mb-6 mx-auto lg:mx-0" />
                                        <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                                        <p className="text-muted-foreground text-lg">{feature.description}</p>
                                    </div>
                                    <div className="sticky flex-1 bg-card p-8 rounded-2xl shadow-lg border">
                                        <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                                            <feature.icon className="w-20 h-20 text-primary" />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
