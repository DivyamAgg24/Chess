import { motion } from "framer-motion";
import { Button } from "./Button";
import chessBoard from "../assets/chess-board-hero.jpg";

const HeroSection = () => {

    return (
        <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-background text-foreground">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center lg:text-left"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3}}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-tight mb-8"
                    >
                        Master the
                        <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Art of Chess
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                    >
                        Challenge your mind, elevate your strategy, and connect with chess players worldwide in the ultimate online chess experience.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <Button
                            
                            className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-primary/90 px-12 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            Play Online
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Right Image */}
                <motion.div
                    initial={{ opacity: 0, y:20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative"
                >
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border">
                        <img
                            src={chessBoard}
                            alt="Professional chess board with elegant wooden pieces"
                            className="w-full h-auto object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
                    </div>

                    
                    
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
