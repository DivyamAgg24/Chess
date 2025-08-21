import { motion } from "framer-motion";
import { Button } from "../components/Button";
import { ArrowRight, Crown, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-primary/5 bg-[size:30px_30px]" />
            <div className="max-w-4xl mx-auto text-center relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        animate={{
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full text-primary font-medium mb-8"
                    >
                        <Crown className="w-5 h-5" />
                        Join the Chess Elite
                    </motion.div>

                    <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6">
                        Ready to Master Chess?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                        Start your journey to chess mastery today. Play against skilled opponents,
                        analyze your moves, and become the player you've always wanted to be.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                size="lg"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                onClick={() => navigate('/game')}
                            >
                                Play Online Now
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg rounded-xl transition-all duration-300"
                            >
                                <Zap className="mr-2 w-5 h-5" />
                                Quick Match
                            </Button>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="mt-12 text-sm text-muted-foreground"
                    >
                        Free to play • No downloads required • Instant access
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;