import { motion } from "framer-motion";

export default function AuthLayout({
    title,
    subtitle,
    children
}) {
    return (
        <div className="
            relative
            min-h-screen
            overflow-hidden
            bg-gradient-to-br
            from-slate-50
            via-white
            to-violet-50
            flex
            items-center
            justify-center
            px-4
            py-10
        ">

            {/* Decorative blobs */}
            <div className="
                absolute
                top-[-100px]
                left-[-100px]
                w-96
                h-96
                bg-violet-300
                rounded-full
                blur-3xl
                opacity-20
            " />

            <div className="
                absolute
                bottom-[-100px]
                right-[-100px]
                w-96
                h-96
                bg-purple-300
                rounded-full
                blur-3xl
                opacity-20
            " />

            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >

                <div
                    className="
                    bg-white/80
                    backdrop-blur-md
                    rounded-3xl
                    border
                    border-white/50
                    p-8
                    shadow-[0_20px_50px_rgba(124,58,237,0.12)]
                "
                >

                    <div className="text-center mb-8">

                        <div className="
                            w-16
                            h-16
                            mx-auto
                            mb-4
                            rounded-2xl
                            bg-gradient-to-br
                            from-violet-500
                            to-purple-600
                            flex
                            items-center
                            justify-center
                            text-white
                            text-2xl
                            shadow-lg
                        ">
                            🔐
                        </div>

                        <h1 className="
                            text-3xl
                            font-bold
                            text-slate-800
                        ">
                            {title}
                        </h1>

                        {subtitle && (
                            <div className="
                                mt-2
                                text-sm
                                text-slate-500
                            ">
                                {subtitle}
                            </div>
                        )}
                    </div>

                    {children}

                </div>

            </motion.div>
        </div>
    );
}