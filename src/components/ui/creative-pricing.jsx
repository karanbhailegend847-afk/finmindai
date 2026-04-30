import { Button } from "@/components/ui/button";
import { Check, TrendingUp, Star, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

function CreativePricing({
    tag = "Market Dominance",
    title = "Predict the Future of Finance",
    description = "Elite intelligence for the modern investor",
    tiers,
}) {
    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-20 relative">
            <div className="text-center space-y-6 mb-16">
                <div className="font-handwritten text-xl text-primary rotate-[-1deg]">
                    {tag}
                </div>
                <div className="relative">
                    <h2 className="text-5xl md:text-7xl font-bold font-handwritten text-white rotate-[-1deg] tracking-tight">
                        {title}
                        <div className="absolute -right-12 top-0 text-amber-500 rotate-12">
                            ✨
                        </div>
                        <div className="absolute -left-8 bottom-0 text-blue-500 -rotate-12">
                            ⭐️
                        </div>
                    </h2>
                    <div
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-44 h-3 bg-primary/20 
                        rotate-[-1deg] rounded-full blur-sm"
                    />
                </div>
                <p className="font-handwritten text-2xl text-zinc-400 rotate-[-1deg]">
                    {description}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tiers.map((tier, index) => (
                    <div
                        key={tier.name}
                        className={cn(
                            "relative group",
                            "transition-all duration-300",
                            index === 0 && "rotate-[-1deg]",
                            index === 1 && "rotate-[1deg]",
                            index === 2 && "rotate-[-2deg]"
                        )}
                    >
                        <div
                            className={cn(
                                "absolute inset-0 bg-zinc-950",
                                "border-2 border-white/10 group-hover:border-primary/50",
                                "rounded-3xl shadow-[8px_8px_0px_0px] shadow-white/5",
                                "transition-all duration-300",
                                "group-hover:shadow-[12px_12px_0px_0px] group-hover:shadow-primary/20",
                                "group-hover:translate-x-[-4px]",
                                "group-hover:translate-y-[-4px]"
                            )}
                        />

                        <div className="relative p-8">
                            {tier.popular && (
                                <div
                                    className="absolute -top-3 -right-3 bg-primary text-white 
                                    font-handwritten px-4 py-2 rounded-full rotate-12 text-sm border-2 border-zinc-950 shadow-lg"
                                >
                                    Best Value!
                                </div>
                            )}

                            <div className="mb-8">
                                <div
                                    className={cn(
                                        "w-14 h-14 rounded-2xl mb-6",
                                        "flex items-center justify-center",
                                        "border-2 border-white/10 bg-zinc-900 group-hover:scale-110 transition-transform",
                                        tier.color === 'amber' ? "text-amber-500" : 
                                        tier.color === 'blue' ? "text-blue-500" : "text-purple-500"
                                    )}
                                >
                                    {tier.icon}
                                </div>
                                <h3 className="font-handwritten text-3xl text-white mb-2">
                                    {tier.name}
                                </h3>
                                <p className="font-handwritten text-zinc-500 text-lg">
                                    {tier.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="mb-8 font-handwritten">
                                <span className="text-5xl font-bold text-white">
                                    ₹{tier.price}
                                </span>
                                <span className="text-zinc-500 text-xl">
                                    /month
                                </span>
                            </div>

                            <div className="space-y-4 mb-10">
                                {tier.features.map((feature) => (
                                    <div
                                        key={feature}
                                        className="flex items-center gap-3"
                                    >
                                        <div
                                            className="w-6 h-6 rounded-lg border-2 border-white/10 
                                            bg-zinc-900 flex items-center justify-center shrink-0"
                                        >
                                            <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                                        </div>
                                        <span className="font-handwritten text-xl text-zinc-300">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                className={cn(
                                    "w-full h-14 font-handwritten text-xl relative",
                                    "border-2 border-white/10 rounded-2xl",
                                    "transition-all duration-300",
                                    "shadow-[4px_4px_0px_0px] shadow-white/5",
                                    "hover:shadow-[8px_8px_0px_0px] hover:shadow-primary/20",
                                    "hover:translate-x-[-2px] hover:translate-y-[-2px]",
                                    tier.popular
                                        ? [
                                              "bg-primary text-white",
                                              "hover:bg-primary/90",
                                              "active:bg-primary",
                                          ]
                                        : [
                                              "bg-zinc-900 text-white",
                                              "hover:bg-zinc-800",
                                              "active:bg-zinc-900",
                                          ]
                                )}
                            >
                                Start Trading
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute -z-10 inset-0 overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute top-40 left-20 text-6xl rotate-12 text-zinc-700">
                    📈
                </div>
                <div className="absolute bottom-40 right-20 text-6xl -rotate-12 text-zinc-700">
                    💎
                </div>
            </div>
        </div>
    );
}

export { CreativePricing }
