/* eslint-disable @next/next/no-img-element */
import { motion } from 'motion/react';
import Link from 'next/link';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <img
            src="/images/arcade-logo-white.png"
            alt="Arcade Logo"
            width={241}
            height={48}
            className="w-auto h-12 invert dark:invert-0"
          />
        </p>
        <p>
          Archer is an AI assistant that can connect to services like Google,
          Spotify, and more using Arcade.
        </p>
        <p>
          You can learn more about Arcade by visiting our{' '}
          <Link
            className="font-medium underline underline-offset-4 text-primary"
            href="https://docs.arcade.dev"
            target="_blank"
          >
            docs
          </Link>
          .
        </p>
      </div>
    </motion.div>
  );
};
