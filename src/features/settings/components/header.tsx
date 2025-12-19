import React from "react";

const Header = () => {
  return (
    <div>
      {/* Header with fade animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-light tracking-tight text-[#111827] lg:text-2xl">
          Account
        </h1>
        <p className="mt-4 text-base text-[#6b7280] lg:text-lg">
          Manage your profile, billing, and integrations
        </p>
      </motion.div>
    </div>
  );
};

export default Header;
