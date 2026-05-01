"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free Explorer",
    description:
      "Basic intelligence for curious market enthusiasts",
    price: 0,
    yearlyPrice: 0,
    buttonText: "Get Started",
    buttonVariant: "outline",
    includes: [
      "Free includes:",
      "Basic Financial Chat",
      "Limit: 3 Images/Files",
      "Community Market Sentiment",
      "Standard Response Speed",
      "20 Daily Credits",
    ],
  },
  {
    name: "Starter Pack",
    description:
      "Advanced toolset for serious retail traders",
    price: 199,
    yearlyPrice: 1999,
    buttonText: "Upgrade Now",
    buttonVariant: "default",
    popular: true,
    includes: [
      "Everything in Free, plus:",
      "Market Simulation Access",
      "Real-time Trade Signals",
      "50 Daily Credits",
      "Priority Signal Assistant",
      "Standard Support",
    ],
  },
  {
    name: "Advance Intelligence",
    description:
      "Elite suite with full simulation and detection tools",
    price: 499,
    yearlyPrice: 4999,
    buttonText: "Go Advance",
    buttonVariant: "outline",
    includes: [
      "Everything in Starter, plus:",
      "Unlimited Images/Files",
      "Market Mood Analysis",
      "Fraud Detection Tools",
      "Portfolio Strategy Engine",
      "100 Daily Credits",
    ],
  },
];

const PricingSwitch = ({ onSwitch }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-neutral-900 border border-gray-700 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit h-10 rounded-full sm:px-6 px-4 sm:py-2 py-1 font-medium transition-colors",
            selected === "0" ? "text-white" : "text-gray-400",
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 to-blue-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit h-10 flex-shrink-0 rounded-full sm:px-6 px-4 sm:py-2 py-1 font-medium transition-colors",
            selected === "1" ? "text-white" : "text-gray-400",
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 to-blue-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">Yearly</span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection6() {
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const pricingRef = useRef(null);
  const { user, upgradePlan, userData } = useAuth();
  const navigate = useNavigate();

  const handlePayment = async (planDisplayName, amount) => {
    // Map display name to internal plan key
    const planKey = planDisplayName === "Starter Pack" ? 'starter' : 
                    planDisplayName === "Advance Intelligence" ? 'advance' : 'free';

    if (planKey === 'free' || amount === 0) {
      navigate("/dashboard");
      return;
    }

    if (userData?.plan === planKey) {
      alert("You are already on this plan.");
      return;
    }

    if (!user) {
      alert("Please login to subscribe.");
      navigate("/auth");
      return;
    }

    setLoadingPlan(planDisplayName);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SfjvFlThIyJM2r", 
      amount: amount * 100, 
      currency: "INR",
      name: "FinMind AI",
      description: `Subscription for ${planDisplayName} Plan`,
      image: "/favicon.png",
      handler: async function (response) {
        try {
          const success = await upgradePlan(planKey);
          if (success) {
            alert("Payment Successful! Welcome to " + planDisplayName);
            navigate("/dashboard");
          } else {
            alert("Payment verified but upgrade failed. Please contact support.");
          }
        } catch (error) {
          console.error("Upgrade error:", error);
          alert("Error upgrading account. Please contact support.");
        } finally {
          setLoadingPlan(null);
        }
      },
      modal: {
        ondismiss: function() {
          setLoadingPlan(null);
        }
      },
      prefill: {
        name: user.displayName || "FinMind User",
        email: user.email || "",
        contact: ""
      },
      theme: {
        color: "#3B82F6"
      }
    };

    try {
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay open error:", err);
      alert("Failed to load Razorpay payment gateway. Please check your internet connection and try again.");
      setLoadingPlan(null);
    }
  };

  const revealVariants = {
    visible: (i) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value) =>
    setIsYearly(parseInt(value) === 1);

  return (
    <div
      className="min-h-screen mx-auto relative bg-[#050507] overflow-x-hidden py-24"
      ref={pricingRef}
    >
      <TimelineContent
        animationNum={4}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute top-0 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] "
      >
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:70px_80px] "></div>
        <SparklesComp
          density={1800}
          direction="bottom"
          speed={1}
          color="#FFFFFF"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </TimelineContent>
      <TimelineContent
        animationNum={5}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute left-0 top-[-114px] w-full h-[113.625vh] flex flex-col items-start justify-start content-start flex-none flex-nowrap gap-2.5 overflow-hidden p-0 z-0 pointer-events-none"
      >
        <div className="framer-1i5axl2">
          <div
            className="absolute left-[-568px] right-[-568px] top-0 h-[2053px] flex-none rounded-full opacity-30"
            style={{
              border: "200px solid #3131f5",
              filter: "blur(92px)",
            }}
          ></div>
        </div>
      </TimelineContent>

      <article className="text-center mb-16 pt-12 max-w-3xl mx-auto space-y-6 relative z-50 px-6">
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.15}
            staggerFrom="first"
            reverse={true}
            containerClassName="justify-center "
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 40,
              delay: 0,
            }}
          >
            Plans that power your growth
          </VerticalCutReveal>
        </h2>

        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-gray-400 text-lg md:text-xl font-medium"
        >
          Institutional-grade intelligence for traders worldwide. Explore the strategy that fits your velocity.
        </TimelineContent>

        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <PricingSwitch onSwitch={togglePricingPeriod} />
        </TimelineContent>
      </article>

      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0 pointer-events-none"
        style={{
          backgroundImage: `
        radial-gradient(circle at center, rgba(32, 108, 232, 0.15) 0%, transparent 70%)
      `,
        }}
      />

      <div className="grid md:grid-cols-3 max-w-6xl gap-6 px-6 mx-auto relative z-50">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={2 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative h-full flex flex-col text-white border-white/5 overflow-hidden ${
                plan.popular
                  ? "bg-neutral-950/50 backdrop-blur-xl border-blue-500/50 shadow-[0px_-13px_100px_-20px_rgba(32,108,232,0.3)] z-20"
                  : "bg-neutral-950/50 backdrop-blur-xl z-10"
              }`}
            >
              <CardHeader className="text-left p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  {plan.popular && (
                    <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-blue-500 text-white rounded-full">
                      Best Value
                    </span>
                  )}
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-5xl font-black ">
                    ₹
                    <NumberFlow
                      format={{
                        style: "decimal",
                      }}
                      value={isYearly ? plan.yearlyPrice : plan.price}
                      className="text-5xl font-black tracking-tighter"
                    />
                  </span>
                  <span className="text-gray-500 ml-1 font-medium">
                    /{isYearly ? "year" : "mo"}
                  </span>
                </div>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{plan.description}</p>
              </CardHeader>

              <CardContent className="p-8 pt-0 flex flex-col grow">
                <button
                  onClick={() => handlePayment(plan.name, isYearly ? plan.yearlyPrice : plan.price)}
                  disabled={loadingPlan === plan.name}
                  className={`w-full mb-8 py-4 text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-gradient-to-t from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-[0_10px_20px_rgba(32,108,232,0.3)] text-white"
                      : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                  } ${loadingPlan === plan.name ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loadingPlan === plan.name ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </button>

                <div className="space-y-4 pt-8 border-t border-white/5">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-gray-500">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-3">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <div className="h-1.5 w-1.5 bg-blue-500 rounded-full shrink-0" />
                        <span className="text-sm text-gray-300 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
    </div>
  );
}
