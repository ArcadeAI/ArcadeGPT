/* eslint-disable @next/next/no-img-element */
import { motion } from 'framer-motion';
import Link from 'next/link';

import { MessageIcon, VercelIcon } from './icons';

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
            src="https://docs.arcade-ai.com/images/logo/arcadeai-title-dark.png"
            alt="Arcade Logo"
            width={32}
            height={64}
            className="w-auto h-16 invert dark:invert-0"
          />
        </p>

        <p>
          You can learn more about Arcade by visiting our{' '}
          <Link
            className="font-medium underline underline-offset-4 text-primary"
            href="https://docs.arcade-ai.com"
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
