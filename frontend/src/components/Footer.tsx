import { motion } from "framer-motion";
import { Github, Twitter, Instagram, Mail, Crown } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-primary/5 border-t border-border py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="col-span-1 md:col-span-2"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Crown className="w-8 h-8 text-primary" />
                            <span className="text-2xl font-bold text-primary">ChessMaster</span>
                        </div>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            The ultimate chess platform for players of all skill levels. Master your game,
                            connect with players worldwide, and elevate your chess journey.
                        </p>
                        <div className="flex gap-4">
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                            >
                                <Github className="w-5 h-5" />
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                            >
                                <Twitter className="w-5 h-5" />
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                            >
                                <Instagram className="w-5 h-5" />
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                            >
                                <Mail className="w-5 h-5" />
                            </motion.a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h3 className="font-semibold text-card-foreground mb-4">Platform</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Play Online</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Tournaments</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Puzzles</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Analysis</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Lessons</a></li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h3 className="font-semibold text-card-foreground mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Help Center</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Contact Us</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Privacy Policy</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Terms of Service</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Community</a></li>
                        </ul>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="border-t border-border pt-8 text-center"
                >
                    <p className="text-muted-foreground">
                        © 2025 ChessMaster. All rights reserved. Made by Divyam for chess enthusiasts worldwide.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;