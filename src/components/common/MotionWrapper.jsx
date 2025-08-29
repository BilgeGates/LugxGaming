import { motion } from "framer-motion";

export default function MotionWrapper({
  children,
  delay = 0,
  direction = "up",
}) {
  const dirs = {
    up: { hidden: { opacity: 0, y: 150 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -150 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -200 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 200 }, visible: { opacity: 1, x: 0 } },
    zoom: {
      hidden: { opacity: 0, scale: 0.5 },
      visible: { opacity: 1, scale: 1 },
    },
  };

  return (
    <motion.div
      style={{ willChange: "transform" }}
      variants={dirs[direction]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 1,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
