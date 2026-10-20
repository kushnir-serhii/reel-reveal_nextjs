import { FC } from "react";
import { motion } from "motion/react";
import { loaderQuizVariants } from "./LoaderQuiz.variants";

export const LoaderQuiz: FC = () => {
  const {
    base,
    robot,
    robotHead,
    robotBody,
    projector,
    light,
    cards,
    card,
    text,
  } = loaderQuizVariants();

  // Placeholder movie cards
  const placeholders = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className={base()}>
      {/* AI Robot */}
      <div className={robot()}>
        <div className={robotHead()}>AI</div>
        <div className={robotBody()}></div>
      </div>

      {/* Projector light */}
      <div className={projector()}>
        <div className={light()}></div>

        {/* Movie card placeholders */}
        <div className={cards()}>
          {placeholders.map((_, i) => (
            <motion.div
              key={i}
              className={card()}
              initial={{ opacity: 0, y: -20, rotate: -5 }}
              animate={{
                opacity: [0, 1, 0.7, 1],
                y: [0, -10, 0, -5],
                rotate: [-5, 5, -3, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading text */}
      <motion.div
        className={text()}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        AI is picking your movies...
      </motion.div>
    </div>
  );
};
