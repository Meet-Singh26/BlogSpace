import { AnimatePresence, motion } from "framer-motion";

/**
 * A reusable animation wrapper component that uses Framer Motion to animate its children.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be animated.
 * @param {string} props.keyValue - A unique key for the animation.
 * @param {object} props.initial - The initial animation state.
 * @param {object} props.animate - The target animation state.
 * @param {object} props.transition - The transition configuration.
 * @param {string} props.className - Additional CSS classes for the wrapper.
 * @returns {JSX.Element} The animated component.
 */
const Animation = ({
  children,
  keyValue,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 1 },
  className,
}) => {
  return (
    // AnimatePresence is used to animate components when they are mounted and unmounted.
    <AnimatePresence>
      <motion.div
        key={keyValue} // A unique key to trigger the animation when it changes.
        initial={initial} // The initial state of the animation.
        animate={animate} // The final state of the animation.
        transition={transition} // The duration and easing of the animation.
        className={className} // Optional CSS classes.
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default Animation;
