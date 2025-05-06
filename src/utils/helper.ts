export const sidebarVariants = {
  open: {
    width: "70%",
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  closed: {
    width: 0,
    opacity: 0,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  openDesktop: {
    width: 220,
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  closedDesktop: {
    width: 70,
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export const textVariants = {
  open: {
    opacity: 1,
    x: 0,
    display: "block",
    transition: {
      duration: 0.2,
      delay: 0.1,
    },
  },
  closed: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.2,
    },
    transitionEnd: {
      display: "none",
    },
  },
};

export function escapeStringRegexp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
