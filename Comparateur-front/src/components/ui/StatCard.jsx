import { motion } from "framer-motion";

export default function StatCard({ title, value, icon: Icon, trend }) {
    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="
        p-5 rounded-2xl
        bg-white/70 dark:bg-slate-900/60
        border border-slate-200 dark:border-slate-800
        backdrop-blur-xl
        shadow-sm
        hover:shadow-md
        transition-all
      "
        >
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {title}
                </p>

                {Icon && (
                    <div
                        className="
              w-9 h-9
              flex items-center justify-center
              rounded-xl
              bg-violet-100 dark:bg-violet-500/10
              text-violet-600 dark:text-violet-300
            "
                    >
                        <Icon size={18} />
                    </div>
                )}
            </div>

            {/* VALUE */}
            <div className="mt-4 flex items-end justify-between">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {value}
                </h2>

                {/* optional trend */}
                {trend && (
                    <span
                        className={`
              text-xs font-medium px-2 py-1 rounded-lg
              ${trend.startsWith("+")
                                ? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                                : "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                            }
            `}
                    >
                        {trend}
                    </span>
                )}
            </div>
        </motion.div>
    );
}