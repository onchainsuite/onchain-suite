"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Cloud } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import { FooterLinks } from "./footer-links";
import { FooterSocial } from "./footer-social";

const footerLinks = {
  products: [
    { name: "R3tain", href: "#r3tain" },
    { name: "Onch3n", href: "#onch3n" },
    { name: "3ridge", href: "#3ridge" },
  ],
  resources: [
    { name: "Documentation", href: "#docs" },
    { name: "API Reference", href: "#api" },
    { name: "Brand Kit", href: "#brand" },
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Privacy Policy", href: "#privacy" },
  ],
  contact: [
    { name: "Email", href: "mailto:hello@onchain-suite.com" },
    { name: "Twitter", href: "#twitter" },
    { name: "Discord", href: "#discord" },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Footer() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <motion.footer
      ref={ref}
      className="relative border-t border-border bg-muted/30"
      style={{ y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-12 md:py-16">
        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand Section */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Cloud className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">
                Onchain Suite
              </span>
            </Link>
            <p className="mb-4 text-sm text-muted-foreground">
              The first integrated communication layer built natively for Web3
            </p>
            <FooterSocial />
          </motion.div>

          {/* Links Sections */}
          <motion.div variants={itemVariants}>
            <FooterLinks title="Products" links={footerLinks.products} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FooterLinks title="Resources" links={footerLinks.resources} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FooterLinks title="Company" links={footerLinks.company} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FooterLinks title="Contact" links={footerLinks.contact} />
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="mt-12 border-t border-border pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted-foreground">
            Copyright © {new Date().getFullYear()} Onchain Suite. All Rights
            Reserved
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
